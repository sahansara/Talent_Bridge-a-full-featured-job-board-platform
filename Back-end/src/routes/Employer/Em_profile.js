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
  
      // Create separate folders for profile images
      if (file.fieldname === 'companyImage') {
        uploadPath += 'company-images/';
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
      if (file.fieldname === 'companyImage') {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed'), false);
        }
      }
      cb(null, true); // ✅ important to continue if file is valid
    }
  });
  

// 
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ error: 'Database connection not available' });
    }
    
    const employercollection = db.collection('Companies');

    
    const user = await employercollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Format the response to match frontend expectations
    const profileData = {
      employerName: user.employerName || '',
      email: user.email || '',
      employerImage: user.image ? `${user.image}` : '/api/placeholder/400/400',
      comDescription: user.comDescription || '',
      contactNumber: user.contactNumber || '',
      employerWebsite: user.employerWebsite || '',
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
      const { employerName, email, comDescription, contactNumber, employerWebsite } = req.body;
      const db = req.app.locals.db;
      const employercollection = db.collection('Companies');
  
      // Email format validation (simple regex)
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: 'Invalid email format' });
        }
  
        // Check if email is already in use by another user
        const existingUser = await employercollection.findOne({
          email,
          _id: { $ne: new ObjectId(userId) }
        });
  
        if (existingUser) {
          return res.status(409).json({ error: 'Email already in use by another account' });
        }
      }
  
      // Contact number validation - only allow 12 digits
      if (contactNumber) {
        const contactRegex = /^\d{10}$/;
        if (!contactRegex.test(contactNumber)) {
          return res.status(400).json({ error: 'Contact number must be exactly 10 digits' });
        }
      }
  
      // Prepare update data
      const updateData = {};
      if (employerName) updateData.employerName = employerName;
      if (email) updateData.email = email;
      if (comDescription) updateData.comDescription = comDescription;
      if (contactNumber) updateData.contactNumber = contactNumber;
      if (employerWebsite) updateData.employerWebsite = employerWebsite;
  
      const result = await employercollection.updateOne(
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
  

// PUT /api/employer/employer/profile/change-password - Change user password
router.put('/profile/change-password', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    const db = req.app.locals.db;
    const employercollection = db.collection('Companies');

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    // Find user
    const user = await employercollection.findOne({ _id: new ObjectId(userId) });
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
    await employercollection.updateOne(
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
router.post('/profile/upload-image', upload.single('companyImage'), async (req, res) => {
    try {
      const userId = req.user.userId;
      const db = req.app.locals.db;
      const employercollection = db.collection('Companies');
  
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }
  
      // Get user to check for existing image
      const user = await employercollection.findOne({ _id: new ObjectId(userId) });
  
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
      await employercollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { image: req.file.path } }
      );
  
      // Return updated image path
      res.status(200).json({ 
        message: 'Profile image uploaded successfully',
        image: `/${req.file.path}`
      });
    } catch (err) {
      console.error('Error uploading profile image:', err);
      res.status(500).json({ error: 'Failed to upload profile image' });
    }
  });
  

module.exports = router;