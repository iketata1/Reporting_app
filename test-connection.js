const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('Testing MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✓ MongoDB connected successfully!');
  process.exit(0);
})
.catch(err => {
  console.error('✗ MongoDB connection failed:', err.message);
  console.log('\nTroubleshooting:');
  console.log('1. Make sure MongoDB is running (run "mongod" in a terminal)');
  console.log('2. Check if the URI in .env is correct');
  console.log('3. Try using MongoDB Atlas (cloud) if local MongoDB is not available');
  process.exit(1);
});
