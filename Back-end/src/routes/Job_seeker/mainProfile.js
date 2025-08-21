// profileRoutes.js - User Profile API routes
const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Import helper functions
const {
  getUserCollection,
  formatProfileData,
  buildProfileUpdateData,
  createUploadMiddleware,
  handleFileUploadAndUpdate,
} = require('./subFunctions/profile'); 

const {
    validateDatabaseConnection,
    handleError,
    fetchUserById,
    isEmailAlreadyInUse,
    updateUserProfile,
    validatePasswordChangeInput,
    isValidPasswordFormat,
    verifyCurrentPassword,
    hashNewPassword,
    updateUserPassword,
    validateFileUpload,
} = require('../shared/commonFuncions');

// Configure file upload middleware
const upload = createUploadMiddleware();

// GET /api/users/profile - Get user profile data
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;
    
    // Validate database connection
    if (!validateDatabaseConnection(db, res)) return;
    
    const collection = getUserCollection(db);
    
    // Fetch user by ID
    const user = await fetchUserById(collection, userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Format profile data for frontend
    const profileData = formatProfileData(user);
    
    res.status(200).json(profileData);
  } catch (err) {
    handleError(res, err, 'load profile data');
  }
});

// PUT /api/users/profile - Update user profile data
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email } = req.body;
    const db = req.app.locals.db;
    const collection = getUserCollection(db);
    
    // Check if email is already in use by another user
    const emailInUse = await isEmailAlreadyInUse(collection, email, userId);
    if (emailInUse) {
      return res.status(409).json({ error: 'Email already in use by another account' });
    }
    
    // Build update data
    const updateData = buildProfileUpdateData(username, email);
    
    // Update user profile
    const result = await updateUserProfile(collection, userId, updateData);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    handleError(res, err, 'update profile');
  }
});

// PUT /api/users/profile/change-password - Change user password
router.put('/profile/change-password', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    const db = req.app.locals.db;
    const collection = getUserCollection(db);
    
    // Validate input
    if (!validatePasswordChangeInput(currentPassword, newPassword, res)) return;

    // Check if new password meets strength requirements
    if (! isValidPasswordFormat(currentPassword, newPassword, res)) return;
    
    // Find user
    const user = await fetchUserById(collection, userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await verifyCurrentPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await hashNewPassword(newPassword);
    
    // Update password
    await updateUserPassword(collection, userId, hashedPassword);
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    handleError(res, err, 'update password');
  }
});

// POST /api/users/profile/upload-image - Upload profile image
router.post('/profile/upload-image', upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;
    const collection = getUserCollection(db);
    
    // Validate file upload
    if (!validateFileUpload(req.file, res, 'image')) return;
    
    // Handle file upload and update user record
    const result = await handleFileUploadAndUpdate(
      collection, 
      userId, 
      req.file, 
      'image', 
      'Profile image'
    );
    
    res.status(200).json({ 
      message: result.message,
      profileImage: result.filePath
    });
  } catch (err) {
    handleError(res, err, 'upload profile image');
  }
});

// POST /api/users/profile/upload-cv - Upload CV document
router.post('/profile/upload-cv', upload.single('cv'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = req.app.locals.db;
    const collection = getUserCollection(db);
    
    // Validate file upload
    if (!validateFileUpload(req.file, res, 'CV')) return;
    
    // Handle file upload and update user record
    const result = await handleFileUploadAndUpdate(
      collection, 
      userId, 
      req.file, 
      'cv_Upload', 
      'CV'
    );
    
    res.status(200).json({ 
      message: result.message,
      cvFilename: result.fileName
    });
  } catch (err) {
    handleError(res, err, 'upload CV');
  }
});

module.exports = router;