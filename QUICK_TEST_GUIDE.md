# 🧪 Guide de Test Rapide

## ✅ Projet Lancé!

**Backend**: http://localhost:5001 ✅  
**Frontend**: http://localhost:3000 ✅  
**MongoDB**: Connected ✅

---

## 🚀 Test Rapide (5 minutes)

### Étape 1: Ouvrir l'Application
```
http://localhost:3000
```

### Étape 2: Se Connecter
Si vous n'avez pas de compte, créez-en un:
- Email: test@example.com
- Password: Test123456
- First Name: Test
- Last Name: User

### Étape 3: Créer un Rapport de Test

#### Step 1: Basic Information
```
Report Title: Test Mould Investigation - Hotel Example
Client Name: Easy Hotel Rotterdam
Contact Person: Wim Venema
Inspection Address: Westblaak 67, Rotterdam
Property Type: Hotel
Carried Out By: John Doe
Special Notes: Test inspection for validation

Investigation Findings:
• An elevated concentration of mould spores was identified in the inspected rooms.
• Visible mould growth was observed in several rooms.
• The ventilation system is not functioning properly.

Letter Introduction:
Dear Mr Venema,

On 2 February 2026, we carried out a mould investigation on your behalf. In this report, we present our findings, conclusions, and recommendations.

During the investigation, we conducted a visual technical inspection, collected samples, and performed various measurements in several rooms.
```

Cliquer **Next Step**

#### Step 2: Rooms & Measurements

**Ajouter Chambre 1:**
```
Room Number: 105
Room Name: Guest Room
Floor: 1st Floor

Temperature: 28 °C
Temperature Status: Critical (Red) ← IMPORTANT!

Relative Humidity: 36 %
Humidity Status: Warning (Yellow) ← IMPORTANT!

CO₂ Level: 730 PPM
CO₂ Status: Normal (Green) ← IMPORTANT!

Particulate Matter: 2700
PM Status: Critical (Red) ← IMPORTANT!
```

**Ajouter un Air Sample:**
```
Sample Location: Room 105 (auto-rempli)
Type: Air
Species: Mould
Identified Mould Species: Aspergillus species
Total Quantity: 170 cfu/m³
```

Cliquer **Add Air Sample**, puis **Add Room**

**Ajouter Chambre 2 (optionnel):**
```
Room Number: 111
Temperature: 21 °C → Status: Normal (Green)
Humidity: 68 % → Status: Critical (Red)
CO₂: 675 PPM → Status: Normal (Green)
PM: 2300 → Status: Warning (Yellow)
```

Cliquer **Next Step**

#### Step 3: Additional Air Quality
```
Section Intro Text:
Additional air quality measurements were carried out to assess oxygen levels and the presence of formaldehyde (CH₂O) and/or volatile organic compounds (VOCs).

Location: Hotel
Oxygen: 20.9%
Formaldehyde: None
VOC: None

Section Conclusion Text:
The results indicate normal levels of oxygen and no presence of harmful VOCs or formaldehyde.
```

Cliquer **Next Step**

#### Step 4: Microbiological Results
```
Section Intro Text:
Air samples were collected using an air sampler, drawing moulds and yeasts onto OGEY agar plates at multiple locations within the property.

Section Conclusion Text:
The results indicate elevated concentrations of mould spores in several rooms, requiring immediate attention.
```

Cliquer **Next Step**

#### Step 5: Conclusion & Proposed Measures
```
Conclusion:
We conducted an extensive investigation within the hotel, during which multiple rooms were inspected and sampled. The investigation revealed elevated levels of mould contamination in several guest rooms, primarily due to inadequate ventilation and moisture issues.

Proposed Measures:
1. Immediate remediation of visible mould growth
2. Improvement of ventilation systems
3. Repair of identified leakage sources
4. Regular monitoring of indoor air quality

Recommendations:
• Priority: Urgent
  Recommendation: Immediate remediation of mould contamination in affected rooms
  Category: Remediation

• Priority: High
  Recommendation: Inspection and cleaning of complete ventilation system
  Category: Ventilation

Support Text:
Our Support. Should you wish, we can assist you with further investigations and/or carry out the recommended remediation works. If required, we would be pleased to prepare a tailored quotation for both the inspection and cleaning of the complete ventilation system, as well as for the investigation and professional remediation of mould contamination in the hotel rooms.

In preparing this report, we have endeavoured to be as thorough as possible. Should you have any questions regarding this report or the investigation carried out, please feel free to contact us on weekdays between 9:00 and 17:00 by telephone on +31 6 1873 8897 or by email at info@intra-air.nl
```

Cliquer **Next Step**

#### Step 6: General Photos
(Optionnel - vous pouvez uploader des photos ou passer)

Cliquer **Submit Report**

---

## ✅ Vérifications

### 1. Soumission du Formulaire
- [ ] Pas d'erreur 500 ✅
- [ ] Message de succès affiché
- [ ] Redirection vers la liste des rapports

### 2. Génération du PDF
1. Aller dans la liste des rapports
2. Cliquer sur le rapport créé
3. Cliquer sur "Generate PDF"
4. Vérifier que le PDF contient:
   - [ ] Cover Page
   - [ ] Assignment Details
   - [ ] **Investigation Findings** (nouveau)
   - [ ] **Letter Introduction** (nouveau)
   - [ ] Section I avec **couleurs basées sur status** (rouge/jaune/vert)
   - [ ] Section II (Additional Air Quality)
   - [ ] Section III (Microbiological Results)
   - [ ] Conclusion
   - [ ] Recommendations
   - [ ] **Support Text** (nouveau)

### 3. Couleurs dans le PDF
Vérifier que les couleurs correspondent aux statuts:
- Room 105:
  - Temperature 28°C → **Rouge** (Critical)
  - Humidity 36% → **Jaune** (Warning)
  - CO₂ 730 → **Vert** (Normal)
  - PM 2700 → **Rouge** (Critical)

---

## 🎯 Points Clés à Tester

### ✅ Nouveaux Champs
1. **Investigation Findings** - Doit apparaître dans le PDF
2. **Letter Introduction** - Doit apparaître avant Results
3. **Support Text** - Doit apparaître après Recommendations

### ✅ Indicateurs de Statut
1. Les dropdowns fonctionnent (Normal/Warning/Critical)
2. Les couleurs dans le PDF correspondent aux statuts sélectionnés
3. Pas de couleurs automatiques basées sur les valeurs

### ✅ Upload Path
1. Les photos sont sauvegardées dans `D:/Reporting_app_uploads`
2. Les photos s'affichent correctement dans le formulaire
3. Les photos apparaissent dans le PDF

---

## 🐛 Si Vous Rencontrez des Problèmes

### Erreur 500 lors de la soumission
1. Vérifier que tous les champs requis sont remplis
2. Vérifier les logs du backend (Terminal ID: 3)
3. Vérifier la connexion MongoDB

### PDF ne se génère pas
1. Vérifier que le rapport est bien créé
2. Vérifier les logs du backend
3. Vérifier que les photos existent dans `D:/Reporting_app_uploads`

### Couleurs incorrectes dans le PDF
1. Vérifier que vous avez bien sélectionné les statuts dans Step 2
2. Les couleurs sont basées sur les statuts, pas sur les valeurs

---

## 📊 Résultat Attendu

Après le test, vous devriez avoir:
1. ✅ Un rapport créé sans erreur 500
2. ✅ Un PDF généré avec toutes les nouvelles sections
3. ✅ Des couleurs correctes dans les tableaux (basées sur status)
4. ✅ Investigation Findings visible dans le PDF
5. ✅ Letter Introduction visible dans le PDF
6. ✅ Support Text visible dans le PDF

---

## 🎉 Succès!

Si tous les points ci-dessus fonctionnent, alors:
- ✅ L'erreur 500 est corrigée
- ✅ Tous les nouveaux champs sont fonctionnels
- ✅ Les indicateurs de couleur fonctionnent
- ✅ Le PDF est généré correctement
- ✅ L'application est prête à l'emploi!

---

**Temps estimé**: 5-10 minutes  
**Difficulté**: Facile  
**Prérequis**: Backend et Frontend en cours d'exécution
