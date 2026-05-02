import React, { useState } from 'react';
import '../styles/DetailedStatistics.css';

function DetailedStatistics({ reports }) {
  const [selectedReport, setSelectedReport] = useState(null);
  const [viewMode, setViewMode] = useState('global'); // 'global' or 'byRoom'

  // Calculate global statistics across all reports
  const calculateGlobalStats = () => {
    if (!reports || reports.length === 0) return null;

    let totalRooms = 0;
    let tempSum = 0, tempCount = 0;
    let rhSum = 0, rhCount = 0;
    let co2Sum = 0, co2Count = 0;
    let pmSum = 0, pmCount = 0;
    let totalAirSamples = 0;
    let totalPhotos = 0;

    let tempCritical = 0, tempWarning = 0, tempNormal = 0;
    let rhCritical = 0, rhWarning = 0, rhNormal = 0;
    let co2Critical = 0, co2Warning = 0, co2Normal = 0;
    let pmCritical = 0, pmWarning = 0, pmNormal = 0;

    reports.forEach(report => {
      if (report.rooms && report.rooms.length > 0) {
        totalRooms += report.rooms.length;
        
        report.rooms.forEach(room => {
          // Temperature
          if (room.temperature) {
            tempSum += room.temperature;
            tempCount++;
            if (room.temperatureStatus === 'critical') tempCritical++;
            else if (room.temperatureStatus === 'warning') tempWarning++;
            else tempNormal++;
          }

          // Humidity
          if (room.relativeHumidity) {
            rhSum += room.relativeHumidity;
            rhCount++;
            if (room.humidityStatus === 'critical') rhCritical++;
            else if (room.humidityStatus === 'warning') rhWarning++;
            else rhNormal++;
          }

          // CO2
          if (room.co2Level) {
            co2Sum += room.co2Level;
            co2Count++;
            if (room.co2Status === 'critical') co2Critical++;
            else if (room.co2Status === 'warning') co2Warning++;
            else co2Normal++;
          }

          // PM
          if (room.particulateMatter) {
            pmSum += room.particulateMatter;
            pmCount++;
            if (room.pmStatus === 'critical') pmCritical++;
            else if (room.pmStatus === 'warning') pmWarning++;
            else pmNormal++;
          }

          // Air Samples
          if (room.airSamples) {
            totalAirSamples += room.airSamples.length;
          }

          // Photos
          if (room.photos) {
            totalPhotos += room.photos.length;
          }
        });
      }
    });

    return {
      totalReports: reports.length,
      totalRooms,
      avgTemp: tempCount > 0 ? (tempSum / tempCount).toFixed(1) : 'N/A',
      avgRH: rhCount > 0 ? (rhSum / rhCount).toFixed(1) : 'N/A',
      avgCO2: co2Count > 0 ? Math.round(co2Sum / co2Count) : 'N/A',
      avgPM: pmCount > 0 ? Math.round(pmSum / pmCount) : 'N/A',
      totalAirSamples,
      totalPhotos,
      statusBreakdown: {
        temperature: { critical: tempCritical, warning: tempWarning, normal: tempNormal },
        humidity: { critical: rhCritical, warning: rhWarning, normal: rhNormal },
        co2: { critical: co2Critical, warning: co2Warning, normal: co2Normal },
        pm: { critical: pmCritical, warning: pmWarning, normal: pmNormal }
      }
    };
  };

  // Calculate statistics for a specific report
  const calculateReportStats = (report) => {
    if (!report || !report.rooms || report.rooms.length === 0) return null;

    let tempSum = 0, tempCount = 0, tempMin = Infinity, tempMax = -Infinity;
    let rhSum = 0, rhCount = 0, rhMin = Infinity, rhMax = -Infinity;
    let co2Sum = 0, co2Count = 0, co2Min = Infinity, co2Max = -Infinity;
    let pmSum = 0, pmCount = 0, pmMin = Infinity, pmMax = -Infinity;
    let totalAirSamples = 0;
    let totalPhotos = 0;

    let tempCritical = 0, tempWarning = 0, tempNormal = 0;
    let rhCritical = 0, rhWarning = 0, rhNormal = 0;
    let co2Critical = 0, co2Warning = 0, co2Normal = 0;
    let pmCritical = 0, pmWarning = 0, pmNormal = 0;

    report.rooms.forEach(room => {
      // Temperature
      if (room.temperature) {
        tempSum += room.temperature;
        tempCount++;
        tempMin = Math.min(tempMin, room.temperature);
        tempMax = Math.max(tempMax, room.temperature);
        if (room.temperatureStatus === 'critical') tempCritical++;
        else if (room.temperatureStatus === 'warning') tempWarning++;
        else tempNormal++;
      }

      // Humidity
      if (room.relativeHumidity) {
        rhSum += room.relativeHumidity;
        rhCount++;
        rhMin = Math.min(rhMin, room.relativeHumidity);
        rhMax = Math.max(rhMax, room.relativeHumidity);
        if (room.humidityStatus === 'critical') rhCritical++;
        else if (room.humidityStatus === 'warning') rhWarning++;
        else rhNormal++;
      }

      // CO2
      if (room.co2Level) {
        co2Sum += room.co2Level;
        co2Count++;
        co2Min = Math.min(co2Min, room.co2Level);
        co2Max = Math.max(co2Max, room.co2Level);
        if (room.co2Status === 'critical') co2Critical++;
        else if (room.co2Status === 'warning') co2Warning++;
        else co2Normal++;
      }

      // PM
      if (room.particulateMatter) {
        pmSum += room.particulateMatter;
        pmCount++;
        pmMin = Math.min(pmMin, room.particulateMatter);
        pmMax = Math.max(pmMax, room.particulateMatter);
        if (room.pmStatus === 'critical') pmCritical++;
        else if (room.pmStatus === 'warning') pmWarning++;
        else pmNormal++;
      }

      // Air Samples
      if (room.airSamples) {
        totalAirSamples += room.airSamples.length;
      }

      // Photos
      if (room.photos) {
        totalPhotos += room.photos.length;
      }
    });

    return {
      totalRooms: report.rooms.length,
      temperature: {
        avg: tempCount > 0 ? (tempSum / tempCount).toFixed(1) : 'N/A',
        min: tempMin !== Infinity ? tempMin.toFixed(1) : 'N/A',
        max: tempMax !== -Infinity ? tempMax.toFixed(1) : 'N/A',
        critical: tempCritical,
        warning: tempWarning,
        normal: tempNormal
      },
      humidity: {
        avg: rhCount > 0 ? (rhSum / rhCount).toFixed(1) : 'N/A',
        min: rhMin !== Infinity ? rhMin.toFixed(1) : 'N/A',
        max: rhMax !== -Infinity ? rhMax.toFixed(1) : 'N/A',
        critical: rhCritical,
        warning: rhWarning,
        normal: rhNormal
      },
      co2: {
        avg: co2Count > 0 ? Math.round(co2Sum / co2Count) : 'N/A',
        min: co2Min !== Infinity ? co2Min : 'N/A',
        max: co2Max !== -Infinity ? co2Max : 'N/A',
        critical: co2Critical,
        warning: co2Warning,
        normal: co2Normal
      },
      pm: {
        avg: pmCount > 0 ? Math.round(pmSum / pmCount) : 'N/A',
        min: pmMin !== Infinity ? Math.round(pmMin) : 'N/A',
        max: pmMax !== -Infinity ? Math.round(pmMax) : 'N/A',
        critical: pmCritical,
        warning: pmWarning,
        normal: pmNormal
      },
      totalAirSamples,
      totalPhotos
    };
  };

  const globalStats = calculateGlobalStats();
  const reportStats = selectedReport ? calculateReportStats(selectedReport) : null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return '#FF6B6B';
      case 'warning': return '#FFD93D';
      case 'normal': return '#51CF66';
      default: return '#ccc';
    }
  };

  return (
    <div className="detailed-statistics">
      <div className="statistics-header">
        <h2>📊 Detailed Air Quality Statistics</h2>
        <div className="view-mode-toggle">
          <button 
            className={viewMode === 'global' ? 'active' : ''}
            onClick={() => setViewMode('global')}
          >
            🌍 Global Statistics
          </button>
          <button 
            className={viewMode === 'byRoom' ? 'active' : ''}
            onClick={() => setViewMode('byRoom')}
          >
            🏠 By Report
          </button>
        </div>
      </div>

      {viewMode === 'global' && globalStats && (
        <div className="global-stats-container">
          <div className="stats-summary">
            <div className="summary-card">
              <div className="summary-icon">📋</div>
              <div className="summary-content">
                <h4>Total Reports</h4>
                <p className="summary-value">{globalStats.totalReports}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🏠</div>
              <div className="summary-content">
                <h4>Total Rooms</h4>
                <p className="summary-value">{globalStats.totalRooms}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🔬</div>
              <div className="summary-content">
                <h4>Air Samples</h4>
                <p className="summary-value">{globalStats.totalAirSamples}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📸</div>
              <div className="summary-content">
                <h4>Photos</h4>
                <p className="summary-value">{globalStats.totalPhotos}</p>
              </div>
            </div>
          </div>

          <div className="measurements-grid">
            {/* Temperature */}
            <div className="measurement-card">
              <h3>🌡️ Temperature</h3>
              <div className="measurement-value">
                <span className="value-large">{globalStats.avgTemp}</span>
                <span className="value-unit">°C</span>
              </div>
              <p className="measurement-label">Average across all rooms</p>
              <div className="status-breakdown">
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('normal')}}></div>
                  <span>Normal: {globalStats.statusBreakdown.temperature.normal}</span>
                </div>
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('warning')}}></div>
                  <span>Warning: {globalStats.statusBreakdown.temperature.warning}</span>
                </div>
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('critical')}}></div>
                  <span>Critical: {globalStats.statusBreakdown.temperature.critical}</span>
                </div>
              </div>
            </div>

            {/* Humidity */}
            <div className="measurement-card">
              <h3>💧 Relative Humidity</h3>
              <div className="measurement-value">
                <span className="value-large">{globalStats.avgRH}</span>
                <span className="value-unit">%</span>
              </div>
              <p className="measurement-label">Average across all rooms</p>
              <div className="status-breakdown">
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('normal')}}></div>
                  <span>Normal: {globalStats.statusBreakdown.humidity.normal}</span>
                </div>
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('warning')}}></div>
                  <span>Warning: {globalStats.statusBreakdown.humidity.warning}</span>
                </div>
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('critical')}}></div>
                  <span>Critical: {globalStats.statusBreakdown.humidity.critical}</span>
                </div>
              </div>
            </div>

            {/* CO2 */}
            <div className="measurement-card">
              <h3>🌫️ Carbon Dioxide (CO₂)</h3>
              <div className="measurement-value">
                <span className="value-large">{globalStats.avgCO2}</span>
                <span className="value-unit">PPM</span>
              </div>
              <p className="measurement-label">Average across all rooms</p>
              <div className="status-breakdown">
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('normal')}}></div>
                  <span>Normal: {globalStats.statusBreakdown.co2.normal}</span>
                </div>
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('warning')}}></div>
                  <span>Warning: {globalStats.statusBreakdown.co2.warning}</span>
                </div>
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('critical')}}></div>
                  <span>Critical: {globalStats.statusBreakdown.co2.critical}</span>
                </div>
              </div>
            </div>

            {/* PM */}
            <div className="measurement-card">
              <h3>💨 Particulate Matter (PM 2.5)</h3>
              <div className="measurement-value">
                <span className="value-large">{globalStats.avgPM}</span>
                <span className="value-unit">μg/m³</span>
              </div>
              <p className="measurement-label">Average across all rooms</p>
              <div className="status-breakdown">
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('normal')}}></div>
                  <span>Normal: {globalStats.statusBreakdown.pm.normal}</span>
                </div>
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('warning')}}></div>
                  <span>Warning: {globalStats.statusBreakdown.pm.warning}</span>
                </div>
                <div className="status-item">
                  <div className="status-dot" style={{backgroundColor: getStatusColor('critical')}}></div>
                  <span>Critical: {globalStats.statusBreakdown.pm.critical}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'byRoom' && (
        <div className="by-report-container">
          <div className="report-selector">
            <label>Select a Report:</label>
            <select 
              value={selectedReport?._id || ''} 
              onChange={(e) => {
                const report = reports.find(r => r._id === e.target.value);
                setSelectedReport(report);
              }}
            >
              <option value="">-- Select Report --</option>
              {reports.map(report => (
                <option key={report._id} value={report._id}>
                  {report.reportNumber} - {report.reportTitle}
                </option>
              ))}
            </select>
          </div>

          {reportStats && selectedReport && (
            <div className="report-stats-container">
              <div className="report-info-header">
                <h3>{selectedReport.reportTitle}</h3>
                <p><strong>Report Number:</strong> {selectedReport.reportNumber}</p>
                <p><strong>Client:</strong> {selectedReport.clientName}</p>
                <p><strong>Date:</strong> {new Date(selectedReport.inspectionDate).toLocaleDateString()}</p>
                <p><strong>Total Rooms:</strong> {reportStats.totalRooms}</p>
              </div>

              <div className="measurements-grid">
                {/* Temperature */}
                <div className="measurement-card detailed">
                  <h3>🌡️ Temperature</h3>
                  <div className="measurement-stats">
                    <div className="stat-row">
                      <span className="stat-label">Average:</span>
                      <span className="stat-value">{reportStats.temperature.avg} °C</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Min:</span>
                      <span className="stat-value">{reportStats.temperature.min} °C</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Max:</span>
                      <span className="stat-value">{reportStats.temperature.max} °C</span>
                    </div>
                  </div>
                  <div className="status-breakdown">
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('normal')}}></div>
                      <span>Normal: {reportStats.temperature.normal}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('warning')}}></div>
                      <span>Warning: {reportStats.temperature.warning}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('critical')}}></div>
                      <span>Critical: {reportStats.temperature.critical}</span>
                    </div>
                  </div>
                </div>

                {/* Humidity */}
                <div className="measurement-card detailed">
                  <h3>💧 Relative Humidity</h3>
                  <div className="measurement-stats">
                    <div className="stat-row">
                      <span className="stat-label">Average:</span>
                      <span className="stat-value">{reportStats.humidity.avg} %</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Min:</span>
                      <span className="stat-value">{reportStats.humidity.min} %</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Max:</span>
                      <span className="stat-value">{reportStats.humidity.max} %</span>
                    </div>
                  </div>
                  <div className="status-breakdown">
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('normal')}}></div>
                      <span>Normal: {reportStats.humidity.normal}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('warning')}}></div>
                      <span>Warning: {reportStats.humidity.warning}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('critical')}}></div>
                      <span>Critical: {reportStats.humidity.critical}</span>
                    </div>
                  </div>
                </div>

                {/* CO2 */}
                <div className="measurement-card detailed">
                  <h3>🌫️ CO₂ Level</h3>
                  <div className="measurement-stats">
                    <div className="stat-row">
                      <span className="stat-label">Average:</span>
                      <span className="stat-value">{reportStats.co2.avg} PPM</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Min:</span>
                      <span className="stat-value">{reportStats.co2.min} PPM</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Max:</span>
                      <span className="stat-value">{reportStats.co2.max} PPM</span>
                    </div>
                  </div>
                  <div className="status-breakdown">
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('normal')}}></div>
                      <span>Normal: {reportStats.co2.normal}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('warning')}}></div>
                      <span>Warning: {reportStats.co2.warning}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('critical')}}></div>
                      <span>Critical: {reportStats.co2.critical}</span>
                    </div>
                  </div>
                </div>

                {/* PM */}
                <div className="measurement-card detailed">
                  <h3>💨 Particulate Matter</h3>
                  <div className="measurement-stats">
                    <div className="stat-row">
                      <span className="stat-label">Average:</span>
                      <span className="stat-value">{reportStats.pm.avg} μg/m³</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Min:</span>
                      <span className="stat-value">{reportStats.pm.min} μg/m³</span>
                    </div>
                    <div className="stat-row">
                      <span className="stat-label">Max:</span>
                      <span className="stat-value">{reportStats.pm.max} μg/m³</span>
                    </div>
                  </div>
                  <div className="status-breakdown">
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('normal')}}></div>
                      <span>Normal: {reportStats.pm.normal}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('warning')}}></div>
                      <span>Warning: {reportStats.pm.warning}</span>
                    </div>
                    <div className="status-item">
                      <div className="status-dot" style={{backgroundColor: getStatusColor('critical')}}></div>
                      <span>Critical: {reportStats.pm.critical}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room by Room Breakdown */}
              <div className="room-breakdown">
                <h3>📋 Room by Room Breakdown</h3>
                <div className="rooms-table-container">
                  <table className="rooms-table">
                    <thead>
                      <tr>
                        <th>Room</th>
                        <th>Temp (°C)</th>
                        <th>RH (%)</th>
                        <th>CO₂ (PPM)</th>
                        <th>PM (μg/m³)</th>
                        <th>Samples</th>
                        <th>Photos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.rooms.map((room, index) => (
                        <tr key={index}>
                          <td><strong>{room.roomNumber}</strong></td>
                          <td>
                            <span className={`status-badge-small ${room.temperatureStatus}`}>
                              {room.temperature || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge-small ${room.humidityStatus}`}>
                              {room.relativeHumidity || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge-small ${room.co2Status}`}>
                              {room.co2Level || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge-small ${room.pmStatus}`}>
                              {room.particulateMatter || 'N/A'}
                            </span>
                          </td>
                          <td>{room.airSamples?.length || 0}</td>
                          <td>{room.photos?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {!selectedReport && (
            <div className="no-selection">
              <p>👆 Please select a report to view detailed statistics</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DetailedStatistics;
