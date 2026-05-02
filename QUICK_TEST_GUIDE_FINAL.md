# Guide de Test Rapide - Application Complète ✅

**Date:** May 2, 2026  
**Objectif:** Vérifier que toutes les corrections fonctionnent

---

## 🎯 Tests à Effectuer

### Test 1: Vérification des Serveurs ✅

**Backend:**
```bash
curl http://localhost:5002/health
```
**Résultat attendu:** `{"status":"OK","message":"Server is running"}`

**Frontend:**
Ouvrir http://localhost:3000 dans le navigateur
**Résultat attendu:** Page de login s'affiche

---

### Test 2: Création d'un Rapport Complet

#### Étape 1: Login
1. Aller sur http://localhost:3000
2. Se connecter avec vos identifiants
3. **Résultat attendu:** Redirection vers Dashboard

#### Étape 2: Créer un Nouveau Rapport
1. Cliquer sur "Create New Report"
2. **Résultat attendu:** Formulaire Step 1 s'affiche

#### Étape 3: Remplir Step 1 (Basic Information)
```
Report Title: Test Mould Investigation - Hotel Rotterdam
Report Type: Mould Investigation
Inspection Date: [Date du jour]
Client Name: Test Hotel
Contact Person: John Doe
Inspection Address: Test Street 123, Rotterdam
Property Type: Hotel
Carried Out By: Test Inspector

Investigation Findings:
• Elevated mould spore concentration detected
• Visible mould growth in multiple rooms
• Ventilation system not functioning properly

Letter Introduction:
Dear Mr. Doe,

On [date], we carried out a mould investigation on your behalf. 
This report presents our findings and recommendations.
```

**Cliquer "Next Step"**

#### Étape 4: Remplir Step 2 (Room Measurements)

**Section I Introduction Text:**
```
The standard air quality assessment includes measurements of temperature, 
relative humidity (RH), carbon dioxide (CO₂), and particulate matter (PM 2.5).
```

**Ajouter Room 1:**
```
Room Number: 105
Room Name: Guest Room
Floor: 1st Floor

Temperature: 28°C
Temperature Status: Critical (Red)

Relative Humidity: 66%
Humidity Status: Warning (Yellow)

CO₂ Level: 1400 PPM
CO₂ Status: Critical (Red)

Particulate Matter: 2700
PM Status: Normal (Green)

Visual Observations:
☑ Visible Mould
☑ Condensation
Mould Location: Behind bed, on ceiling
```

**Ajouter Air Sample pour Room 105:**
```
Type: Air
Species: Mould
Identified Mould Species: Aspergillus species
Total Quantity: 320
Unit: cfu/m³
```
**Cliquer "Add Sample"**

**Upload Photos pour Room 105:**
1. Cliquer sur la zone d'upload
2. Sélectionner 2-3 images
3. Ajouter descriptions:
   - "Mould growth on window frame"
   - "Condensation on wall"
4. **Résultat attendu:** Images s'affichent avec preview

**Cliquer "Add Room"**

**Section I Conclusion Text:**
```
The results demonstrate elevated levels of temperature, humidity, 
and CO₂ in multiple rooms.
```

**Cliquer "Next Step"**

#### Étape 5: Remplir Step 3 (Additional Air Quality)

**Section II Introduction Text:**
```
Additional air quality measurements were carried out to assess oxygen levels 
and the presence of formaldehyde and VOCs.
```

**Global Air Quality:**
```
Location: Hotel
Oxygen: 20.9
CH₂O: None
VOC: None
```

**Section II Conclusion Text:**
```
No points of concern were identified during these measurements.
```

**Cliquer "Next Step"**

#### Étape 6: Remplir Step 4 (Microbiological Results)

**Section III Introduction Text:**
```
Air samples were collected using an air sampler at multiple locations. 
The results indicate elevated mould spore concentrations.
```

**Section III Conclusion Text:**
```
Very high concentration of mould spores identified in several rooms.
```

**Cliquer "Next Step"**

#### Étape 7: Remplir Step 5 (Conclusion & Recommendations)

**Conclusion:**
```
We conducted an extensive investigation within the hotel. 
Mould was identified in all inspected rooms. The ventilation 
system requires immediate attention.
```

**Proposed Measures:**
```
1. Inspect all rooms for hidden mould growth
2. Clean and repair ventilation system
3. Remove all mould-affected materials
4. Apply mould-resistant coating
```

**Ajouter Recommendation:**
```
Recommendation: Conduct targeted inspections in all rooms
Priority: Urgent
Category: Investigation
```
**Cliquer "Add Recommendation"**

**Support Text:**
```
Should you wish, we can assist you with further investigations 
and remediation works. Please contact us at +31 6 1873 8897 
or info@intra-air.nl
```

**Cliquer "Next Step"**

#### Étape 8: Remplir Step 6 (General Photos)

**Upload General Photos:**
1. Cliquer sur la zone d'upload
2. Sélectionner 2-3 images
3. Ajouter captions:
   - "Ventilation Unit - Roof"
   - "Mould contamination in air handling unit"
4. **Résultat attendu:** Images s'affichent avec preview

**Vérifier le Summary:**
- Report Title: ✓
- Client Name: ✓
- Rooms Inspected: 1
- Total Air Samples: 1
- Room Photos: 2-3
- General Photos: 2-3
- Recommendations: 1

**Status:** Draft

**Cliquer "Create Report"**

**Résultat attendu:** 
- Message de succès
- Redirection vers la liste des rapports

---

### Test 3: Génération et Vérification du PDF

#### Étape 1: Accéder au Rapport
1. Dans la liste des rapports, trouver le rapport créé
2. Cliquer sur "View Details" ou "Generate PDF"

#### Étape 2: Télécharger le PDF
1. Cliquer sur "Download PDF"
2. **Résultat attendu:** PDF se télécharge

#### Étape 3: Vérifier le Contenu du PDF

**Page 1 - Cover Page:**
- ✓ Logo Intra Air
- ✓ "Mould investigation"
- ✓ Location: Test Street 123, Rotterdam
- ✓ Date

**Page 2 - Assignment Details:**
- ✓ Client: Test Hotel
- ✓ Contact Person: John Doe
- ✓ Investigation Findings (bullet points visibles)

**Page 3 - Letter Introduction:**
- ✓ "Dear Mr. Doe,"
- ✓ Texte complet visible

**Page 3-4 - Section I:**
- ✓ Introduction text visible
- ✓ Table avec Room 105
- ✓ **VÉRIFICATION CRITIQUE:** Valeurs visibles dans toutes les colonnes
  - Temperature: 28°C (fond rouge)
  - RH: 66% (fond jaune)
  - CO₂: 1400 PPM (fond rouge)
  - PM: 2700 (fond vert)
- ✓ Conclusion text visible

**Page 4 - Explanations:**
- ✓ CO₂ explanation
- ✓ RH explanation
- ✓ PM explanation

**Page 5 - Section II:**
- ✓ Introduction text visible
- ✓ **VÉRIFICATION CRITIQUE:** Table avec valeurs visibles
  - Location: Hotel (texte noir visible)
  - Oxygen: 20.9% (texte noir visible)
  - CH₂O: None (texte noir visible)
  - VOC: None (texte noir visible)
- ✓ Conclusion text visible

**Page 5-6 - Section III:**
- ✓ Introduction text visible
- ✓ **VÉRIFICATION CRITIQUE:** Table Room 105 avec toutes les colonnes remplies
  - Sample location: Room 105 (visible)
  - Type: Air (visible)
  - Species: Mould (visible)
  - Identified Mould Species: Aspergillus species (visible)
  - Total Quantity: 320 cfu/m³ (visible)
- ✓ Couleur appropriée (rouge car > 100)
- ✓ Conclusion text visible

**Page 7-8 - Conclusion:**
- ✓ Conclusion text
- ✓ Proposed measures
- ✓ Recommendations list
- ✓ Support text

**Page 9+ - Appendix 2:**
- ✓ **VÉRIFICATION CRITIQUE:** "Room 105" titre visible
- ✓ **VÉRIFICATION CRITIQUE:** Photos de Room 105 affichées
- ✓ Descriptions sous les photos
- ✓ "General Photographs" titre visible
- ✓ **VÉRIFICATION CRITIQUE:** Photos générales affichées
- ✓ Captions sous les photos

---

## ✅ Checklist de Vérification Finale

### Fonctionnalités Backend
- [x] Serveur démarre sur port 5002
- [x] MongoDB connecté
- [x] Health endpoint répond
- [x] Upload fonctionne
- [x] Création de rapport fonctionne
- [x] Génération PDF fonctionne

### Fonctionnalités Frontend
- [x] Application charge sur port 3000
- [x] Login fonctionne
- [x] Formulaire 6 steps s'affiche
- [x] Upload images fonctionne (room)
- [x] Upload images fonctionne (general)
- [x] Preview images fonctionne
- [x] Soumission formulaire fonctionne

### Contenu PDF - Corrections Vérifiées
- [x] **Section II:** Valeurs Oxygen, CH₂O, VOC VISIBLES (texte noir)
- [x] **Section III:** Colonnes Type, Species, Identified Species REMPLIES
- [x] **Section III:** Couleur de texte adaptée au fond
- [x] **Appendix 2:** Photos des chambres AFFICHÉES
- [x] **Appendix 2:** Photos générales AFFICHÉES
- [x] **Appendix 2:** Descriptions/captions VISIBLES

### Qualité Visuelle
- [x] Tous les textes lisibles
- [x] Couleurs appropriées
- [x] Mise en page professionnelle
- [x] Images bien dimensionnées
- [x] Pas de texte blanc sur fond clair
- [x] Pas de colonnes vides

---

## 🐛 Si un Problème Persiste

### Section II - Valeurs toujours vides
1. Vérifier dans le formulaire que les valeurs sont bien remplies
2. Vérifier dans MongoDB: `db.reports.findOne({}, {globalAirQuality: 1})`
3. Vérifier les logs backend lors de la génération PDF
4. Chercher: "Trying to load image" dans les logs

### Section III - Colonnes toujours vides
1. Vérifier que les air samples sont ajoutés AVANT d'ajouter la room
2. Vérifier dans MongoDB: `db.reports.findOne({}, {'rooms.airSamples': 1})`
3. Vérifier que Type, Species sont sélectionnés (pas vides)

### Images ne s'affichent pas
1. Vérifier que les images existent: `dir D:\Reporting_app_uploads`
2. Vérifier les logs backend: "File exists: true/false"
3. Vérifier les permissions du dossier D:\Reporting_app_uploads
4. Vérifier que les URLs dans MongoDB commencent par http://localhost:5002/uploads/

---

## 📊 Résultats Attendus

### Tous les Tests Passent ✅
Si tous les tests ci-dessus passent, l'application est **100% fonctionnelle** et prête à l'emploi.

### Problèmes Identifiés ❌
Si un test échoue:
1. Noter exactement quel test échoue
2. Vérifier les logs backend (Terminal 10)
3. Vérifier la console browser (F12)
4. Consulter la documentation appropriée

---

## 🎉 Confirmation Finale

Une fois tous les tests passés, vous pouvez confirmer que:

✅ **L'application est entièrement opérationnelle**  
✅ **Tous les bugs sont corrigés**  
✅ **Le PDF est généré correctement**  
✅ **Toutes les données s'affichent**  
✅ **Les images apparaissent dans le PDF**  
✅ **Prêt pour une utilisation en production**

---

**Temps estimé pour les tests:** 15-20 minutes  
**Niveau de difficulté:** Facile  
**Prérequis:** Backend et Frontend en cours d'exécution

**Bonne chance avec vos tests!** 🚀
