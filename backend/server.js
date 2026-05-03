const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://reporting-app-eta.vercel.app', 'https://reporting-app-eta-git-main-iketata1s-projects.vercel.app', /\.vercel\.app$/]
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10,
  minPoolSize: 2
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Retrying connection...');
});

// Serve uploaded files (Cloudinary in production)
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('D:/Reporting_app_uploads'));
}

// Routes (sans préfixe /api car déjà géré par Vercel)
app.use('/auth', require('./routes/auth'));
app.use('/reports', require('./routes/reports'));
app.use('/users', require('./routes/users'));
app.use('/upload', require('./routes/upload'));
app.use('/admin', require('./routes/admin'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5002;

// Only start server if not in Vercel (Vercel uses serverless)
if (process.env.VERCEL !== '1') {
  // En développement, on utilise le préfixe /api
  const devApp = express();
  devApp.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  devApp.use('/api', app);
  
  devApp.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
  });
}

module.exports = app;
