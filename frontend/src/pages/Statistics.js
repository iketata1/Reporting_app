import React, { useState, useEffect } from 'react';
import { reportAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/Statistics.css';

function Statistics() {
  const { t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [buildingsData, setBuildingsData] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingStats, setBuildingStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      calculateBuildingStats(selectedBuilding);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuilding, reports]);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getAll({ limit: 1000 });
      const allReports = response.data.reports;
      setReports(allReports);
      
      // Group reports by building and extract info
      const buildingsMap = new Map();
      allReports.forEach(report => {
        const address = report.inspectionAddress;
        if (address && !buildingsMap.has(address)) {
          buildingsMap.set(address, {
            address,
            clientName: report.clientName,
            propertyType: report.propertyType,
            reportCount: allReports.filter(r => r.inspectionAddress === address).length,
            lastInspection: report.inspectionDate
          });
        }
      });
      
      const buildings = Array.from(buildingsMap.values());
      setBuildingsData(buildings);
      
      // Auto-select first building
      if (buildings.length > 0) {
        setSelectedBuilding(buildings[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const calculateBuildingStats = (buildingData) => {
    const buildingReports = reports.filter(r => r.inspectionAddress === buildingData.address);
    
    if (buildingReports.length === 0) {
      setBuildingStats(null);
      return;
    }

    const allRooms = buildingReports.flatMap(r => r.rooms || []);
    
    if (allRooms.length === 0) {
      setBuildingStats({
        ...buildingData,
        totalReports: buildingReports.length,
        totalRooms: 0,
        rooms: []
      });
      return;
    }

    // Calculate overall building averages
    const calculateAvg = (field) => {
      const values = allRooms.map(r => r[field]).filter(v => v != null && v !== '');
      if (values.length === 0) return null;
      return (values.reduce((a, b) => Number(a) + Number(b), 0) / values.length).toFixed(1);
    };

    const calculateMinMax = (field) => {
      const values = allRooms.map(r => r[field]).filter(v => v != null && v !== '');
      if (values.length === 0) return { min: null, max: null };
      return {
        min: Math.min(...values).toFixed(1),
        max: Math.max(...values).toFixed(1)
      };
    };

    const tempMinMax = calculateMinMax('temperature');
    const rhMinMax = calculateMinMax('relativeHumidity');
    const co2MinMax = calculateMinMax('co2Level');
    const pmMinMax = calculateMinMax('particulateMatter');

    const stats = {
      ...buildingData,
      totalReports: buildingReports.length,
      totalRooms: allRooms.length,
      totalAirSamples: allRooms.reduce((sum, r) => sum + (r.airSamples?.length || 0), 0),
      totalPhotos: allRooms.reduce((sum, r) => sum + (r.photos?.length || 0), 0),
      buildingAverages: {
        temperature: {
          avg: calculateAvg('temperature'),
          min: tempMinMax.min,
          max: tempMinMax.max
        },
        relativeHumidity: {
          avg: calculateAvg('relativeHumidity'),
          min: rhMinMax.min,
          max: rhMinMax.max
        },
        co2Level: {
          avg: calculateAvg('co2Level'),
          min: co2MinMax.min,
          max: co2MinMax.max
        },
        particulateMatter: {
          avg: calculateAvg('particulateMatter'),
          min: pmMinMax.min,
          max: pmMinMax.max
        }
      },
      rooms: allRooms.map((room, idx) => ({
        ...room,
        reportNumber: buildingReports.find(r => r.rooms?.includes(room))?.reportNumber || 'N/A'
      }))
    };

    setBuildingStats(stats);
  };

  const getStatusClass = (value, type) => {
    if (!value) return '';
    const numValue = Number(value);
    
    switch(type) {
      case 'temperature':
        if (numValue < 18 || numValue > 22) return 'critical';
        if (numValue < 19 || numValue > 21) return 'warning';
        return 'normal';
      case 'relativeHumidity':
        if (numValue < 30 || numValue > 70) return 'critical';
        if (numValue < 40 || numValue > 60) return 'warning';
        return 'normal';
      case 'co2Level':
        if (numValue > 1200) return 'critical';
        if (numValue > 850) return 'warning';
        return 'normal';
      case 'particulateMatter':
        if (numValue > 35) return 'critical';
        if (numValue > 12) return 'warning';
        return 'normal';
      default:
        return '';
    }
  };

  const getPropertyIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'hotel': return '🏨';
      case 'office': return '🏢';
      case 'residential': return '🏠';
      case 'industrial': return '🏭';
      case 'commercial': return '🏬';
      default: return '🏢';
    }
  };

  if (loading) {
    return (
      <div className="statistics-page">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="statistics-page">
      <div className="page-header">
        <h1>📊 {t('statistics') || 'Statistics'}</h1>
        <p>Air Quality Analysis by Building</p>
      </div>

      {/* Building Cards Grid */}
      <div className="buildings-grid">
        {buildingsData.map((building, index) => (
          <div 
            key={index}
            className={`building-card ${selectedBuilding?.address === building.address ? 'selected' : ''}`}
            onClick={() => setSelectedBuilding(building)}
          >
            <div className="building-card-header">
              <span className="building-icon">{getPropertyIcon(building.propertyType)}</span>
              <span className="property-type-badge">{t(building.propertyType) || building.propertyType}</span>
            </div>
            <h3 className="building-name">{building.clientName}</h3>
            <p className="building-address">{building.address}</p>
            <div className="building-card-footer">
              <span className="report-count">📋 {building.reportCount} {building.reportCount === 1 ? 'Report' : 'Reports'}</span>
              <span className="last-inspection">📅 {new Date(building.lastInspection).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {buildingStats && (
        <div className="statistics-content">
          {/* Building Info Card */}
          <div className="building-info-card">
            <div className="info-header">
              <div className="info-icon">{getPropertyIcon(buildingStats.propertyType)}</div>
              <div className="info-details">
                <h2>{buildingStats.clientName}</h2>
                <p className="address">{buildingStats.address}</p>
                <span className="property-badge">{t(buildingStats.propertyType) || buildingStats.propertyType}</span>
              </div>
            </div>
            <div className="info-stats">
              <div className="info-stat">
                <span className="stat-value">{buildingStats.totalReports}</span>
                <span className="stat-label">Reports</span>
              </div>
              <div className="info-stat">
                <span className="stat-value">{buildingStats.totalRooms}</span>
                <span className="stat-label">Rooms</span>
              </div>
              <div className="info-stat">
                <span className="stat-value">{buildingStats.totalAirSamples}</span>
                <span className="stat-label">Air Samples</span>
              </div>
              <div className="info-stat">
                <span className="stat-value">{buildingStats.totalPhotos}</span>
                <span className="stat-label">Photos</span>
              </div>
            </div>
          </div>

          {/* Building Averages */}
          <div className="averages-section">
            <h3>Building Overview</h3>
            <div className="averages-grid">
              {buildingStats.buildingAverages.temperature.avg && (
                <div className={`avg-card ${getStatusClass(buildingStats.buildingAverages.temperature.avg, 'temperature')}`}>
                  <div className="avg-icon">🌡️</div>
                  <div className="avg-content">
                    <div className="avg-label">Temperature</div>
                    <div className="avg-main-value">
                      {buildingStats.buildingAverages.temperature.avg}<span className="unit">°C</span>
                    </div>
                    <div className="avg-minmax">
                      <span>{buildingStats.buildingAverages.temperature.min}°</span>
                      <span className="separator">—</span>
                      <span>{buildingStats.buildingAverages.temperature.max}°</span>
                    </div>
                  </div>
                </div>
              )}

              {buildingStats.buildingAverages.relativeHumidity.avg && (
                <div className={`avg-card ${getStatusClass(buildingStats.buildingAverages.relativeHumidity.avg, 'relativeHumidity')}`}>
                  <div className="avg-icon">💧</div>
                  <div className="avg-content">
                    <div className="avg-label">Relative Humidity</div>
                    <div className="avg-main-value">
                      {buildingStats.buildingAverages.relativeHumidity.avg}<span className="unit">%</span>
                    </div>
                    <div className="avg-minmax">
                      <span>{buildingStats.buildingAverages.relativeHumidity.min}%</span>
                      <span className="separator">—</span>
                      <span>{buildingStats.buildingAverages.relativeHumidity.max}%</span>
                    </div>
                  </div>
                </div>
              )}

              {buildingStats.buildingAverages.co2Level.avg && (
                <div className={`avg-card ${getStatusClass(buildingStats.buildingAverages.co2Level.avg, 'co2Level')}`}>
                  <div className="avg-icon">🌫️</div>
                  <div className="avg-content">
                    <div className="avg-label">CO₂ Level</div>
                    <div className="avg-main-value">
                      {buildingStats.buildingAverages.co2Level.avg}<span className="unit">PPM</span>
                    </div>
                    <div className="avg-minmax">
                      <span>{buildingStats.buildingAverages.co2Level.min}</span>
                      <span className="separator">—</span>
                      <span>{buildingStats.buildingAverages.co2Level.max}</span>
                    </div>
                  </div>
                </div>
              )}

              {buildingStats.buildingAverages.particulateMatter.avg && (
                <div className={`avg-card ${getStatusClass(buildingStats.buildingAverages.particulateMatter.avg, 'particulateMatter')}`}>
                  <div className="avg-icon">💨</div>
                  <div className="avg-content">
                    <div className="avg-label">Particulate Matter</div>
                    <div className="avg-main-value">
                      {buildingStats.buildingAverages.particulateMatter.avg}<span className="unit">μg/m³</span>
                    </div>
                    <div className="avg-minmax">
                      <span>{buildingStats.buildingAverages.particulateMatter.min}</span>
                      <span className="separator">—</span>
                      <span>{buildingStats.buildingAverages.particulateMatter.max}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Room by Room Table */}
          <div className="rooms-section">
            <h3>Room by Room Analysis</h3>
            <div className="table-container">
              <table className="rooms-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Report</th>
                    <th>Temp (°C)</th>
                    <th>RH (%)</th>
                    <th>CO₂ (PPM)</th>
                    <th>PM (μg/m³)</th>
                    <th>Samples</th>
                    <th>Photos</th>
                  </tr>
                </thead>
                <tbody>
                  {buildingStats.rooms.map((room, index) => (
                    <tr key={index}>
                      <td className="room-name">{room.roomNumber}</td>
                      <td className="report-num">{room.reportNumber}</td>
                      <td>
                        <span className={`value-badge ${getStatusClass(room.temperature, 'temperature')}`}>
                          {room.temperature || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`value-badge ${getStatusClass(room.relativeHumidity, 'relativeHumidity')}`}>
                          {room.relativeHumidity || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`value-badge ${getStatusClass(room.co2Level, 'co2Level')}`}>
                          {room.co2Level || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`value-badge ${getStatusClass(room.particulateMatter, 'particulateMatter')}`}>
                          {room.particulateMatter || '-'}
                        </span>
                      </td>
                      <td className="center">{room.airSamples?.length || 0}</td>
                      <td className="center">{room.photos?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!buildingStats && !loading && buildingsData.length === 0 && (
        <div className="no-data">
          <p>No statistics available</p>
        </div>
      )}
    </div>
  );
}

export default Statistics;
