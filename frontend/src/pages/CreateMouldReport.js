import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/CreateMouldReport.css';

// API URL configuration
const API_URL = process.env.NODE_ENV === 'production' ? '' : '${API_URL}';

function CreateMouldReport() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Basic Info
    reportTitle: '',
    reportType: 'mould-investigation',
    investigationType: 'mould',
    inspectionDate: '',
    clientName: '',
    inspectionAddress: '',
    contactPerson: '',
    propertyType: 'hotel',
    carriedOutBy: '',
    specialNotes: '',
    language: language, // Capture current language
    
    // Investigation Findings (after basic info)
    investigationFindingsText: '',
    
    // Letter Introduction (Dear Mr...)
    letterIntroduction: '',
    
    // Section I: Average Results - Text fields
    section1IntroText: '',
    section1ConclusionText: '',
    
    // Section II: Additional Air Quality Measurements
    section2IntroText: '',
    section2ConclusionText: '',
    globalAirQuality: {
      location: '',
      oxygen: '',
      formaldehyde: 'None',
      voc: 'None'
    },
    
    // Section III: Microbiological Results
    section3IntroText: '',
    section3ConclusionText: '',
    
    // Rooms (only Temp, RH, CO2, PM + samples + photos)
    rooms: [],
    
    // Conclusion & Proposed Measures
    conclusion: '',
    proposedMeasures: '',
    
    // Support/Contact Section
    supportText: '',
    
    // General Photos (not tied to rooms)
    generalPhotos: [],
    
    // Findings & Recommendations
    investigationFindings: [],
    recommendations: [],
    
    status: 'draft'
  });

  const [currentRoom, setCurrentRoom] = useState({
    roomNumber: '',
    roomName: '',
    floor: '',
    temperature: '',
    temperatureStatus: 'normal',
    relativeHumidity: '',
    humidityStatus: 'normal',
    co2Level: '',
    co2Status: 'normal',
    particulateMatter: '',
    pmStatus: 'normal',
    visibleMould: false,
    mouldLocation: '',
    condensation: false,
    leakage: false,
    leakageSource: '',
    waterDamage: false,
    ventilationIssues: false,
    airSamples: [],
    photos: [],
    notes: ''
  });

  const [currentAirSample, setCurrentAirSample] = useState({
    sampleLocation: '',
    type: 'Air',
    species: 'Mould',
    identifiedMouldSpecies: '',
    totalQuantity: '',
    unit: 'cfu/m³'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRoomChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentRoom({
      ...currentRoom,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || '' : value)
    });
  };

  const handleAirSampleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAirSample({
      ...currentAirSample,
      [name]: value
    });
  };

  const addAirSample = () => {
    if (currentAirSample.identifiedMouldSpecies && currentAirSample.totalQuantity) {
      setCurrentRoom({
        ...currentRoom,
        airSamples: [...currentRoom.airSamples, { ...currentAirSample }]
      });
      setCurrentAirSample({
        sampleLocation: '',
        type: 'Air',
        species: 'Mould',
        identifiedMouldSpecies: '',
        totalQuantity: '',
        unit: 'cfu/m³'
      });
    }
  };

  const removeAirSample = (index) => {
    const newSamples = currentRoom.airSamples.filter((_, i) => i !== index);
    setCurrentRoom({ ...currentRoom, airSamples: newSamples });
  };

  const addRoom = () => {
    if (currentRoom.roomNumber) {
      setFormData({
        ...formData,
        rooms: [...formData.rooms, { ...currentRoom }]
      });
      setCurrentRoom({
        roomNumber: '',
        roomName: '',
        floor: '',
        temperature: '',
        temperatureStatus: 'normal',
        relativeHumidity: '',
        humidityStatus: 'normal',
        co2Level: '',
        co2Status: 'normal',
        particulateMatter: '',
        pmStatus: 'normal',
        visibleMould: false,
        mouldLocation: '',
        condensation: false,
        leakage: false,
        leakageSource: '',
        waterDamage: false,
        ventilationIssues: false,
        airSamples: [],
        photos: [],
        notes: ''
      });
    }
  };

  const removeRoom = (index) => {
    const newRooms = formData.rooms.filter((_, i) => i !== index);
    setFormData({ ...formData, rooms: newRooms });
  };

  const addFinding = () => {
    setFormData({
      ...formData,
      investigationFindings: [...formData.investigationFindings, { finding: '', severity: 'medium' }]
    });
  };

  const updateFinding = (index, field, value) => {
    const newFindings = [...formData.investigationFindings];
    newFindings[index][field] = value;
    setFormData({ ...formData, investigationFindings: newFindings });
  };

  const removeFinding = (index) => {
    const newFindings = formData.investigationFindings.filter((_, i) => i !== index);
    setFormData({ ...formData, investigationFindings: newFindings });
  };

  const addRecommendation = () => {
    setFormData({
      ...formData,
      recommendations: [...formData.recommendations, { recommendation: '', priority: 'medium', category: '' }]
    });
  };

  const updateRecommendation = (index, field, value) => {
    const newRecs = [...formData.recommendations];
    newRecs[index][field] = value;
    setFormData({ ...formData, recommendations: newRecs });
  };

  const removeRecommendation = (index) => {
    const newRecs = formData.recommendations.filter((_, i) => i !== index);
    setFormData({ ...formData, recommendations: newRecs });
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create FormData for upload
    const formDataToSend = new FormData();
    files.forEach(file => {
      formDataToSend.append('photos', file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_URL}/api/upload/photos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      
      if (response.ok && data.files) {
        const newPhotos = data.files.map(file => ({
          fileName: file.fileName,
          fileUrl: `${API_URL}${file.fileUrl}`,
          description: '',
          uploadDate: new Date()
        }));

        setCurrentRoom({
          ...currentRoom,
          photos: [...currentRoom.photos, ...newPhotos]
        });
        
        // Reset file input
        e.target.value = '';
      } else {
        alert('Error uploading photos: ' + (data.message || 'Unknown error'));
        e.target.value = '';
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      alert('Error uploading photos: ' + error.message);
      e.target.value = '';
    }
  };

  const removePhoto = (index) => {
    const newPhotos = currentRoom.photos.filter((_, i) => i !== index);
    setCurrentRoom({ ...currentRoom, photos: newPhotos });
  };

  const updatePhotoDescription = (index, description) => {
    const newPhotos = [...currentRoom.photos];
    newPhotos[index].description = description;
    setCurrentRoom({ ...currentRoom, photos: newPhotos });
  };

  const handleGeneralPhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formDataToSend = new FormData();
    files.forEach(file => {
      formDataToSend.append('photos', file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_URL}/api/upload/photos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      
      if (response.ok && data.files) {
        const newPhotos = data.files.map(file => ({
          fileName: file.fileName,
          fileUrl: `${API_URL}${file.fileUrl}`,
          caption: '',
          uploadDate: new Date()
        }));

        setFormData({
          ...formData,
          generalPhotos: [...formData.generalPhotos, ...newPhotos]
        });
        
        e.target.value = '';
      } else {
        alert('Error uploading photos: ' + (data.message || 'Unknown error'));
        e.target.value = '';
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      alert('Error uploading photos: ' + error.message);
      e.target.value = '';
    }
  };

  const removeGeneralPhoto = (index) => {
    const newPhotos = formData.generalPhotos.filter((_, i) => i !== index);
    setFormData({ ...formData, generalPhotos: newPhotos });
  };

  const updateGeneralPhotoCaption = (index, caption) => {
    const newPhotos = [...formData.generalPhotos];
    newPhotos[index].caption = caption;
    setFormData({ ...formData, generalPhotos: newPhotos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await reportAPI.create(formData);
      navigate('/reports');
    } catch (error) {
      alert('Error creating report: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div className="create-mould-report">
      <div className="page-header-form">
        <h1>{t('createReport')}</h1>
        <p>{t('fillDetails') || 'Fill in the details to generate a professional report'}</p>
      </div>

      <div className="progress-bar">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. {t('basicInfo')}</div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. {t('roomsMeasurements')}</div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Additional Air Quality</div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>4. Microbiological Results</div>
        <div className={`step ${currentStep >= 5 ? 'active' : ''}`}>5. {t('conclusion')}</div>
        <div className={`step ${currentStep >= 6 ? 'active' : ''}`}>6. General Photos</div>
      </div>

      <form className="mould-report-form" onSubmit={handleSubmit}>
        
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h2>{t('basicInfo')}</h2>
            
            <div className="form-group">
              <label>{t('reportTitle')} *</label>
              <input
                type="text"
                name="reportTitle"
                value={formData.reportTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('reportType')} *</label>
                <select name="reportType" value={formData.reportType} onChange={handleChange} required>
                  <option value="mould-investigation">{t('mouldInvestigation')}</option>
                  <option value="air-quality">{t('airQuality')}</option>
                  <option value="legionella">{t('legionella')}</option>
                  <option value="sound-measurement">{t('soundMeasurement')}</option>
                  <option value="custom">{t('custom')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('inspectionDate')} *</label>
                <input
                  type="date"
                  name="inspectionDate"
                  value={formData.inspectionDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('clientName')} *</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('contactPerson')} *</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('inspectionAddress')} *</label>
              <input
                type="text"
                name="inspectionAddress"
                value={formData.inspectionAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('propertyType')} *</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                  <option value="hotel">{t('hotel')}</option>
                  <option value="office">{t('office')}</option>
                  <option value="residential">{t('residential')}</option>
                  <option value="industrial">{t('industrial')}</option>
                  <option value="commercial">{t('commercial')}</option>
                  <option value="other">{t('other')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('carriedOutBy')}</label>
                <input
                  type="text"
                  name="carriedOutBy"
                  value={formData.carriedOutBy}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('specialNotes')}</label>
              <textarea
                name="specialNotes"
                value={formData.specialNotes}
                onChange={handleChange}
                rows="3"
              />
            </div>

            {/* Investigation Findings */}
            <div className="form-group">
              <label>Investigation Findings</label>
              <textarea
                name="investigationFindingsText"
                value={formData.investigationFindingsText}
                onChange={handleChange}
                rows="8"
              />
              <small style={{color: '#666', fontSize: '12px'}}>Enter bullet points of key findings (one per line with •)</small>
            </div>

            {/* Letter Introduction */}
            <div className="form-group">
              <label>Letter Introduction (Dear Mr...)</label>
              <textarea
                name="letterIntroduction"
                value={formData.letterIntroduction}
                onChange={handleChange}
                rows="5"
              />
              <small style={{color: '#666', fontSize: '12px'}}>Personalized introduction letter for the client</small>
            </div>

            <div className="form-actions">
              <button type="button" onClick={nextStep} className="btn-next">{t('nextStep')}</button>
            </div>
          </div>
        )}

        {/* Step 2: Rooms & Measurements */}
        {currentStep === 2 && (
          <div className="form-step">
            <h2>I. Average Results of the Air Quality Assessment</h2>
            
            {/* Section I Intro Text */}
            <div className="form-group">
              <label>Introduction Text (Before Table)</label>
              <textarea
                name="section1IntroText"
                value={formData.section1IntroText}
                onChange={handleChange}
                rows="4"
              />
              <small style={{color: '#666', fontSize: '12px'}}>Text that appears before the measurements table in the PDF</small>
            </div>

            <div className="rooms-list">
              <h3>{t('addedRooms')} ({formData.rooms.length})</h3>
              {formData.rooms.map((room, index) => (
                <div key={index} className="room-card">
                  <div>
                    <h4>{t('roomNumber')} {room.roomNumber} - {room.roomName || 'N/A'}</h4>
                    <p>{t('temperature')}: {room.temperature}°C | {t('relativeHumidity')}: {room.relativeHumidity}% | {t('co2Level')}: {room.co2Level} PPM</p>
                    <p>{t('airSamples')}: {room.airSamples.length} | {t('photos')}: {room.photos?.length || 0} 📷</p>
                  </div>
                  <button type="button" onClick={() => removeRoom(index)} className="btn-remove">{t('remove')}</button>
                </div>
              ))}
            </div>

            <div className="add-room-section">
              <h3>{t('addNewRoom')}</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{t('roomNumber')} *</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={currentRoom.roomNumber}
                    onChange={handleRoomChange}
                  />
                </div>

                <div className="form-group">
                  <label>{t('roomName')}</label>
                  <input
                    type="text"
                    name="roomName"
                    value={currentRoom.roomName}
                    onChange={handleRoomChange}
                  />
                </div>

                <div className="form-group">
                  <label>{t('floor')}</label>
                  <input
                    type="text"
                    name="floor"
                    value={currentRoom.floor}
                    onChange={handleRoomChange}
                  />
                </div>
              </div>

              <h4>{t('airQualityMeasurements')}</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('temperature')} (°C)</label>
                  <input
                    type="number"
                    name="temperature"
                    value={currentRoom.temperature}
                    onChange={handleRoomChange}
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label>Temperature Status</label>
                  <select
                    name="temperatureStatus"
                    value={currentRoom.temperatureStatus}
                    onChange={handleRoomChange}
                  >
                    <option value="normal">✓ Normal (Green)</option>
                    <option value="warning">⚠ Warning (Yellow)</option>
                    <option value="critical">✗ Critical (Red)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('relativeHumidity')} (%)</label>
                  <input
                    type="number"
                    name="relativeHumidity"
                    value={currentRoom.relativeHumidity}
                    onChange={handleRoomChange}
                    step="0.1"
                  />
                </div>

                <div className="form-group">
                  <label>Humidity Status</label>
                  <select
                    name="humidityStatus"
                    value={currentRoom.humidityStatus}
                    onChange={handleRoomChange}
                  >
                    <option value="normal">✓ Normal (Green)</option>
                    <option value="warning">⚠ Warning (Yellow)</option>
                    <option value="critical">✗ Critical (Red)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('co2Level')} (PPM)</label>
                  <input
                    type="number"
                    name="co2Level"
                    value={currentRoom.co2Level}
                    onChange={handleRoomChange}
                  />
                </div>

                <div className="form-group">
                  <label>CO₂ Status</label>
                  <select
                    name="co2Status"
                    value={currentRoom.co2Status}
                    onChange={handleRoomChange}
                  >
                    <option value="normal">✓ Normal (Green)</option>
                    <option value="warning">⚠ Warning (Yellow)</option>
                    <option value="critical">✗ Critical (Red)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('particulateMatter')} (PM 2.5)</label>
                  <input
                    type="number"
                    name="particulateMatter"
                    value={currentRoom.particulateMatter}
                    onChange={handleRoomChange}
                  />
                </div>

                <div className="form-group">
                  <label>PM Status</label>
                  <select
                    name="pmStatus"
                    value={currentRoom.pmStatus}
                    onChange={handleRoomChange}
                  >
                    <option value="normal">✓ Normal (Green)</option>
                    <option value="warning">⚠ Warning (Yellow)</option>
                    <option value="critical">✗ Critical (Red)</option>
                  </select>
                </div>
              </div>

              <h4>{t('visualObservations')}</h4>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="visibleMould"
                    checked={currentRoom.visibleMould}
                    onChange={handleRoomChange}
                  />
                  {t('visibleMould')}
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="condensation"
                    checked={currentRoom.condensation}
                    onChange={handleRoomChange}
                  />
                  {t('condensation')}
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="leakage"
                    checked={currentRoom.leakage}
                    onChange={handleRoomChange}
                  />
                  {t('leakage')}
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="waterDamage"
                    checked={currentRoom.waterDamage}
                    onChange={handleRoomChange}
                  />
                  {t('waterDamage')}
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="ventilationIssues"
                    checked={currentRoom.ventilationIssues}
                    onChange={handleRoomChange}
                  />
                  {t('ventilationIssues')}
                </label>
              </div>

              {currentRoom.visibleMould && (
                <div className="form-group">
                  <label>{t('mouldLocation')}</label>
                  <input
                    type="text"
                    name="mouldLocation"
                    value={currentRoom.mouldLocation}
                    onChange={handleRoomChange}
                  />
                </div>
              )}

              {currentRoom.leakage && (
                <div className="form-group">
                  <label>{t('leakageSource')}</label>
                  <input
                    type="text"
                    name="leakageSource"
                    value={currentRoom.leakageSource}
                    onChange={handleRoomChange}
                  />
                </div>
              )}

              <h4>{t('airSamples')}</h4>
              <p style={{fontSize: '0.9em', color: '#666', marginBottom: '10px'}}>
                Add microbiological air samples for this room (Type, Species, Identified Mould Species, Quantity)
              </p>
              
              <div className="air-samples-list">
                {currentRoom.airSamples.map((sample, index) => (
                  <div key={index} className="sample-card">
                    <p><strong>{sample.type}</strong> - {sample.species} - {sample.identifiedMouldSpecies}: {sample.totalQuantity} {sample.unit}</p>
                    <button type="button" onClick={() => removeAirSample(index)} className="btn-remove-small">×</button>
                  </div>
                ))}
              </div>

              <div className="add-sample-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select name="type" value={currentAirSample.type} onChange={handleAirSampleChange}>
                      <option value="Air">Air</option>
                      <option value="Contact">Contact</option>
                      <option value="Swab">Swab</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Species</label>
                    <select name="species" value={currentAirSample.species} onChange={handleAirSampleChange}>
                      <option value="Mould">Mould</option>
                      <option value="Yeast">Yeast</option>
                      <option value="Bacteria">Bacteria</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Identified Mould Species</label>
                    <input
                      type="text"
                      name="identifiedMouldSpecies"
                      value={currentAirSample.identifiedMouldSpecies}
                      onChange={handleAirSampleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Total Quantity</label>
                    <input
                      type="text"
                      name="totalQuantity"
                      value={currentAirSample.totalQuantity}
                      onChange={handleAirSampleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Unit</label>
                    <select name="unit" value={currentAirSample.unit} onChange={handleAirSampleChange}>
                      <option value="cfu/m³">cfu/m³</option>
                      <option value="cfu/plate">cfu/plate</option>
                      <option value="">Overgrowth (no unit)</option>
                    </select>
                  </div>
                </div>
                <button type="button" onClick={addAirSample} className="btn-add-sample">{t('addSample')}</button>
              </div>

              <div className="form-group">
                <label>{t('notes')}</label>
                <textarea
                  name="notes"
                  value={currentRoom.notes}
                  onChange={handleRoomChange}
                  rows="2"
                />
              </div>

              <h4>📸 {t('photos')}</h4>
              <div className="photo-upload-section">
                <div className="upload-area">
                  <input
                    type="file"
                    id="photo-upload"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-upload" className="upload-label">
                    <div className="upload-icon">📷</div>
                    <p>{t('clickToUpload')}</p>
                    <span>{t('photoFormats')}</span>
                  </label>
                </div>

                {currentRoom.photos.length > 0 && (
                  <div className="photos-grid">
                    {currentRoom.photos.map((photo, index) => (
                      <div key={index} className="photo-item">
                        <img src={photo.fileUrl} alt={`Room photo ${index + 1}`} />
                        <div className="photo-overlay">
                          <input
                            type="text"
                            value={photo.description}
                            onChange={(e) => updatePhotoDescription(index, e.target.value)}
                            className="photo-description"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="btn-remove-photo"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="button" onClick={addRoom} className="btn-add-room">{t('addRoom')}</button>
            </div>

            {/* Section I Conclusion Text */}
            <div className="form-group" style={{marginTop: '30px'}}>
              <label>Conclusion Text (After Table)</label>
              <textarea
                name="section1ConclusionText"
                value={formData.section1ConclusionText}
                onChange={handleChange}
                rows="4"
              />
              <small style={{color: '#666', fontSize: '12px'}}>Text that appears after the measurements table in the PDF</small>
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-prev">{t('previousStep')}</button>
              <button type="button" onClick={nextStep} className="btn-next">{t('nextStep')}</button>
            </div>
          </div>
        )}

        {/* Step 3: Additional Air Quality Measurements */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2>II. Additional Air Quality Measurements</h2>
            <p style={{color: '#666', marginBottom: '20px'}}>
              Global measurements for Oxygen, CH₂O (Formaldehyde), and VOC - NOT per room
            </p>
            
            <div className="form-group">
              <label>Introduction Text (before table)</label>
              <textarea
                name="section2IntroText"
                value={formData.section2IntroText}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <h3>Global Air Quality Measurements</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.globalAirQuality.location}
                  onChange={(e) => setFormData({
                    ...formData,
                    globalAirQuality: { ...formData.globalAirQuality, location: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>Oxygen (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.globalAirQuality.oxygen}
                  onChange={(e) => setFormData({
                    ...formData,
                    globalAirQuality: { ...formData.globalAirQuality, oxygen: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>CH₂O (Formaldehyde)</label>
                <select
                  value={formData.globalAirQuality.formaldehyde}
                  onChange={(e) => setFormData({
                    ...formData,
                    globalAirQuality: { ...formData.globalAirQuality, formaldehyde: e.target.value }
                  })}
                >
                  <option value="None">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>VOC (Volatile Organic Compounds)</label>
                <select
                  value={formData.globalAirQuality.voc}
                  onChange={(e) => setFormData({
                    ...formData,
                    globalAirQuality: { ...formData.globalAirQuality, voc: e.target.value }
                  })}
                >
                  <option value="None">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Conclusion Text (after table)</label>
              <textarea
                name="section2ConclusionText"
                value={formData.section2ConclusionText}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-prev">{t('previousStep')}</button>
              <button type="button" onClick={nextStep} className="btn-next">{t('nextStep')}</button>
            </div>
          </div>
        )}

        {/* Step 4: Microbiological Results Summary */}
        {currentStep === 4 && (
          <div className="form-step">
            <h2>III. Microbiological Air Investigation Results</h2>
            <p style={{color: '#666', marginBottom: '20px'}}>
              Summary text and overview - detailed samples are already added per room in Step 2
            </p>
            
            <div className="form-group">
              <label>Introduction Text</label>
              <textarea
                name="section3IntroText"
                value={formData.section3IntroText}
                onChange={handleChange}
                rows="6"
              />
            </div>

            <div className="form-group">
              <label>Conclusion Text</label>
              <textarea
                name="section3ConclusionText"
                value={formData.section3ConclusionText}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <h3>Summary of Samples by Room</h3>
            <div className="rooms-summary">
              {formData.rooms.map((room, index) => (
                <div key={index} className="room-summary-card">
                  <h4>Room {room.roomNumber} - {room.roomName || 'N/A'}</h4>
                  <p><strong>Air Samples:</strong> {room.airSamples.length}</p>
                  {room.airSamples.length > 0 && (
                    <ul style={{fontSize: '0.9em', color: '#666'}}>
                      {room.airSamples.map((sample, idx) => (
                        <li key={idx}>{sample.type} - {sample.identifiedMouldSpecies}: {sample.totalQuantity} {sample.unit}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-prev">{t('previousStep')}</button>
              <button type="button" onClick={nextStep} className="btn-next">{t('nextStep')}</button>
            </div>
          </div>
        )}

        {/* Step 5: Conclusion & Proposed Measures */}
        {currentStep === 5 && (
          <div className="form-step">
            <h2>IV. Conclusion & Proposed Measures</h2>
            
            <div className="form-group">
              <label>Conclusion *</label>
              <textarea
                name="conclusion"
                value={formData.conclusion}
                onChange={handleChange}
                rows="10"
                required
              />
            </div>

            <div className="form-group">
              <label>Proposed Measures *</label>
              <textarea
                name="proposedMeasures"
                value={formData.proposedMeasures}
                onChange={handleChange}
                rows="10"
                required
              />
            </div>

            <h3>{t('recommendations')}</h3>
            <button type="button" onClick={addRecommendation} className="btn-add">{t('addRecommendation')}</button>
            
            {formData.recommendations.map((rec, index) => (
              <div key={index} className="recommendation-item">
                <div className="form-group">
                  <label>{t('recommendation')}</label>
                  <textarea
                    value={rec.recommendation}
                    onChange={(e) => updateRecommendation(index, 'recommendation', e.target.value)}
                    rows="2"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('priority')}</label>
                    <select
                      value={rec.priority}
                      onChange={(e) => updateRecommendation(index, 'priority', e.target.value)}
                    >
                      <option value="urgent">{t('urgent')}</option>
                      <option value="high">{t('high')}</option>
                      <option value="medium">{t('medium')}</option>
                      <option value="low">{t('low')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t('category')}</label>
                    <input
                      type="text"
                      value={rec.category}
                      onChange={(e) => updateRecommendation(index, 'category', e.target.value)}
                    />
                  </div>
                  <button type="button" onClick={() => removeRecommendation(index)} className="btn-remove">{t('remove')}</button>
                </div>
              </div>
            ))}

            {/* Support & Contact Section */}
            <div className="form-group" style={{marginTop: '30px'}}>
              <label>Support & Contact Information</label>
              <textarea
                name="supportText"
                value={formData.supportText}
                onChange={handleChange}
                rows="8"
              />
              <small style={{color: '#666', fontSize: '12px'}}>Information about additional support, contact details, and closing remarks</small>
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-prev">{t('previousStep')}</button>
              <button type="button" onClick={nextStep} className="btn-next">{t('nextStep')}</button>
            </div>
          </div>
        )}
        {/* Step 6: General Photos (Appendix) */}
        {currentStep === 6 && (
          <div className="form-step">
            <h2>Appendix 2: General Photographs</h2>
            <p style={{color: '#666', marginBottom: '20px'}}>
              Upload general photos not tied to specific rooms (e.g., ventilation unit, exterior, common areas)
            </p>

            <div className="photo-upload-section">
              <div className="upload-area">
                <input
                  type="file"
                  id="general-photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handleGeneralPhotoUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="general-photo-upload" className="upload-label">
                  <div className="upload-icon">📷</div>
                  <p>{t('clickToUpload')}</p>
                  <span>{t('photoFormats')}</span>
                </label>
              </div>

              {formData.generalPhotos.length > 0 && (
                <div className="photos-grid">
                  {formData.generalPhotos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img src={photo.fileUrl} alt={`General photo ${index + 1}`} />
                      <div className="photo-overlay">
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={(e) => updateGeneralPhotoCaption(index, e.target.value)}
                          className="photo-description"
                        />
                        <button
                          type="button"
                          onClick={() => removeGeneralPhoto(index)}
                          className="btn-remove-photo"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="report-summary">
              <h3>{t('reportSummary')}</h3>
              <p><strong>{t('reportTitle')}:</strong> {formData.reportTitle}</p>
              <p><strong>{t('clientName')}:</strong> {formData.clientName}</p>
              <p><strong>{t('inspectionAddress')}:</strong> {formData.inspectionAddress}</p>
              <p><strong>{t('roomsInspected')}:</strong> {formData.rooms.length}</p>
              <p><strong>Total Air Samples:</strong> {formData.rooms.reduce((sum, room) => sum + room.airSamples.length, 0)}</p>
              <p><strong>Room Photos:</strong> {formData.rooms.reduce((sum, room) => sum + (room.photos?.length || 0), 0)}</p>
              <p><strong>General Photos:</strong> {formData.generalPhotos.length}</p>
              <p><strong>{t('recommendations')}:</strong> {formData.recommendations.length}</p>
            </div>

            <div className="form-group">
              <label>{t('reportStatus')}</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="draft">{t('draft')}</option>
                <option value="pending-review">{t('pendingReview')}</option>
                <option value="approved">{t('approved')}</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="button" onClick={prevStep} className="btn-prev">{t('previousStep')}</button>
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? t('loading') : t('createReport')}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateMouldReport;
