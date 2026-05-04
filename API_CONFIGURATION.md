# API Configuration Summary

## Frontend API URLs

Tous les fichiers frontend utilisent maintenant la configuration suivante:

```javascript
const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5002/api';
```

### Fichiers configurés:
1. ✅ `frontend/src/services/api.js` - Configuration centrale pour axios
2. ✅ `frontend/src/pages/CreateMouldReport.js` - Upload de photos
3. ✅ `frontend/src/pages/AdminDashboard.js` - Admin API calls

## Backend CORS Configuration

Le backend accepte les requêtes depuis:
- **Production**: Tous les domaines `*.vercel.app`
- **Development**: `http://localhost:3000`

Fichier: `backend/server.js`
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://reporting-app-eta.vercel.app', /\.vercel\.app$/]
    : 'http://localhost:3000',
  credentials: true
}));
```

## Environment Variables (Vercel)

Variables configurées dans Vercel → Settings → Environment Variables:

1. `MONGODB_URI` - Connection string MongoDB Atlas
2. `JWT_SECRET` - Secret pour les tokens JWT
3. `NODE_ENV` = `production`
4. `PORT` = `5002`
5. `CLOUDINARY_CLOUD_NAME` - Nom du cloud Cloudinary
6. `CLOUDINARY_API_KEY` - Clé API Cloudinary
7. `CLOUDINARY_API_SECRET` - Secret API Cloudinary

## URLs de Production

- **Frontend**: https://reporting-app-eta.vercel.app
- **API**: https://reporting-app-eta.vercel.app/api
- **Health Check**: https://reporting-app-eta.vercel.app/api/health

## URLs de Développement

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5002
- **API**: http://localhost:5002/api

## Résumé des Corrections

✅ Tous les appels API utilisent des URLs relatives en production (`/api`)
✅ CORS configuré pour accepter tous les domaines Vercel
✅ MongoDB avec reconnexion automatique
✅ Variables d'environnement correctement configurées
✅ Upload de fichiers configuré (local en dev, Cloudinary en prod)
