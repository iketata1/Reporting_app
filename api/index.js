// Vercel Serverless Function wrapper for Express backend
const app = require('../backend/server');

// Export the Express app as a serverless function
module.exports = async (req, res) => {
  try {
    // Log incoming request
    console.log('Serverless function called:', req.method, req.url);
    console.log('Environment check:', {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    });
    
    // Remove /api prefix from the path for Express routing
    const originalUrl = req.url;
    req.url = req.url.replace(/^\/api/, '');
    
    // If the URL is empty after removing /api, set it to /
    if (!req.url || req.url === '') {
      req.url = '/';
    }
    
    console.log('Routing from', originalUrl, 'to', req.url);
    
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      message: 'Serverless function error', 
      error: error.message 
    });
  }
};

