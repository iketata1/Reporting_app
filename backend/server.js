const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/mongodb');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://reporting-app-eta.vercel.app', /\.vercel\.app$/]
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

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Serve uploaded files (Cloudinary in production)
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static('D:/Reporting_app_uploads'));
}

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/reports', require('./routes/reports'));
app.use('/users', require('./routes/users'));
app.use('/upload', (req, res, next) => {
  console.log('Upload route hit:', req.method, req.path);
  next();
}, require('./routes/upload'));
app.use('/admin', require('./routes/admin'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
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

// Start server only in development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
