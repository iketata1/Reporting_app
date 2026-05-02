const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

module.exports = router;
