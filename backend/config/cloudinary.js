const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage pour Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reporting-app-uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
    transformation: [{ width: 1500, height: 1500, crop: 'limit', quality: 'auto' }]
  }
});

module.exports = { cloudinary, storage };
