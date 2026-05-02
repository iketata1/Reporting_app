# Guide de Démarrage - Reporting Application

## Prérequis
1. Node.js installé (v14 ou supérieur)
2. MongoDB installé et en cours d'exécution

## Installation

### 1. Installer MongoDB (si pas déjà installé)
- Windows: Télécharger depuis https://www.mongodb.com/try/download/community
- Ou utiliser MongoDB Atlas (cloud gratuit)

### 2. Démarrer MongoDB
```bash
# Windows - Ouvrir un terminal et exécuter:
mongod

# Ou si MongoDB est installé comme service, il démarre automatiquement
```

### 3. Installer les dépendances
```bash
# À la racine du projet
npm install

# Installer les dépendances du frontend
cd frontend
npm install
cd ..
```

## Démarrage

### Option 1: Démarrage manuel (2 terminaux)

**Terminal 1 - Backend:**
```bash
npm run dev
```
Vous devriez voir: "Server running on http://localhost:5000"

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Le navigateur s'ouvrira automatiquement sur http://localhost:3000

### Option 2: Si MongoDB n'est pas disponible localement

Modifiez le fichier `.env` à la racine:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reporting_app
```

## Test de Connexion

1. Ouvrez http://localhost:3000
2. Cliquez sur "Register" 
3. Remplissez le formulaire:
   - First Name: Test
   - Last Name: User
   - Department: IT
   - Email: test@example.com
   - Password: password123
4. Cliquez sur "Register"

## Vérification des Erreurs

### Si "Cannot connect to server":
- Vérifiez que le backend tourne sur le port 5000
- Ouvrez http://localhost:5000/health dans votre navigateur
- Vous devriez voir: {"status":"OK","message":"Server is running"}

### Si "MongoDB connection error":
- Vérifiez que MongoDB est démarré
- Vérifiez l'URI dans le fichier .env

### Si "Invalid credentials":
- Utilisez d'abord "Register" pour créer un compte
- Puis utilisez "Login" avec les mêmes identifiants

## Ports utilisés
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- MongoDB: mongodb://localhost:27017
