# Required Form Changes

## Problem
500 Error when submitting form - missing fields in backend model

## Solution

### 1. Add to formData state (line ~15):

```javascript
// After specialNotes:
investigationFindingsText: '',  // NEW: Investigation Findings section
letterIntroduction: '',         // NEW: Dear Mr... section

// After proposedMeasures:
supportText: '',                // NEW: Support/Contact section
```

### 2. Add to Step 1 (after specialNotes field, before form-actions):

```javascript
{/* Investigation Findings */}
<div className="form-group">
  <label>Investigation Findings</label>
  <textarea
    name="investigationFindingsText"
    value={formData.investigationFindingsText}
    onChange={handleChange}
    rows="6"
    placeholder="• An elevated concentration of mould spores was identified...&#10;• Visible mould growth was observed...&#10;• The ventilation system is not functioning properly..."
  />
  <small>Enter bullet points of key findings (one per line)</small>
</div>

{/* Letter Introduction */}
<div className="form-group">
  <label>Letter Introduction (Dear Mr...)</label>
  <textarea
    name="letterIntroduction"
    value={formData.letterIntroduction}
    onChange={handleChange}
    rows="4"
    placeholder="Dear Mr Venema,&#10;&#10;On 2 February 2026, we carried out a mould investigation on your behalf..."
  />
  <small>Personalized introduction letter for the client</small>
</div>
```

### 3. Add to Step 5 (after recommendations, before form-actions):

```javascript
{/* Support/Contact Section */}
<div className="form-group">
  <label>Support & Contact Information</label>
  <textarea
    name="supportText"
    value={formData.supportText}
    onChange={handleChange}
    rows="6"
    placeholder="Our Support. Should you wish, we can assist you with further investigations..."
  />
  <small>Information about additional support and contact details</small>
</div>
```

### 4. Add color status indicators for measurements in Step 2:

For each measurement (temperature, humidity, CO2, PM), add a dropdown to select status:

```javascript
{/* After temperature input */}
<div className="form-group">
  <label>Temperature Status</label>
  <select name="temperatureStatus" value={currentRoom.temperatureStatus || 'normal'} onChange={handleRoomChange}>
    <option value="normal">Normal (Green)</option>
    <option value="warning">Warning (Yellow)</option>
    <option value="critical">Critical (Red)</option>
  </select>
</div>
```

Repeat for: humidityStatus, co2Status, pmStatus

### 5. Update currentRoom state to include status fields:

```javascript
const [currentRoom, setCurrentRoom] = useState({
  // ... existing fields ...
  temperatureStatus: 'normal',
  humidityStatus: 'normal',
  co2Status: 'normal',
  pmStatus: 'normal',
  // ... rest of fields ...
});
```

### 6. Update translations in translations.js:

```javascript
investigationFindings: {
  en: 'Investigation Findings',
  fr: 'Résultats de l\'enquête',
  nl: 'Onderzoeksresultaten'
},
letterIntroduction: {
  en: 'Letter Introduction',
  fr: 'Introduction de la lettre',
  nl: 'Brief introductie'
},
supportText: {
  en: 'Support & Contact',
  fr: 'Support et contact',
  nl: 'Ondersteuning en contact'
},
measurementStatus: {
  en: 'Status',
  fr: 'Statut',
  nl: 'Status'
},
statusNormal: {
  en: 'Normal (Green)',
  fr: 'Normal (Vert)',
  nl: 'Normaal (Groen)'
},
statusWarning: {
  en: 'Warning (Yellow)',
  fr: 'Avertissement (Jaune)',
  nl: 'Waarschuwing (Geel)'
},
statusCritical: {
  en: 'Critical (Red)',
  fr: 'Critique (Rouge)',
  nl: 'Kritiek (Rood)'
}
```

## Default Text Values

### Investigation Findings (example):
```
• An elevated concentration of mould spores was identified in the inspected rooms.
• Visible mould growth was observed in several rooms.
• Significant mould growth is suspected behind the thick renovation fleece/glass fibre wallpaper.
• The ventilation system is not functioning properly in several rooms, resulting in elevated CO₂ concentrations.
• The mechanical ventilation unit on the roof shows visible mould contamination.
• Condensation was observed in multiple rooms, consistent with insufficient ventilation and inadequate air circulation.
• Leakage was identified around several shower enclosures.
• Water ingress from the roof was identified on the upper floor.
```

### Letter Introduction (example):
```
Dear Mr Venema,

On 2 February 2026, we carried out a mould investigation on your behalf. In this report, we present our findings, conclusions, and recommendations. The assessment represents a snapshot of the general condition of the indoor environment at the time of the inspection.

During the investigation, we conducted a visual technical inspection, collected samples, and performed various measurements in several rooms.
```

### Support Text (example):
```
Our Support. Should you wish, we can assist you with further investigations and/or carry out the recommended remediation works. If required, we would be pleased to prepare a tailored quotation for both the inspection and cleaning of the complete ventilation system, as well as for the investigation and professional remediation of mould contamination in the hotel rooms. Please let us know if you would like us to proceed, and we will provide a detailed proposal and cost estimate accordingly.

In preparing this report, we have endeavoured to be as thorough as possible. Should you have any questions regarding this report or the investigation carried out, please feel free to contact us on weekdays between 9:00 and 17:00 by telephone on +31 6 1873 8897 or by email at info@intra-air.nl
```

## Backend Model Already Updated ✅

The backend model (Report.js) already has these fields:
- investigationFindingsText
- letterIntroduction
- supportText
- temperatureStatus, humidityStatus, co2Status, pmStatus (need to add)

## PDF Generation Updates Needed

Update reportController.js to:
1. Show Investigation Findings section after Assignment Details
2. Show Letter Introduction before Results section
3. Use status fields for color coding in tables
4. Show Support Text after Recommendations
