# 🧪 Instructions de Test - Application de Reporting

## ✅ Changements Effectués

1. **Un seul type de rapport:** Mould Investigation Report
2. **Bouton "New Report"** mène directement au formulaire Mould Report
3. **PDF amélioré** avec tous les champs du rapport

---

## 🚀 Comment Tester

### 1. Créer un Rapport Complet

1. **Connecte-toi** à http://localhost:3000
2. Clique sur **"New Report"**
3. **Remplis le formulaire en 5 étapes:**

#### Étape 1: Basic Information
- Report Title: `Mould Investigation - Test Hotel`
- Report Type: `Mould Investigation`
- Inspection Date: `2026-02-02`
- Client Name: `Easy Hotel`
- Contact Person: `Wim Venema`
- Inspection Address: `Westblaak 67, Rotterdam`
- Property Type: `Hotel`
- Carried Out By: `Giancarlo Caruso`

#### Étape 2: Rooms & Measurements

**Ajoute Room 105:**
- Room Number: `105`
- Temperature: `28`
- Relative Humidity: `36`
- CO₂ Level: `730`
- Particulate Matter: `2700`
- Oxygen: `20.9`

**Ajoute des échantillons d'air:**
- Mould Species: `Aspergillus species`
- Quantity: `170`
- Unit: `cfu/m³`
- Status: `Elevated`

Clique sur **"Add Sample"**, puis **"Add Room to Report"**

**Ajoute Room 611:**
- Room Number: `611`
- Temperature: `21`
- Relative Humidity: `70`
- CO₂ Level: `760`
- Particulate Matter: `7500`
- ✅ Cocher: Visible Mould, Condensation, Ventilation Issues

**Ajoute des échantillons:**
- `Penicillium species` - `>500` - `cfu/m³` - `Critical`
- `Aspergillus species` - `>500` - `cfu/m³` - `Critical`

#### Étape 3: Investigation Findings
- Summary: `Elevated concentration of mould spores identified in multiple rooms.`
- Description: `During the investigation, we conducted visual inspections and collected samples from 10 rooms.`

**Ajoute des findings:**
1. `Visible mould growth observed in several rooms` - Severity: `High`
2. `Ventilation system not functioning properly` - Severity: `Critical`

#### Étape 4: Recommendations

**Ajoute des recommandations:**
1. `Conduct targeted inspections in all rooms` - Priority: `Urgent` - Category: `Inspection`
2. `Clean the complete mechanical ventilation system` - Priority: `High` - Category: `Ventilation`
3. `Remove all mould-affected materials professionally` - Priority: `High` - Category: `Remediation`

#### Étape 5: Conclusion
```
The investigation revealed significant mould problems throughout the hotel. 
Ten rooms were examined, and mould was identified in all rooms. 
Immediate action is required to address ventilation issues and remove contaminated materials.
```

4. **Clique sur "Create Report"**

---

### 2. Télécharger le PDF

1. Va dans **"Reports"**
2. Clique sur **"View"** pour ton rapport
3. Clique sur **"Download PDF"**
4. Le PDF devrait se télécharger avec:
   - Toutes les informations du rapport
   - Détails de chaque chambre
   - Mesures de qualité de l'air
   - Échantillons microbiologiques
   - Recommandations
   - Conclusion

---

## 📊 Ce qui est Inclus dans le PDF

✅ En-tête avec titre du rapport  
✅ Détails de l'assignment (client, adresse, date, etc.)  
✅ Notes spéciales  
✅ Résumé  
✅ Investigation Findings  
✅ Chambres inspectées avec:
  - Mesures de qualité de l'air (Temp, RH, CO₂, O₂, etc.)
  - Observations visuelles
  - Échantillons d'air avec espèces de moisissures
✅ Recommandations avec priorités  
✅ Conclusion  

---

## 🎯 Résultat Attendu

Tu devrais avoir un PDF professionnel similaire au rapport que tu m'as montré, avec:
- Toutes les chambres listées
- Toutes les mesures affichées
- Tous les échantillons de moisissures
- Format propre et lisible

---

## 🐛 Si Problème

**PDF ne se télécharge pas:**
1. Vérifie la console du backend (terminal)
2. Vérifie la console du navigateur (F12)
3. Assure-toi que le rapport a bien été créé

**Rapport vide:**
- Vérifie que tu as bien rempli tous les champs requis (*)
- Vérifie que tu as ajouté au moins une chambre

Tout devrait fonctionner maintenant! 🎉
