// Vercel Serverless Function wrapper for Express backend
const app = require('../backend/server');

// Export the Express app as a serverless function
module.exports = (req, res) => {
  // Remove /api prefix from the path for Express routing
  req.url = req.url.replace(/^\/api/, '');
  
  // If the URL is empty after removing /api, set it to /
  if (!req.url || req.url === '') {
    req.url = '/';
  }
  
  return app(req, res);
};

