const Report = require('../models/Report');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Helper function to load image (from local or Cloudinary)
async function loadImage(fileUrl) {
  // Check if it's a Cloudinary URL
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    try {
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading image from Cloudinary:', error.message);
      return null;
    }
  } else {
    // Local file
    const filename = fileUrl.split('/').pop();
    const imagePath = path.join('D:', 'Reporting_app_uploads', filename);
    if (fs.existsSync(imagePath)) {
      return imagePath;
    }
    return null;
  }
}

// Helper function to generate personalized explanations based on room data
function generateCO2Explanation(rooms) {
  const co2Values = rooms.map(r => r.co2Level).filter(v => v);
  const maxCO2 = Math.max(...co2Values);
  const avgCO2 = co2Values.length > 0 ? Math.round(co2Values.reduce((a, b) => a + b) / co2Values.length) : 0;
  
  let explanation = 'Carbon dioxide (CO₂) is a crucial indicator of indoor air quality. ';
  
  if (maxCO2 > 1000) {
    explanation += `In this property, CO₂ levels reached ${maxCO2} ppm, which exceeds 1,000 ppm. At these levels, health effects such as respiratory discomfort, headaches, reduced concentration, and general malaise may occur. `;
  } else if (maxCO2 > 850) {
    explanation += `In this property, CO₂ levels reached ${maxCO2} ppm, which exceeds the acceptable range of 400-850 ppm. While not critically high, additional ventilation is recommended. `;
  } else if (maxCO2 > 400) {
    explanation += `In this property, CO₂ levels ranged from approximately ${Math.min(...co2Values)} to ${maxCO2} ppm, which is within the acceptable range of 400-850 ppm. `;
  } else {
    explanation += `In this property, CO₂ levels were well below the acceptable range. `;
  }
  
  explanation += 'Concentrations between 400 and 850 ppm are considered acceptable, whilst values above this range require additional attention to ensure a healthy indoor environment.';
  
  return explanation;
}

function generateRHExplanation(rooms) {
  const rhValues = rooms.map(r => r.relativeHumidity).filter(v => v);
  const maxRH = Math.max(...rhValues);
  const minRH = Math.min(...rhValues);
  
  let explanation = 'An indoor environment with unsuitable humidity levels may lead to health issues, particularly for individuals with asthma or increased sensitivity. ';
  
  if (maxRH > 60) {
    explanation += `In this property, relative humidity reached ${maxRH}%, which exceeds the ideal range of 40-60%. Excessively humid conditions (above 60%) promote mould growth and can contribute to respiratory issues. `;
  } else if (minRH < 40) {
    explanation += `In this property, relative humidity dropped to ${minRH}%, which falls below the ideal range of 40-60%. Low humidity can cause dry respiratory symptoms. `;
  } else {
    explanation += `In this property, relative humidity remained within the ideal range of 40-60%, which is good for indoor air quality. `;
  }
  
  explanation += 'For people with asthma, it is often recommended to maintain levels between 40% and 50%.';
  
  return explanation;
}

function generatePMExplanation(rooms) {
  const pmValues = rooms.map(r => r.particulateMatter).filter(v => v);
  const maxPM = pmValues.length > 0 ? Math.max(...pmValues) : 0;
  
  let explanation = 'Particulate matter is a collective term for airborne pollutant particles that are small enough to be inhaled and may cause damage to the lungs. ';
  
  if (maxPM > 100) {
    explanation += `In this property, particulate matter levels reached ${maxPM}, which indicates a significant presence of airborne particles. This may suggest the presence of dust, mould spores, or other pollutants requiring attention. `;
  } else if (maxPM > 50) {
    explanation += `In this property, particulate matter levels were moderate at approximately ${maxPM}, indicating some presence of airborne particles. `;
  } else {
    explanation += `In this property, particulate matter levels were relatively low, suggesting good air filtration. `;
  }
  
  explanation += 'Exposure to particulate matter is harmful to health and may also indicate the presence of mould spores. We measured particulate matter using a particle indicator to gain insight into the air quality within the property.';
  
  return explanation;
}

exports.createReport = async (req, res) => {
  try {
    const reportData = {
      ...req.body,
      createdBy: req.userId,
      authorName: `${req.user.firstName} ${req.user.lastName}`,
      authorEmail: req.user.email,
      department: req.user.department
    };

    // Generate report number
    const count = await Report.countDocuments();
    reportData.reportNumber = `RPT-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const report = new Report(reportData);
    await report.save();

    res.status(201).json({
      message: 'Report created successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating report', error: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const { status, reportType, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (reportType) query.reportType = reportType;
    if (startDate || endDate) {
      query.reportDate = {};
      if (startDate) query.reportDate.$gte = new Date(startDate);
      if (endDate) query.reportDate.$lte = new Date(endDate);
    }

    const reports = await Report.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort({ reportDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Report.countDocuments(query);

    res.json({
      reports,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email department')
      .populate('reviewedBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ report });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Save previous version
    report.previousVersions.push({
      versionNumber: report.version,
      modifiedDate: new Date(),
      modifiedBy: `${req.user.firstName} ${req.user.lastName}`,
      changes: req.body.changeDescription || 'Updated'
    });

    Object.assign(report, req.body);
    report.version += 1;

    await report.save();

    res.json({
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating report', error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.comments.push({
      user: req.userId,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      comment: req.body.comment
    });

    await report.save();

    res.json({
      message: 'Comment added successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;

    if (status === 'approved') {
      report.approvedBy = req.userId;
      report.approvalDate = new Date();
    } else if (status === 'pending-review') {
      report.reviewedBy = req.userId;
      report.reviewDate = new Date();
      report.reviewComments = comments;
    }

    await report.save();

    res.json({
      message: 'Report status updated successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

exports.generatePDF = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const PDFDocument = require('pdfkit');
    const path = require('path');
    const fs = require('fs');
    
    const doc = new PDFDocument({ 
      margin: 50,
      size: 'A4',
      bufferPages: true
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Mould-Investigation-${report.reportNumber}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Colors matching Intra Air report
    const colors = {
      primary: '#4A7C7E',
      secondary: '#5A8C8E',
      text: '#333333',
      lightGray: '#F5F5F5',
      red: '#FF0000',
      yellow: '#FFFF00',
      green: '#00FF00'
    };

    // ============ PAGE 1: COVER PAGE ============
    doc.rect(0, 0, doc.page.width, 100).fill(colors.primary);
    doc.fillColor('#FFFFFF')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('RESULTATEN ONDERZOEK RAPPORT', 50, 30, { align: 'center' });
    
    doc.fontSize(10)
       .font('Helvetica')
       .text('Expert in legionellapreventie & geluid-, geur- en luchtonderzoek', 50, 65, { align: 'center' });

    // Company name (large)
    doc.fillColor(colors.text)
       .fontSize(60)
       .font('Helvetica-Bold')
       .text('Intra Air', 50, 200, { align: 'center' });
    
    doc.fontSize(16)
       .font('Helvetica')
       .text('METEN IS WETEN.', 50, 270, { align: 'center' });

    // Report title section (teal background)
    doc.rect(0, 450, doc.page.width, 200).fill(colors.secondary);
    
    doc.fillColor('#FFFFFF')
       .fontSize(36)
       .font('Helvetica-Bold')
       .text('Mould investigation', 50, 480, { align: 'center' });
    
    doc.fontSize(14)
       .font('Helvetica')
       .text(`Location: ${report.inspectionAddress}`, 50, 540, { align: 'center' });
    
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .text(new Date(report.inspectionDate).toLocaleDateString('en-GB'), 50, 570, { align: 'center' });

    // Company address at bottom
    doc.fillColor(colors.text)
       .fontSize(10)
       .font('Helvetica')
       .text('Intra Air', 50, 700, { align: 'center' })
       .text('Hoofdweg 356', 50, 715, { align: 'center' })
       .text('2908LC Capelle aan den Ijssel', 50, 730, { align: 'center' });

    // ============ PAGE 2: ASSIGNMENT DETAILS ============
    doc.addPage();
    
    // Header with logo placeholder
    doc.fillColor(colors.text)
       .fontSize(10)
       .font('Helvetica')
       .text('Intra Air', 50, 30)
       .text('METEN IS WETEN.', 50, 45);

    // Assignment Details Section
    doc.moveDown(3);
    doc.rect(50, doc.y, doc.page.width - 100, 2).fill(colors.primary);
    doc.moveDown(0.5);
    
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor(colors.secondary)
       .text('Assignment Details', 50);
    
    doc.moveDown(0.5);
    doc.rect(50, doc.y, doc.page.width - 100, 2).fill(colors.primary);
    doc.moveDown(1);

    // Details table
    const detailsY = doc.y;
    doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.text);
    
    const details = [
      ['Client', report.clientName],
      ['Inspection Address', report.inspectionAddress],
      ['Contact Person', report.contactPerson],
      ['Property Type', report.propertyType],
      ['Rooms / Measurement Locations', 'Multiple Rooms'],
      ['Carried out by', report.carriedOutBy || report.authorName],
      ['Date of Inspection', new Date(report.inspectionDate).toLocaleDateString('en-GB')],
      ['Date of Report', new Date(report.reportDate).toLocaleDateString('en-GB')]
    ];

    let yPos = detailsY;
    details.forEach(([label, value]) => {
      doc.font('Helvetica-Bold').text(label, 50, yPos, { width: 200, continued: false });
      doc.font('Helvetica').text(value || 'N/A', 270, yPos, { width: 250 });
      yPos += 20;
    });

    // Special Notes
    if (report.specialNotes) {
      doc.moveDown(2);
      doc.fontSize(12).font('Helvetica-Bold').text('Special Notes', 50);
      doc.rect(50, doc.y, doc.page.width - 100, 1).fill(colors.primary);
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(report.specialNotes, 50, doc.y, { 
        width: doc.page.width - 100,
        align: 'justify'
      });
    }

    // Investigation Findings
    if (report.investigationFindingsText) {
      doc.moveDown(3);
      doc.rect(50, doc.y, doc.page.width - 100, 2).fill(colors.primary);
      doc.moveDown(0.5);
      
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor(colors.secondary)
         .text('Investigation Findings', 50);
      
      doc.moveDown(0.5);
      doc.rect(50, doc.y, doc.page.width - 100, 2).fill(colors.primary);
      doc.moveDown(1);
      
      doc.fontSize(10).font('Helvetica').fillColor(colors.text)
         .text(report.investigationFindingsText, 50, doc.y, { 
           width: doc.page.width - 100,
           align: 'justify'
         });
      
      doc.moveDown(1);
      doc.fontSize(10).font('Helvetica-Oblique')
         .text('Below is a detailed description of the investigation, the results, and our recommendations.', 50, doc.y, {
           width: doc.page.width - 100,
           align: 'center'
         });
    }

    // ============ PAGE 3: LETTER INTRODUCTION ============
    if (report.letterIntroduction) {
      doc.addPage();
      
      doc.fontSize(10).font('Helvetica').fillColor(colors.text)
         .text('Intra Air', 50, 30);
      
      // Add logo placeholder
      doc.moveDown(2);
      
      doc.fontSize(10).font('Helvetica')
         .text(report.letterIntroduction, 50, doc.y, {
           width: doc.page.width - 100,
           align: 'justify'
         });
    }

    // ============ PAGE 3+: RESULTS ============
    doc.addPage();
    
    doc.fontSize(10).font('Helvetica').fillColor(colors.text)
       .text('Intra Air', 50, 30)
       .text('METEN IS WETEN.', 50, 45);

    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica-Bold').text('RESULTS OF THE INVESTIGATION AND FINDINGS', 50);
    
    doc.moveDown(1);
    doc.fontSize(11).font('Helvetica-Bold').text('I. Average Results of the Air Quality Assessment:', 50);
    doc.moveDown(0.5);
    
    // Section I intro text (if provided)
    if (report.section1IntroText) {
      doc.fontSize(10).font('Helvetica').text(
        report.section1IntroText,
        50, doc.y, { width: doc.page.width - 100, align: 'justify' }
      );
      doc.moveDown(0.5);
    } else {
      doc.fontSize(10).font('Helvetica').text(
        'The standard air quality assessment includes measurements of temperature, relative humidity (RH), carbon dioxide (CO₂), and particulate matter (PM 2.5). Deviations from the normal values of these four parameters may contribute to various health complaints.',
        50, doc.y, { width: doc.page.width - 100, align: 'justify' }
      );
    }

    // Rooms table with colors
    if (report.rooms && report.rooms.length > 0) {
      // Room numbers line
      const roomNumbers = report.rooms.map(r => r.roomNumber).join(', ');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(
        `For this assessment, ${report.rooms.length} measurement location(s) were selected, namely rooms numbered: ${roomNumbers}.`,
        50, doc.y, { width: doc.page.width - 100 }
      );

      doc.moveDown(1);
      
      const tableTop = doc.y;
      const tableLeft = 50;
      const colWidths = [80, 80, 80, 100, 80];
      const rowHeight = 25;

      // Table header
      doc.rect(tableLeft, tableTop, colWidths.reduce((a, b) => a + b), rowHeight)
         .fill(colors.primary);
      
      doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
      doc.text('Room number', tableLeft + 5, tableTop + 8, { width: colWidths[0] - 10 });
      doc.text('Temp\n(18-22°C)', tableLeft + colWidths[0] + 5, tableTop + 5, { width: colWidths[1] - 10 });
      doc.text('RH\n(40-60%)', tableLeft + colWidths[0] + colWidths[1] + 5, tableTop + 5, { width: colWidths[2] - 10 });
      doc.text('CO₂\n(400-850 PPM)', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, tableTop + 5, { width: colWidths[3] - 10 });
      doc.text('PM\n(> P.M. 2.5)', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, tableTop + 5, { width: colWidths[4] - 10 });

      let currentY = tableTop + rowHeight;

      report.rooms.forEach((room) => {
        // Determine colors based on status fields
        const tempColor = room.temperatureStatus === 'critical' ? colors.red : 
                         room.temperatureStatus === 'warning' ? colors.yellow : colors.green;
        const rhColor = room.humidityStatus === 'critical' ? colors.red :
                       room.humidityStatus === 'warning' ? colors.yellow : colors.green;
        const co2Color = room.co2Status === 'critical' ? colors.red :
                        room.co2Status === 'warning' ? colors.yellow : colors.green;
        const pmColor = room.pmStatus === 'critical' ? colors.red :
                       room.pmStatus === 'warning' ? colors.yellow : colors.green;

        // Room number
        doc.rect(tableLeft, currentY, colWidths[0], rowHeight).stroke();
        doc.fillColor(colors.text).fontSize(9).font('Helvetica')
           .text(room.roomNumber || 'N/A', tableLeft + 5, currentY + 8, { width: colWidths[0] - 10 });

        // Temperature
        doc.rect(tableLeft + colWidths[0], currentY, colWidths[1], rowHeight).fillAndStroke(tempColor, '#000000');
        doc.fillColor('#000000').text(room.temperature ? `${room.temperature} °C` : 'N/A', 
          tableLeft + colWidths[0] + 5, currentY + 8, { width: colWidths[1] - 10 });

        // RH
        doc.rect(tableLeft + colWidths[0] + colWidths[1], currentY, colWidths[2], rowHeight).fillAndStroke(rhColor, '#000000');
        doc.fillColor('#000000').text(room.relativeHumidity ? `${room.relativeHumidity}%` : 'N/A',
          tableLeft + colWidths[0] + colWidths[1] + 5, currentY + 8, { width: colWidths[2] - 10 });

        // CO2
        doc.rect(tableLeft + colWidths[0] + colWidths[1] + colWidths[2], currentY, colWidths[3], rowHeight).fillAndStroke(co2Color, '#000000');
        doc.fillColor('#000000').text(room.co2Level ? `${room.co2Level} PPM` : 'N/A',
          tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, currentY + 8, { width: colWidths[3] - 10 });

        // PM
        doc.rect(tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY, colWidths[4], rowHeight).fillAndStroke(pmColor, '#000000');
        doc.fillColor(colors.text).text(room.particulateMatter || 'N/A',
          tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, currentY + 8, { width: colWidths[4] - 10 });

        currentY += rowHeight;
      });

      doc.moveDown(report.rooms.length + 2);

      // Section I conclusion text (if provided)
      if (report.section1ConclusionText) {
        doc.fontSize(10).font('Helvetica').fillColor(colors.text).text(
          report.section1ConclusionText,
          50, doc.y, { width: doc.page.width - 100, align: 'justify' }
        );
      } else {
        // Explanation text
        doc.fontSize(10).font('Helvetica').fillColor(colors.text).text(
          'The results of the standard air quality assessment demonstrate that elevated levels of temperature, relative humidity, carbon dioxide (CO₂), and particulate matter were identified in multiple rooms.',
          50, doc.y, { width: doc.page.width - 100, align: 'justify' }
        );
      }
    }

    // ============ PAGE 4: CO2, RH, PM EXPLANATIONS ============
    doc.addPage();
    doc.fontSize(10).font('Helvetica').fillColor(colors.text)
       .text('Intra Air', 50, 30)
       .text('METEN IS WETEN.', 50, 45);

    doc.moveDown(1);
    doc.fontSize(11).font('Helvetica-Bold').text('CO₂', 50);
    doc.moveDown(0.3);
    doc.rect(50, doc.y, doc.page.width - 100, 1).fill(colors.primary);
    doc.moveDown(0.5);
    
    const co2Explanation = generateCO2Explanation(report.rooms);
    doc.fontSize(10).font('Helvetica').text(co2Explanation, 50, doc.y, { width: doc.page.width - 100, align: 'justify' });

    doc.moveDown(1);
    doc.fontSize(11).font('Helvetica-Bold').text('RH', 50);
    doc.moveDown(0.3);
    doc.rect(50, doc.y, doc.page.width - 100, 1).fill(colors.primary);
    doc.moveDown(0.5);
    
    const rhExplanation = generateRHExplanation(report.rooms);
    doc.fontSize(10).font('Helvetica').text(rhExplanation, 50, doc.y, { width: doc.page.width - 100, align: 'justify' });

    doc.moveDown(1);
    doc.fontSize(11).font('Helvetica-Bold').text('PM', 50);
    doc.moveDown(0.3);
    doc.rect(50, doc.y, doc.page.width - 100, 1).fill(colors.primary);
    doc.moveDown(0.5);
    
    const pmExplanation = generatePMExplanation(report.rooms);
    doc.fontSize(10).font('Helvetica').text(pmExplanation, 50, doc.y, { width: doc.page.width - 100, align: 'justify' });

    // ============ PAGE 5: ADDITIONAL MEASUREMENTS ============
    doc.addPage();
    doc.fontSize(10).font('Helvetica').fillColor(colors.text)
       .text('Intra Air', 50, 30)
       .text('METEN IS WETEN.', 50, 45);

    doc.moveDown(1);
    doc.fontSize(11).font('Helvetica-Bold').fillColor(colors.text)
       .text('II. Additional Air Quality Measurements', 50);

    doc.moveDown(0.5);
    
    // Section II intro text (if provided)
    if (report.section2IntroText) {
      doc.fontSize(10).font('Helvetica').text(
        report.section2IntroText,
        50, doc.y, { width: doc.page.width - 100, align: 'justify' }
      );
    } else {
      doc.fontSize(10).font('Helvetica').text(
        'Additional air quality measurements were carried out to assess oxygen levels and the presence of formaldehyde (CH₂O) and/or volatile organic compounds (VOCs). Exceedance of the guideline values for these three parameters may also result in health complaints.',
        50, doc.y, { width: doc.page.width - 100, align: 'justify' }
      );
    }

    // Global Air Quality Table (Section II)
    if (report.globalAirQuality) {
      doc.moveDown(1);
      
      const addTableTop = doc.y;
      const addTableLeft = 50;
      const addColWidths = [120, 120, 120, 120];
      const addRowHeight = 20;

      // Header
      doc.rect(addTableLeft, addTableTop, addColWidths.reduce((a, b) => a + b), addRowHeight).fill(colors.primary);
      
      doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
      doc.text('LOCATION', addTableLeft + 5, addTableTop + 5, { width: addColWidths[0] - 10 });
      doc.text('Oxygen', addTableLeft + addColWidths[0] + 5, addTableTop + 5, { width: addColWidths[1] - 10 });
      doc.text('CH₂O', addTableLeft + addColWidths[0] + addColWidths[1] + 5, addTableTop + 5, { width: addColWidths[2] - 10 });
      doc.text('VOC', addTableLeft + addColWidths[0] + addColWidths[1] + addColWidths[2] + 5, addTableTop + 5, { width: addColWidths[3] - 10 });

      let addCurrentY = addTableTop + addRowHeight;

      // Single row for global measurements
      doc.rect(addTableLeft, addCurrentY, addColWidths[0], addRowHeight).fillAndStroke(colors.green, '#000000');
      doc.fillColor('#000000').fontSize(9).font('Helvetica')
         .text(report.globalAirQuality.location || 'Hotel', addTableLeft + 5, addCurrentY + 6, { width: addColWidths[0] - 10 });

      doc.rect(addTableLeft + addColWidths[0], addCurrentY, addColWidths[1], addRowHeight).fillAndStroke(colors.green, '#000000');
      doc.fillColor('#000000').text(report.globalAirQuality.oxygen || 'N/A', addTableLeft + addColWidths[0] + 5, addCurrentY + 6, { width: addColWidths[1] - 10 });

      doc.rect(addTableLeft + addColWidths[0] + addColWidths[1], addCurrentY, addColWidths[2], addRowHeight).fillAndStroke(colors.green, '#000000');
      doc.fillColor('#000000').text(report.globalAirQuality.formaldehyde || 'None', addTableLeft + addColWidths[0] + addColWidths[1] + 5, addCurrentY + 6, { width: addColWidths[2] - 10 });

      doc.rect(addTableLeft + addColWidths[0] + addColWidths[1] + addColWidths[2], addCurrentY, addColWidths[3], addRowHeight).fillAndStroke(colors.green, '#000000');
      doc.fillColor('#000000').text(report.globalAirQuality.voc || 'None', addTableLeft + addColWidths[0] + addColWidths[1] + addColWidths[2] + 5, addCurrentY + 6, { width: addColWidths[3] - 10 });

      doc.moveDown(3);
      
      // Section II conclusion text (if provided)
      if (report.section2ConclusionText) {
        doc.fontSize(10).font('Helvetica').fillColor(colors.text).text(
          report.section2ConclusionText,
          50, doc.y, { width: doc.page.width - 100, align: 'justify' }
        );
      }
    }

    // ============ MICROBIOLOGICAL RESULTS ============
    if (report.rooms && report.rooms.some(r => r.airSamples && r.airSamples.length > 0)) {
      doc.addPage();
      
      doc.fontSize(10).font('Helvetica').fillColor(colors.text)
         .text('Intra Air', 50, 30)
         .text('METEN IS WETEN.', 50, 45);

      doc.moveDown(1);
      doc.fontSize(11).font('Helvetica-Bold').text('III. Microbiological Air Investigation Results', 50);
      doc.moveDown(0.5);
      
      // Section III intro text (if provided)
      if (report.section3IntroText) {
        doc.fontSize(10).font('Helvetica').text(
          report.section3IntroText,
          50, doc.y, { width: doc.page.width - 100, align: 'justify' }
        );
      } else {
        doc.fontSize(10).font('Helvetica').text(
          'Air samples were collected using an air sampler, drawing moulds and yeasts onto OGEY agar plates at multiple locations within the property. In addition, a reference sample was taken from the outdoor air. Surface contact samples were collected using RODAC contact plates, whereby moulds and yeasts were sampled from various surfaces in the rooms by briefly pressing the agar surface against the substrate. The results of this investigation indicate a very high concentration of mould spores in several hotel rooms.',
          50, doc.y, { width: doc.page.width - 100, align: 'justify' }
        );
      }

      doc.moveDown(1);

      report.rooms.forEach((room) => {
        if (room.airSamples && room.airSamples.length > 0) {
          // Room sample table
          const tableTop = doc.y;
          const tableLeft = 50;
          const colWidths = [100, 60, 60, 120, 80];

          // Header
          doc.rect(tableLeft, tableTop, colWidths.reduce((a, b) => a + b), 20).fill(colors.primary);
          doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
          doc.text('Sample location', tableLeft + 5, tableTop + 6);
          doc.text('Type', tableLeft + colWidths[0] + 5, tableTop + 6);
          doc.text('Species', tableLeft + colWidths[0] + colWidths[1] + 5, tableTop + 6);
          doc.text('Identified Mould Species', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, tableTop + 6);
          doc.text('Total Quantity', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, tableTop + 6);

          let currentY = tableTop + 20;

          room.airSamples.forEach((sample) => {
            // Determine color based on quantity
            let bgColor = '#51CF66'; // green default
            let textColor = '#000000'; // black text for light backgrounds
            const quantity = sample.totalQuantity ? sample.totalQuantity.toLowerCase() : '';
            if (quantity.includes('overgrowth') || parseInt(quantity) > 1000) {
              bgColor = '#FF6B6B'; // red
              textColor = '#FFFFFF'; // white text for red background
            } else if (parseInt(quantity) > 500) {
              bgColor = '#FFD93D'; // yellow
              textColor = '#000000'; // black text for yellow background
            }

            doc.rect(tableLeft, currentY, colWidths[0], 20).fillAndStroke(bgColor, '#000000');
            doc.fillColor(textColor).fontSize(8).font('Helvetica')
               .text(sample.sampleLocation || `Room ${room.roomNumber}`, tableLeft + 5, currentY + 6);

            doc.rect(tableLeft + colWidths[0], currentY, colWidths[1], 20).fillAndStroke(bgColor, '#000000');
            doc.fillColor(textColor).text(sample.type || 'Air', tableLeft + colWidths[0] + 5, currentY + 6);

            doc.rect(tableLeft + colWidths[0] + colWidths[1], currentY, colWidths[2], 20).fillAndStroke(bgColor, '#000000');
            doc.fillColor(textColor).text(sample.species || 'Mould', tableLeft + colWidths[0] + colWidths[1] + 5, currentY + 6);

            doc.rect(tableLeft + colWidths[0] + colWidths[1] + colWidths[2], currentY, colWidths[3], 20).fillAndStroke(bgColor, '#000000');
            doc.fillColor(textColor).text(sample.identifiedMouldSpecies || 'N/A', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + 5, currentY + 6);

            doc.rect(tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY, colWidths[4], 20).fillAndStroke(bgColor, '#000000');
            doc.fillColor(textColor).fontSize(8).font('Helvetica-Bold')
               .text(sample.totalQuantity || 'N/A', tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, currentY + 6);

            currentY += 20;
          });

          doc.moveDown(2);
        }
      });
      
      // Section III conclusion text (if provided)
      if (report.section3ConclusionText) {
        doc.moveDown(1);
        doc.fontSize(10).font('Helvetica').fillColor(colors.text).text(
          report.section3ConclusionText,
          50, doc.y, { width: doc.page.width - 100, align: 'justify' }
        );
      }
    }

    // ============ CONCLUSION ============
    if (report.conclusion) {
      doc.addPage();
      
      doc.fontSize(10).font('Helvetica').fillColor(colors.text)
         .text('Intra Air', 50, 30);

      doc.moveDown(2);
      doc.fontSize(12).font('Helvetica-Bold').text('IV. Conclusion', 50);
      doc.moveDown(1);
      
      doc.fontSize(10).font('Helvetica').text(report.conclusion, 50, doc.y, {
        width: doc.page.width - 100,
        align: 'justify'
      });
    }

    // ============ RECOMMENDATIONS ============
    if (report.recommendations && report.recommendations.length > 0) {
      doc.moveDown(2);
      doc.fontSize(12).font('Helvetica-Bold').text('Summary of Recommendations', 50);
      doc.moveDown(1);

      doc.fontSize(10).font('Helvetica');
      report.recommendations.forEach((rec, index) => {
        doc.text(`• ${rec.recommendation}`, 60, doc.y, {
          width: doc.page.width - 120,
          align: 'justify'
        });
        doc.moveDown(0.5);
      });
    }

    // ============ SUPPORT & CONTACT ============
    if (report.supportText) {
      doc.moveDown(2);
      doc.fontSize(12).font('Helvetica-Bold').text('Our Support', 50);
      doc.moveDown(1);
      
      doc.fontSize(10).font('Helvetica').text(report.supportText, 50, doc.y, {
        width: doc.page.width - 100,
        align: 'justify'
      });
    }

    // ============ APPENDIX: PHOTOS ============
    if ((report.rooms && report.rooms.some(r => r.photos && r.photos.length > 0)) || 
        (report.generalPhotos && report.generalPhotos.length > 0)) {
      doc.addPage();
      
      doc.fontSize(10).font('Helvetica').fillColor(colors.text)
         .text('Intra Air', 50, 30);

      doc.moveDown(2);
      doc.fontSize(14).font('Helvetica-Bold').text('Appendix 2: Photographs', 50);
      doc.moveDown(2);

      // Room photos
      for (const room of report.rooms) {
        if (room.photos && room.photos.length > 0) {
          doc.fontSize(12).font('Helvetica-Bold').text(`Room ${room.roomNumber}`, 50);
          doc.moveDown(1);

          for (let i = 0; i < room.photos.length; i++) {
            const photo = room.photos[i];
            const imageData = await loadImage(photo.fileUrl);

            if (imageData) {
              try {
                // Add image
                const imgWidth = 500;
                const imgHeight = 350;
                
                if (doc.y + imgHeight > doc.page.height - 100) {
                  doc.addPage();
                  doc.fontSize(10).font('Helvetica').text('Intra Air', 50, 30);
                  doc.moveDown(2);
                }

                doc.image(imageData, 50, doc.y, {
                  width: imgWidth,
                  height: imgHeight,
                  fit: [imgWidth, imgHeight],
                  align: 'center'
                });

                doc.moveDown(imgHeight / 20);

                if (photo.description) {
                  doc.fontSize(9).font('Helvetica-Oblique')
                     .text(photo.description, 50, doc.y, { width: imgWidth, align: 'center' });
                  doc.moveDown(1);
                }

                doc.moveDown(2);
              } catch (err) {
                console.error('Error adding image:', err);
              }
            } else {
              console.error('Image not found:', photo.fileUrl);
            }
          }
        }
      }
      
      // General photos (not tied to rooms)
      if (report.generalPhotos && report.generalPhotos.length > 0) {
        doc.fontSize(12).font('Helvetica-Bold').text('General Photographs', 50);
        doc.moveDown(1);

        for (let i = 0; i < report.generalPhotos.length; i++) {
          const photo = report.generalPhotos[i];
          const imageData = await loadImage(photo.fileUrl);

          if (imageData) {
            try {
              // Add image
              const imgWidth = 500;
              const imgHeight = 350;
              
              if (doc.y + imgHeight > doc.page.height - 100) {
                doc.addPage();
                doc.fontSize(10).font('Helvetica').text('Intra Air', 50, 30);
                doc.moveDown(2);
              }

              doc.image(imageData, 50, doc.y, {
                width: imgWidth,
                height: imgHeight,
                fit: [imgWidth, imgHeight],
                align: 'center'
              });

              doc.moveDown(imgHeight / 20);

              if (photo.caption) {
                doc.fontSize(9).font('Helvetica-Oblique')
                   .text(photo.caption, 50, doc.y, { width: imgWidth, align: 'center' });
                doc.moveDown(1);
              }

              doc.moveDown(2);
            } catch (err) {
              console.error('Error adding general photo:', err);
            }
          } else {
            console.error('General photo not found:', photo.fileUrl);
          }
        }
      }
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
};

exports.generateExcel = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    // Header
    worksheet.columns = [
      { header: 'Field', key: 'field', width: 30 },
      { header: 'Value', key: 'value', width: 50 }
    ];

    // Add data
    worksheet.addRow({ field: 'Report Number', value: report.reportNumber });
    worksheet.addRow({ field: 'Report Title', value: report.reportTitle });
    worksheet.addRow({ field: 'Report Type', value: report.reportType });
    worksheet.addRow({ field: 'Report Date', value: report.reportDate.toLocaleDateString() });
    worksheet.addRow({ field: 'Author', value: report.authorName });
    worksheet.addRow({ field: 'Department', value: report.department });
    worksheet.addRow({ field: 'Status', value: report.status });
    worksheet.addRow({ field: 'Total Revenue', value: report.totalRevenue });
    worksheet.addRow({ field: 'Total Expenses', value: report.totalExpenses });
    worksheet.addRow({ field: 'Net Profit', value: report.netProfit });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=report-${report.reportNumber}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Error generating Excel', error: error.message });
  }
};
