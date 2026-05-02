import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/BuildingStatistics.css';

function BuildingStatistics({ reports }) {
  const { t } = useLanguage();
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [buildingStats, setBuildingStats] = useState(null);

  // Group reports by building address
  const buildings = [...new Set(reports.map(r => r.inspectionAddress))].filter(Boolean);

  useEffect(() => {
    if (selectedBuilding) {
      calculateBuildingStats(selectedBuilding);
    }
  }, [selectedBuilding, reports]);

  const calculateBuildingStats = (address) => {
    const buildingReports = reports.filter(r => r.inspectionAddress === address);
    
    if (buildingReports.length === 0) {
      setBuildingStats(null);
      return;
    }

    // Collect all rooms from all reports for this building
    const allRooms = buildingReports.flatMap(r => r.rooms || []);
    
    if (allRooms.length === 0) {
      setBuildingStats({
        totalReports: buildingReports.length,
        totalRooms: 0,
        averages: {}
      });
      return;
    }

    // Calculate averages
    const calculateAverage = (field) => {
      const values = allRooms.map(room => room[field]).filter(v => v != null && v !== '');
      if (values.length === 0) return null;
      return (values.reduce((a, b) => Number(a) + Number(b), 0) / values.length).toFixed(2);
    };

    const stats = {
      totalReports: buildingReports.length,
      totalRooms: allRooms.length,
      clientName: buildingReports[0].clientName,
      propertyType: buildingReports[0].propertyType,
      averages: {
        temperature: calculateAverage('temperature'),
        relativeHumidity: calculateAverage('relativeHumidity'),
        co2Level: calculateAverage('co2Level'),
        particulateMatter: calculateAverage('particulateMatter'),
        oxygen: calculateAverage('oxygen')
      },
      roomsWithIssues: {
        visibleMould: allRooms.filter(r => r.visibleMould).length,
        condensation: allRooms.filter(r => r.condensation).length,
        leakage: allRooms.filter(r => r.leakage).length,
        waterDamage: allRooms.filter(r => r.waterDamage).length,
        ventilationIssues: allRooms.filter(r => r.ventilationIssues).length
      },
      totalAirSamples: allRooms.reduce((sum, room) => sum + (room.airSamples?.length || 0), 0)
    };

    setBuildingStats(stats);
  };

  const getStatusColor = (value, type) => {
    if (!value) return '#cbd5e0';
    
    const numValue = Number(value);
    
    switch(type) {
      case 'temperature':
        return numValue >= 18 && numValue <= 22 ? '#48bb78' : '#fc8181';
      case 'relativeHumidity':
        return numValue >= 40 && numValue <= 60 ? '#48bb78' : '#fc8181';
      case 'co2Level':
        return numValue <= 850 ? '#48bb78' : '#fc8181';
      case 'oxygen':
        return numValue >= 19 && numValue <= 21 ? '#48bb78' : '#fc8181';
      default:
        return '#667eea';
    }
  };

  return (
    <div className="building-statistics">
      <div className="stats-header">
        <h2>{t('buildingStatistics')}</h2>
        <select 
          value={selectedBuilding} 
          onChange={(e) => setSelectedBuilding(e.target.value)}
          className="building-selector"
        >
          <option value="">{t('selectBuilding')}</option>
          {buildings.map((building, index) => (
            <option key={index} value={building}>{building}</option>
          ))}
        </select>
      </div>

      {buildingStats && (
        <div className="stats-content">
          <div className="building-info">
            <div className="info-card">
              <div className="info-icon">🏢</div>
              <div className="info-details">
                <h4>{buildingStats.clientName}</h4>
                <p>{selectedBuilding}</p>
                <span className="property-type">{t(buildingStats.propertyType)}</span>
              </div>
            </div>
            
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="stat-value">{buildingStats.totalReports}</span>
                <span className="stat-label">Reports</span>
              </div>
              <div className="quick-stat">
                <span className="stat-value">{buildingStats.totalRooms}</span>
                <span className="stat-label">{t('roomsInspected')}</span>
              </div>
              <div className="quick-stat">
                <span className="stat-value">{buildingStats.totalAirSamples}</span>
                <span className="stat-label">{t('airSamples')}</span>
              </div>
            </div>
          </div>

          <div className="averages-section">
            <h3>{t('averageValues')}</h3>
            <div className="averages-grid">
              {buildingStats.averages.temperature && (
                <div className="avg-card" style={{ borderLeftColor: getStatusColor(buildingStats.averages.temperature, 'temperature') }}>
                  <div className="avg-icon">🌡️</div>
                  <div className="avg-info">
                    <span className="avg-label">{t('temperature')}</span>
                    <span className="avg-value">{buildingStats.averages.temperature}°C</span>
                    <span className="avg-range">Normal: 18-22°C</span>
                  </div>
                </div>
              )}

              {buildingStats.averages.relativeHumidity && (
                <div className="avg-card" style={{ borderLeftColor: getStatusColor(buildingStats.averages.relativeHumidity, 'relativeHumidity') }}>
                  <div className="avg-icon">💧</div>
                  <div className="avg-info">
                    <span className="avg-label">{t('relativeHumidity')}</span>
                    <span className="avg-value">{buildingStats.averages.relativeHumidity}%</span>
                    <span className="avg-range">Normal: 40-60%</span>
                  </div>
                </div>
              )}

              {buildingStats.averages.co2Level && (
                <div className="avg-card" style={{ borderLeftColor: getStatusColor(buildingStats.averages.co2Level, 'co2Level') }}>
                  <div className="avg-icon">💨</div>
                  <div className="avg-info">
                    <span className="avg-label">{t('co2Level')}</span>
                    <span className="avg-value">{buildingStats.averages.co2Level} PPM</span>
                    <span className="avg-range">Normal: 400-850 PPM</span>
                  </div>
                </div>
              )}

              {buildingStats.averages.oxygen && (
                <div className="avg-card" style={{ borderLeftColor: getStatusColor(buildingStats.averages.oxygen, 'oxygen') }}>
                  <div className="avg-icon">🫁</div>
                  <div className="avg-info">
                    <span className="avg-label">{t('oxygen')}</span>
                    <span className="avg-value">{buildingStats.averages.oxygen}%</span>
                    <span className="avg-range">Normal: ~20.9%</span>
                  </div>
                </div>
              )}

              {buildingStats.averages.particulateMatter && (
                <div className="avg-card">
                  <div className="avg-icon">🌫️</div>
                  <div className="avg-info">
                    <span className="avg-label">{t('particulateMatter')}</span>
                    <span className="avg-value">{buildingStats.averages.particulateMatter}</span>
                    <span className="avg-range">PM 2.5</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="issues-section">
            <h3>{t('visualObservations')}</h3>
            <div className="issues-grid">
              <div className="issue-card">
                <span className="issue-count">{buildingStats.roomsWithIssues.visibleMould}</span>
                <span className="issue-label">{t('visibleMould')}</span>
              </div>
              <div className="issue-card">
                <span className="issue-count">{buildingStats.roomsWithIssues.condensation}</span>
                <span className="issue-label">{t('condensation')}</span>
              </div>
              <div className="issue-card">
                <span className="issue-count">{buildingStats.roomsWithIssues.leakage}</span>
                <span className="issue-label">{t('leakage')}</span>
              </div>
              <div className="issue-card">
                <span className="issue-count">{buildingStats.roomsWithIssues.waterDamage}</span>
                <span className="issue-label">{t('waterDamage')}</span>
              </div>
              <div className="issue-card">
                <span className="issue-count">{buildingStats.roomsWithIssues.ventilationIssues}</span>
                <span className="issue-label">{t('ventilationIssues')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!buildingStats && selectedBuilding && (
        <div className="no-stats">
          <p>{t('noData')}</p>
        </div>
      )}
    </div>
  );
}

export default BuildingStatistics;
