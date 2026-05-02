const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@intraair.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email: admin@intraair.com');
      console.log('Password: admin');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@intraair.com',
      password: 'admin',
      role: 'admin',
      department: 'Administration',
      position: 'System Administrator',
      isActive: true
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@intraair.com');
    console.log('Password: admin');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
