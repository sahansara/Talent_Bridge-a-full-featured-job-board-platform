// routes/SK_profileRoutes.js
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Set up file uploads storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Create separate folders for profile images and CVs
    if (file.fieldname === 'profileImage') {
      uploadPath += 'profile-images/';
    } else if (file.fieldname === 'cv') {
      uploadPath += 'cvs/';
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const userId = req.user.userId;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${userId}-${Date.now()}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profileImage') {
      // Only allow images
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false);
      }
    } else if (file.fieldname === 'cv') {
      // Only allow PDFs
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed'), false);
      }
    }
    cb(null, true);
  }
});

// GET /api/users/profile - Get user profile data
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const collection = db.collection('seek_employees');

    
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Format the response to match frontend expectations
    const profileData = {
      username: user.fullName || '',
      email: user.email || '',
      profileImage: user.image ? `${user.image}` : '/api/placeholder/400/400',
      cvFilename: user.cv_Upload ? path.basename(user.cv_Upload) : ''
    };
    
    res.status(200).json(profileData);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to load profile data' });
  }
});

// PUT /api/users/profile - Update user profile data
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email } = req.body;
    const db = req.app.locals.db;
    const collection = db.collection('seek_employees');
    
    // Check if email is already in use by another user
    if (email) {
      const existingUser = await collection.findOne({ 
        email, 
        _id: { $ne: new ObjectId(userId) } 
      });
      
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use by another account' });
      }
    }
    
    // Update user profile
    const updateData = {};
    if (username) updateData.fullName = username;
    if (email) updateData.email = email;
    
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// PUT /api/users/profile/change-password - Change user password
router.put('/profile/change-password', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    const db = req.app.locals.db;
    const collection = db.collection('seek_employees');
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    // Find user
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: hashedPassword } }
    );
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// POST /api/users/profile/upload-image - Upload profile image
router.post('/profile/upload-image', upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;
    const collection = db.collection('seek_employees');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    
    // Get user to check for existing image
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    
    // Delete old image if exists
    if (user && user.image) {
      try {
        fs.unlinkSync(user.image);
      } catch (err) {
        console.error('Error deleting old image:', err);
        // Continue even if old file deletion fails
      }
    }
    
    // Update user with new image path
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { image: req.file.path } }
    );
    
    res.status(200).json({ 
      message: 'Profile image uploaded successfully',
      profileImage: `/${req.file.path}`
    });
  } catch (err) {
    console.error('Error uploading profile image:', err);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// POST /api/users/profile/upload-cv - Upload CV document
router.post('/profile/upload-cv', upload.single('cv'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;
    const collection = db.collection('seek_employees');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No CV file uploaded' });
    }
    
    // Get user to check for existing CV
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    
    // Delete old CV if exists
    if (user && user.cv_Upload) {
      try {
        fs.unlinkSync(user.cv_Upload);
      } catch (err) {
        console.error('Error deleting old CV:', err);
        // Continue even if old file deletion fails
      }
    }
    
    // Update user with new CV path
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cv_Upload: req.file.path } }
    );
    
    res.status(200).json({ 
      message: 'CV uploaded successfully',
      cvFilename: path.basename(req.file.path)
    });
  } catch (err) {
    console.error('Error uploading CV:', err);
    res.status(500).json({ error: 'Failed to upload CV' });
  }
});

module.exports = router;