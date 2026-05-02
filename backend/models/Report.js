const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // Report Identification
  reportNumber: {
    type: String,
    required: true,
    unique: true
  },
  reportTitle: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    required: true,
    enum: ['mould-investigation', 'air-quality', 'legionella', 'sound-measurement', 'custom']
  },
  investigationType: {
    type: String,
    enum: ['mould', 'air-quality', 'legionella', 'sound', 'odor', 'other']
  },
  language: {
    type: String,
    enum: ['en', 'fr', 'nl'],
    default: 'en'
  },
  
  // Date Information
  reportDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  inspectionDate: {
    type: Date,
    required: true
  },
  periodStart: {
    type: Date
  },
  periodEnd: {
    type: Date
  },
  
  // Client & Location Information
  clientName: {
    type: String,
    required: true
  },
  inspectionAddress: {
    type: String,
    required: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    enum: ['hotel', 'office', 'residential', 'industrial', 'commercial', 'other']
  },
  
  // Author Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  carriedOutBy: {
    type: String
  },
  authorEmail: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    default: 'Intra Air'
  },
  companyAddress: {
    type: String
  },
  
  // Report Content
  summary: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  objectives: [{
    type: String
  }],
  specialNotes: {
    type: String
  },
  
  // Investigation Findings (bullet points after basic info)
  investigationFindingsText: {
    type: String
  },
  
  // Letter Introduction (Dear Mr...)
  letterIntroduction: {
    type: String
  },
  
  // Section Texts (for PDF structure)
  section1IntroText: {
    type: String
  },
  section1ConclusionText: {
    type: String
  },
  section2IntroText: {
    type: String
  },
  section2ConclusionText: {
    type: String
  },
  section3IntroText: {
    type: String
  },
  section3ConclusionText: {
    type: String
  },
  
  // Support/Contact Section (after recommendations)
  supportText: {
    type: String
  },
  
  // Global Air Quality Measurements (Section II)
  globalAirQuality: {
    location: String,
    oxygen: String,
    formaldehyde: String,
    voc: String
  },
  
  // Room/Location Measurements
  rooms: [{
    roomNumber: String,
    roomName: String,
    floor: String,
    
    // Air Quality Measurements (Section I only) with status indicators
    temperature: Number, // °C
    temperatureStatus: {
      type: String,
      enum: ['normal', 'warning', 'critical'],
      default: 'normal'
    },
    relativeHumidity: Number, // %
    humidityStatus: {
      type: String,
      enum: ['normal', 'warning', 'critical'],
      default: 'normal'
    },
    co2Level: Number, // PPM
    co2Status: {
      type: String,
      enum: ['normal', 'warning', 'critical'],
      default: 'normal'
    },
    particulateMatter: Number, // PM 2.5
    pmStatus: {
      type: String,
      enum: ['normal', 'warning', 'critical'],
      default: 'normal'
    },
    
    // Microbiological Results (Section III)
    airSamples: [{
      sampleLocation: String, // Auto-filled with room number
      type: {
        type: String,
        enum: ['Air', 'Contact', 'Swab']
      },
      species: {
        type: String,
        enum: ['Mould', 'Yeast', 'Bacteria', 'Other']
      },
      identifiedMouldSpecies: String,
      totalQuantity: String, // Can be "Overgrowth" or numeric value
      unit: String // cfu/m³ or cfu/plate
    }],
    
    // Visual Observations
    visibleMould: Boolean,
    mouldLocation: String,
    condensation: Boolean,
    leakage: Boolean,
    leakageSource: String,
    waterDamage: Boolean,
    ventilationIssues: Boolean,
    
    // Moisture Measurements
    moistureReadings: [{
      location: String,
      value: Number,
      unit: String
    }],
    
    // Photos
    photos: [{
      fileName: String,
      fileUrl: String,
      description: String,
      uploadDate: Date
    }],
    
    notes: String
  }],
  
  // Financial Data
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalExpenses: {
    type: Number,
    default: 0
  },
  netProfit: {
    type: Number,
    default: 0
  },
  budget: {
    type: Number,
    default: 0
  },
  
  // Performance Metrics
  performanceScore: {
    type: Number,
    min: 0,
    max: 100
  },
  completionRate: {
    type: Number,
    min: 0,
    max: 100
  },
  qualityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  
  // Project/Activity Details
  projectName: {
    type: String
  },
  projectCode: {
    type: String
  },
  activities: [{
    activityName: String,
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'pending', 'cancelled']
    },
    completionDate: Date,
    notes: String
  }],
  
  // Investigation Findings (Summary)
  investigationFindings: [{
    finding: String,
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'info']
    }
  }],
  
  // Key Findings
  keyFindings: [{
    finding: String,
    impact: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    recommendation: String
  }],
  
  // Risks and Issues
  risks: [{
    riskDescription: String,
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low']
    },
    mitigation: String,
    status: {
      type: String,
      enum: ['open', 'mitigated', 'closed']
    }
  }],
  
  // Recommendations
  recommendations: [{
    recommendation: String,
    priority: {
      type: String,
      enum: ['urgent', 'high', 'medium', 'low']
    },
    targetDate: Date,
    category: String
  }],
  
  // Proposed Measures
  proposedMeasures: {
    type: String
  },
  
  // Conclusion
  conclusion: {
    type: String
  },
  
  // Stakeholders
  stakeholders: [{
    name: String,
    role: String,
    email: String,
    involvement: String
  }],
  
  // Attachments
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // General Photos (Appendix 2 - not tied to rooms)
  generalPhotos: [{
    fileName: String,
    fileUrl: String,
    caption: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status and Approval
  status: {
    type: String,
    required: true,
    enum: ['draft', 'pending-review', 'approved', 'rejected', 'published'],
    default: 'draft'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewDate: {
    type: Date
  },
  reviewComments: {
    type: String
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: {
    type: Date
  },
  
  // Additional Metadata
  tags: [{
    type: String
  }],
  category: {
    type: String
  },
  priority: {
    type: String,
    enum: ['urgent', 'high', 'normal', 'low'],
    default: 'normal'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'private'
  },
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    versionNumber: Number,
    modifiedDate: Date,
    modifiedBy: String,
    changes: String
  }],
  
  // Comments and Notes
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    comment: String,
    commentDate: {
      type: Date,
      default: Date.now
    }
  }],
  internalNotes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
reportSchema.index({ reportNumber: 1 });
reportSchema.index({ reportDate: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ createdBy: 1 });
reportSchema.index({ reportType: 1 });

module.exports = mongoose.model('Report', reportSchema);
