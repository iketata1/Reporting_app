# Guide de Correction - Erreur 500

## Problème
L'erreur 500 se produit car le formulaire envoie des données que le backend ne reconnaît pas, ou des champs requis manquent.

## Solution Rapide

### Étape 1: Vérifier que le serveur backend fonctionne

```bash
cd backend
npm start
```

Le serveur doit démarrer sur http://localhost:5000

### Étape 2: Vérifier la connexion MongoDB

Dans `.env` (racine du projet), vérifiez:
```
MONGODB_URI=mongodb://localhost:27017/reporting_app
JWT_SECRET=your_secret_key_here
PORT=5000
```

### Étape 3: Ajouter les champs manquants au formulaire

Ouvrez `frontend/src/pages/CreateMouldReport.js`

#### A. Mettre à jour formData (ligne ~15):

Trouvez:
```javascript
specialNotes: '',
language: language,
```

Ajoutez APRÈS:
```javascript
investigationFindingsText: '',
letterIntroduction: '',
```

Trouvez:
```javascript
proposedMeasures: '',
```

Ajoutez APRÈS:
```javascript
supportText: '',
```

#### B. Ajouter les champs dans Step 1 (ligne ~470):

Trouvez la section `specialNotes` et ajoutez APRÈS:

```javascript
{/* Investigation Findings */}
<div className="form-group">
  <label>Investigation Findings</label>
  <textarea
    name="investigationFindingsText"
    value={formData.investigationFindingsText}
    onChange={handleChange}
    rows="6"
    placeholder="• An elevated concentration of mould spores...&#10;• Visible mould growth was observed..."
  />
</div>

{/* Letter Introduction */}
<div className="form-group">
  <label>Letter Introduction</label>
  <textarea
    name="letterIntroduction"
    value={formData.letterIntroduction}
    onChange={handleChange}
    rows="4"
    placeholder="Dear Mr...,&#10;&#10;On [date], we carried out a mould investigation..."
  />
</div>
```

#### C. Ajouter Support Text dans Step 5 (après recommendations):

```javascript
{/* Support & Contact */}
<div className="form-group">
  <label>Support & Contact Information</label>
  <textarea
    name="supportText"
    value={formData.supportText}
    onChange={handleChange}
    rows="6"
    placeholder="Our Support. Should you wish, we can assist you..."
  />
</div>
```

### Étape 4: Ajouter les indicateurs de couleur pour les mesures

#### A. Mettre à jour currentRoom state (ligne ~80):

Trouvez:
```javascript
const [currentRoom, setCurrentRoom] = useState({
  roomNumber: '',
  roomName: '',
  floor: '',
  temperature: '',
  relativeHumidity: '',
  co2Level: '',
  particulateMatter: '',
```

Ajoutez APRÈS particulateMatter:
```javascript
temperatureStatus: 'normal',
humidityStatus: 'normal',
co2Status: 'normal',
pmStatus: 'normal',
```

#### B. Dans Step 2, après chaque champ de mesure, ajoutez un sélecteur de statut:

Après le champ `temperature`:
```javascript
<div className="form-group">
  <label>Temperature Status</label>
  <select 
    name="temperatureStatus" 
    value={currentRoom.temperatureStatus || 'normal'} 
    onChange={handleRoomChange}
  >
    <option value="normal">✓ Normal (Green)</option>
    <option value="warning">⚠ Warning (Yellow)</option>
    <option value="critical">✗ Critical (Red)</option>
  </select>
</div>
```

Répétez pour:
- `humidityStatus` (après relativeHumidity)
- `co2Status` (après co2Level)
- `pmStatus` (après particulateMatter)

### Étape 5: Mettre à jour le backend model

Ouvrez `backend/models/Report.js`

Trouvez la section `rooms` et ajoutez les champs de statut:

```javascript
temperature: Number,
temperatureStatus: {
  type: String,
  enum: ['normal', 'warning', 'critical'],
  default: 'normal'
},
relativeHumidity: Number,
humidityStatus: {
  type: String,
  enum: ['normal', 'warning', 'critical'],
  default: 'normal'
},
co2Level: Number,
co2Status: {
  type: String,
  enum: ['normal', 'warning', 'critical'],
  default: 'normal'
},
particulateMatter: Number,
pmStatus: {
  type: String,
  enum: ['normal', 'warning', 'critical'],
  default: 'normal'
},
```

### Étape 6: Mettre à jour la génération PDF

Ouvrez `backend/controllers/reportController.js`

#### A. Ajouter Investigation Findings après Assignment Details (ligne ~250):

```javascript
// Investigation Findings
if (report.investigationFindingsText) {
  doc.moveDown(2);
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
}
```

#### B. Ajouter Letter Introduction avant Results (ligne ~280):

```javascript
// Letter Introduction
if (report.letterIntroduction) {
  doc.addPage();
  
  doc.fontSize(10).font('Helvetica').fillColor(colors.text)
     .text('Intra Air', 50, 30);
  
  doc.moveDown(2);
  doc.fontSize(10).font('Helvetica')
     .text(report.letterIntroduction, 50, doc.y, {
       width: doc.page.width - 100,
       align: 'justify'
     });
  
  doc.moveDown(2);
}
```

#### C. Utiliser les status pour les couleurs (ligne ~350):

Trouvez la section où les couleurs sont déterminées:

```javascript
// AVANT:
const tempColor = room.temperature > 22 || room.temperature < 18 ? colors.red : colors.green;

// APRÈS:
const tempColor = room.temperatureStatus === 'critical' ? colors.red : 
                  room.temperatureStatus === 'warning' ? colors.yellow : colors.green;
```

Répétez pour RH, CO2, PM.

#### D. Ajouter Support Text après Recommendations (ligne ~650):

```javascript
// Support & Contact
if (report.supportText) {
  doc.moveDown(2);
  doc.fontSize(12).font('Helvetica-Bold').text('Our Support', 50);
  doc.moveDown(1);
  
  doc.fontSize(10).font('Helvetica').text(report.supportText, 50, doc.y, {
    width: doc.page.width - 100,
    align: 'justify'
  });
}
```

### Étape 7: Tester

1. Redémarrez le backend:
```bash
cd backend
npm start
```

2. Redémarrez le frontend:
```bash
cd frontend
npm start
```

3. Créez un nouveau rapport et remplissez tous les champs
4. Soumettez le formulaire
5. Vérifiez qu'il n'y a plus d'erreur 500

## Textes par défaut suggérés

### Investigation Findings:
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

### Letter Introduction:
```
Dear Mr Venema,

On 2 February 2026, we carried out a mould investigation on your behalf. In this report, we present our findings, conclusions, and recommendations. The assessment represents a snapshot of the general condition of the indoor environment at the time of the inspection.

During the investigation, we conducted a visual technical inspection, collected samples, and performed various measurements in several rooms.
```

### Support Text:
```
Our Support. Should you wish, we can assist you with further investigations and/or carry out the recommended remediation works. If required, we would be pleased to prepare a tailored quotation for both the inspection and cleaning of the complete ventilation system, as well as for the investigation and professional remediation of mould contamination in the hotel rooms. Please let us know if you would like us to proceed, and we will provide a detailed proposal and cost estimate accordingly.

In preparing this report, we have endeavoured to be as thorough as possible. Should you have any questions regarding this report or the investigation carried out, please feel free to contact us on weekdays between 9:00 and 17:00 by telephone on +31 6 1873 8897 or by email at info@intra-air.nl
```

## Dépannage

### Si l'erreur 500 persiste:

1. Vérifiez les logs du backend dans la console
2. Vérifiez que MongoDB est en cours d'exécution
3. Vérifiez que tous les champs requis sont remplis
4. Utilisez les DevTools du navigateur (F12) → Network → Cliquez sur la requête failed → Onglet "Response" pour voir le message d'erreur exact

### Si MongoDB ne se connecte pas:

```bash
# Windows - Démarrer MongoDB
net start MongoDB

# Ou installer MongoDB Community Edition si pas installé
```

### Si les modifications ne s'appliquent pas:

1. Effacez le cache du navigateur (Ctrl+Shift+Delete)
2. Redémarrez les serveurs frontend et backend
3. Vérifiez qu'il n'y a pas d'erreurs de syntaxe dans les fichiers modifiés
