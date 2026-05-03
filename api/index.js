// Vercel Serverless Function wrapper for Express backend
const app = require('../backend/server');

// Export the Express app as a serverless function
module.exports = async (req, res) => {
  // Log incoming request
  console.log('Serverless function called:', req.method, req.url);
  
  // Remove /api prefix from the path for Express routing
  const originalUrl = req.url;
  req.url = req.url.replace(/^\/api/, '');
  
  // If the URL is empty after removing /api, set it to /
  if (!req.url || req.url === '') {
    req.url = '/';
  }
  
  console.log('Routing from', originalUrl, 'to', req.url);
  
  return app(req, res);
};

