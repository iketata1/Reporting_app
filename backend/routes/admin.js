const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin status', error: error.message });
  }
};

// All routes require authentication and admin role
router.use(auth);
router.use(isAdmin);

// Dashboard stats
router.get('/dashboard-stats', adminController.getDashboardStats);

// Users management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId/reports', adminController.getReportsByUser);
router.patch('/users/:userId/status', adminController.updateUserStatus);
router.delete('/users/:userId', adminController.deleteUser);

// Reports management
router.get('/reports', adminController.getAllReportsAdmin);

module.exports = router;
