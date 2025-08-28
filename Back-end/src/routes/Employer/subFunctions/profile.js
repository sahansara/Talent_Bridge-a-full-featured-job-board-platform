const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { COLLECTIONS } = require('../../../config/constants');
const {updateUserProfile, fetchUserById} = require('../../shared/commonFuncions');

function getUserCollection(db) {
  return db.collection(COLLECTIONS.ROLE.EMPLOYER);
}


function formatProfileData(user) {
  return {
      employerName: user.employerName || '',
      email: user.email || '',
      employerImage: user.image ? `${user.image}` : '/api/placeholder/400/400',
      comDescription: user.comDescription || '',
      contactNumber: user.contactNumber || '',
      employerWebsite: user.employerWebsite || '',
  };
}


function buildProfileUpdateData(employerName, email, comDescription, contactNumber, employerWebsite) {
  const updateData = {};
      if (employerName) updateData.employerName = employerName;
      if (email) updateData.email = email;
      if (comDescription) updateData.comDescription = comDescription;
      if (contactNumber) updateData.contactNumber = contactNumber;
      if (employerWebsite) updateData.employerWebsite = employerWebsite;
  return updateData;
}

function ensureUploadDirectory(uploadPath) {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
}

function createUploadStorage() {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = 'uploads/';
      
      // Create separate folders for profile images and CVs
      if (file.fieldname === 'companyImage') {
        uploadPath += 'company-images/';
      }
      
      
      // Create directory if it doesn't exist
      ensureUploadDirectory(uploadPath);
      
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const userId = req.user.userId;
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${userId}-${Date.now()}${ext}`);
    }
  });
}

function fileFilter(req, file, cb) {
  if (file.fieldname === 'companyImage') {
    // Only allow images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
  
  }
  cb(null, true);
}

function createUploadMiddleware() {
  return multer({ 
    storage: createUploadStorage(),
    fileFilter: fileFilter
  });
}

function deleteOldFile(filePath, fileType = 'file') {
  if (filePath) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error deleting old ${fileType}:`, err);
      // Continue even if old file deletion fails
    }
  }
}

async function handleFileUploadAndUpdate(collection, userId, file, fieldName, fileType) {
  if (!file) {
    throw new Error(`No ${fileType} file uploaded`);
  }
  
  // Get user to check for existing file
  const user = await fetchUserById(collection, userId);
  
  // Delete old file if exists
  if (user && user[fieldName]) {
    deleteOldFile(user[fieldName], fileType);
  }
  
  // Update user with new file path
  const updateData = { [fieldName]: file.path };
  await updateUserProfile(collection, userId, updateData);
  
  return {
    message: `${fileType} uploaded successfully`,
    filePath: `/${file.path}`,
    fileName: path.basename(file.path)
  };
}

function validateFileUpload(file, res, fileType) {
  if (!file) {
    res.status(400).json({ error: `No ${fileType} file uploaded` });
    return false;
  }
  return true;
}

module.exports = {
  getUserCollection,
  formatProfileData,
  ensureUploadDirectory,
  createUploadStorage,
  fileFilter,
  createUploadMiddleware,
  deleteOldFile,
  handleFileUploadAndUpdate,
  buildProfileUpdateData,
  validateFileUpload
};