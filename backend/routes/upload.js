const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
if (process.env.NODE_ENV === 'production') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// PRODUCTION FIX: Do not create local directories in serverless environment
// Uploads directory (only used in development)
const uploadsDir = 'D:/Reporting_app_uploads';

// Only create directory in development environment - NEVER in production
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory for development');
  } catch (err) {
    console.log('Could not create uploads directory:', err.message);
  }
}

// Configure multer for memory storage in production, disk storage in development
const storage = process.env.NODE_ENV === 'production'
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadsDir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'reporting_app',
        public_id: filename,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Upload single photo
router.post('/photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let fileData;
    
    if (process.env.NODE_ENV === 'production') {
      // Upload to Cloudinary in production
      const result = await uploadToCloudinary(req.file.buffer, `photo-${Date.now()}`);
      fileData = {
        fileName: result.public_id,
        fileUrl: result.secure_url,
        originalName: req.file.originalname,
        size: req.file.size
      };
    } else {
      // Use local file system in development
      fileData = {
        fileName: req.file.filename,
        fileUrl: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname,
        size: req.file.size
      };
    }

    res.json({
      message: 'File uploaded successfully',
      file: fileData
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// Upload multiple photos
router.post('/photos', upload.array('photos', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    let files;

    if (process.env.NODE_ENV === 'production') {
      // Upload to Cloudinary in production
      const uploadPromises = req.files.map((file, index) => 
        uploadToCloudinary(file.buffer, `photo-${Date.now()}-${index}`)
      );
      const results = await Promise.all(uploadPromises);
      
      files = results.map((result, index) => ({
        fileName: result.public_id,
        fileUrl: result.secure_url,
        originalName: req.files[index].originalname,
        size: req.files[index].size
      }));
    } else {
      // Use local file system in development
      files = req.files.map(file => ({
        fileName: file.filename,
        fileUrl: `/uploads/${file.filename}`,
        originalName: file.originalname,
        size: file.size
      }));
    }

    res.json({
      message: 'Files uploaded successfully',
      files: files
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

// Delete photo
router.delete('/photo/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;

    if (process.env.NODE_ENV === 'production') {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(filename);
      res.json({ message: 'File deleted successfully' });
    } else {
      // Delete from local file system
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ message: 'File deleted successfully' });
      } else {
        res.status(404).json({ message: 'File not found' });
      }
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});

module.exports = router;
