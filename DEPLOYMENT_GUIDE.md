# 🚀 Guide de Déploiement Vercel - Étape par Étape

## 📋 Table des Matières
1. [Comprendre l'Architecture](#architecture)
2. [Préparation du Projet](#preparation)
3. [Configuration MongoDB Atlas](#mongodb)
4. [Configuration Vercel](#vercel)
5. [Déploiement](#deployment)
6. [Gestion des Fichiers Uploadés](#files)
7. [Tests et Vérification](#tests)

---

## 🏗️ Architecture (Comment ça marche)

### Avant (Local):
```
Ton PC → Backend (Port 5002) → MongoDB Atlas (Cloud)
Ton PC → Frontend (Port 3000)
```

### Après (Production):
```
Internet → Vercel (Frontend + Backend) → MongoDB Atlas (Cloud)
                ↓
         Cloudinary (Photos)
```

**Ce qui reste en ligne 24/7:**
- ✅ Frontend sur Vercel (gratuit)
- ✅ Backend sur Vercel Serverless (gratuit)
- ✅ MongoDB Atlas (déjà en ligne, gratuit)
- ✅ Photos sur Cloudinary (gratuit jusqu'à 25GB)

---

## 🔧 ÉTAPE 1: Préparation du Projet

### 1.1 Installer Git (si pas déjà fait)
```bash
# Vérifier si Git est installé
git --version

# Si pas installé, télécharger: https://git-scm.com/download/win
```

### 1.2 Créer un compte GitHub
1. Aller sur https://github.com
2. Cliquer "Sign up"
3. Créer ton compte (gratuit)

### 1.3 Créer un compte Vercel
1. Aller sur https://vercel.com
2. Cliquer "Sign Up"
3. **IMPORTANT**: Se connecter avec GitHub (pas email)
4. Autoriser Vercel à accéder à GitHub

### 1.4 Créer un compte Cloudinary (pour les photos)
1. Aller sur https://cloudinary.com
2. Cliquer "Sign Up Free"
3. Créer ton compte
4. Noter ces informations (Dashboard):
   - Cloud Name
   - API Key
   - API Secret

---

## 📦 ÉTAPE 2: Préparer le Code

### 2.1 Initialiser Git dans ton projet
```bash
# Ouvrir le terminal dans ton dossier projet
cd D:/Reporting_app  # ou ton chemin

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Ready for deployment"
```

### 2.2 Créer un repository GitHub
1. Aller sur https://github.com
2. Cliquer sur "+" en haut à droite → "New repository"
3. Nom: `reporting-app` (ou ce que tu veux)
4. Laisser "Public" ou choisir "Private"
5. **NE PAS** cocher "Initialize with README"
6. Cliquer "Create repository"

### 2.3 Pousser le code sur GitHub
```bash
# Copier les commandes que GitHub te montre, exemple:
git remote add origin https://github.com/TON_USERNAME/reporting-app.git
git branch -M main
git push -u origin main
```

---

## 🗄️ ÉTAPE 3: Configuration MongoDB Atlas

### 3.1 Vérifier MongoDB Atlas
1. Aller sur https://cloud.mongodb.com
2. Se connecter
3. Aller dans "Database" → "Connect"
4. Copier ton **Connection String** (commence par `mongodb+srv://...`)

### 3.2 Autoriser toutes les IPs (pour Vercel)
1. Dans MongoDB Atlas → "Network Access"
2. Cliquer "Add IP Address"
3. Cliquer "Allow Access from Anywhere"
4. IP: `0.0.0.0/0`
5. Cliquer "Confirm"

**Pourquoi?** Vercel utilise des IPs dynamiques, donc on doit autoriser toutes les IPs.

---

## ☁️ ÉTAPE 4: Configuration Cloudinary (Photos)

### 4.1 Obtenir les credentials Cloudinary
1. Aller sur https://cloudinary.com/console
2. Noter:
   - **Cloud Name**: (exemple: `dxxxxx`)
   - **API Key**: (exemple: `123456789012345`)
   - **API Secret**: (exemple: `abcdefghijklmnop`)

---

## 🚀 ÉTAPE 5: Déployer sur Vercel

### 5.1 Importer le projet sur Vercel
1. Aller sur https://vercel.com/dashboard
2. Cliquer "Add New..." → "Project"
3. Trouver ton repository `reporting-app`
4. Cliquer "Import"

### 5.2 Configurer les Variables d'Environnement
**TRÈS IMPORTANT!** Avant de déployer, ajouter ces variables:

1. Dans Vercel, section "Environment Variables"
2. Ajouter ces variables une par une:

```
MONGODB_URI = mongodb+srv://ton_user:ton_password@cluster.mongodb.net/reporting_app
JWT_SECRET = ton_secret_jwt_ici_minimum_32_caracteres
NODE_ENV = production
PORT = 5002

CLOUDINARY_CLOUD_NAME = ton_cloud_name
CLOUDINARY_API_KEY = ton_api_key
CLOUDINARY_API_SECRET = ton_api_secret
```

**Comment obtenir chaque valeur:**
- `MONGODB_URI`: Copié de MongoDB Atlas (étape 3.1)
- `JWT_SECRET`: Créer un secret aléatoire (exemple: `mySecretKey123456789abcdefghijklmnop`)
- `CLOUDINARY_*`: Copié de Cloudinary (étape 4.1)

### 5.3 Configurer le Build
1. **Framework Preset**: Other
2. **Build Command**: `cd frontend && npm install && npm run build`
3. **Output Directory**: `frontend/build`
4. **Install Command**: `npm install`

### 5.4 Déployer
1. Cliquer "Deploy"
2. Attendre 2-5 minutes
3. ✅ Ton site est en ligne!

---

## 📸 ÉTAPE 6: Modifier le Code pour Cloudinary

### 6.1 Installer Cloudinary dans le backend
```bash
cd backend
npm install cloudinary multer-storage-cloudinary
```

### 6.2 Créer le fichier de configuration Cloudinary
Créer `backend/config/cloudinary.js`:

```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reporting-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
    transformation: [{ width: 1500, height: 1500, crop: 'limit' }]
  }
});

module.exports = { cloudinary, storage };
```

### 6.3 Modifier le fichier upload
Modifier `backend/routes/upload.js` pour utiliser Cloudinary au lieu du disque local.

---

## ✅ ÉTAPE 7: Tester le Déploiement

### 7.1 Obtenir l'URL de ton site
Après le déploiement, Vercel te donne une URL comme:
```
https://reporting-app-xxxxx.vercel.app
```

### 7.2 Tester les fonctionnalités
1. **Login**: Aller sur l'URL → Login
   - Email: `admin@intraair.com`
   - Password: `admin`

2. **Créer un rapport**: Tester la création

3. **Upload photos**: Vérifier que les photos s'uploadent

4. **Générer PDF**: Tester le téléchargement PDF

### 7.3 Vérifier MongoDB
1. Aller sur MongoDB Atlas
2. "Browse Collections"
3. Vérifier que les données sont là

---

## 🔄 ÉTAPE 8: Mettre à Jour l'Application

Quand tu fais des changements:

```bash
# 1. Sauvegarder les changements
git add .
git commit -m "Description des changements"

# 2. Pousser sur GitHub
git push

# 3. Vercel redéploie automatiquement! (2-3 minutes)
```

---

## 🎯 ÉTAPE 9: Partager avec ton Boss

### 9.1 Créer un document de présentation
```
URL de l'application: https://reporting-app-xxxxx.vercel.app

Compte Admin:
- Email: admin@intraair.com
- Password: admin

Compte Test (créer un nouveau user):
- Créer via le formulaire d'inscription

Fonctionnalités:
✅ Création de rapports de moisissures
✅ Upload de photos
✅ Génération PDF automatique
✅ Statistiques par bâtiment
✅ Dashboard admin
✅ Multi-langue (EN/FR/NL)
```

### 9.2 Créer un compte de démonstration
```bash
# Créer un user de démo pour ton boss
Email: demo@company.com
Password: Demo123!
```

---

## 💰 Coûts (Tout est GRATUIT!)

### Vercel (Hobby Plan - Gratuit)
- ✅ Bande passante: 100GB/mois
- ✅ Builds: Illimités
- ✅ Domaine: .vercel.app gratuit
- ✅ SSL: Inclus

### MongoDB Atlas (Free Tier)
- ✅ 512MB de stockage
- ✅ Connexions illimitées
- ✅ Backup automatique

### Cloudinary (Free Tier)
- ✅ 25GB de stockage
- ✅ 25GB de bande passante/mois
- ✅ Transformations d'images

**Total: 0€/mois** 🎉

---

## 🆘 Problèmes Courants

### Problème 1: "Cannot connect to MongoDB"
**Solution**: Vérifier que l'IP `0.0.0.0/0` est autorisée dans MongoDB Atlas

### Problème 2: "Environment variables not found"
**Solution**: Vérifier que toutes les variables sont dans Vercel → Settings → Environment Variables

### Problème 3: "Build failed"
**Solution**: Vérifier les logs dans Vercel → Deployments → Cliquer sur le déploiement → Logs

### Problème 4: "Photos ne s'uploadent pas"
**Solution**: Vérifier les credentials Cloudinary dans les variables d'environnement

---

## 📞 Support

Si tu as des problèmes:
1. Vérifier les logs Vercel
2. Vérifier MongoDB Atlas → Metrics
3. Vérifier Cloudinary → Dashboard

---

## 🎓 Résumé des Comptes à Créer

1. ✅ GitHub (gratuit) - Pour le code
2. ✅ Vercel (gratuit) - Pour l'hébergement
3. ✅ MongoDB Atlas (déjà fait) - Pour la base de données
4. ✅ Cloudinary (gratuit) - Pour les photos

**Temps total: 30-45 minutes**

---

## 🚀 Commandes Rapides

```bash
# Déployer une mise à jour
git add .
git commit -m "Update"
git push

# Voir les logs en temps réel
vercel logs

# Redéployer manuellement
vercel --prod
```

---

Bonne chance avec le déploiement! 🎉
