const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { COLLECTIONS } = require('../../../config/constants');
const { isValidPassword } = require('../../../utils/validation');
const {fetchUserById,updateUserProfile} = require('../../shared/commonFuncions')

function getUserCollection(db) {
  return db.collection(COLLECTIONS.ROLE.JOB_SEEKER);
}

function formatProfileData(user) {
  return {
    username: user.fullName || '',
    email: user.email || '',
    profileImage: user.image ? `${user.image}` : null,
    cvFilename: user.cv_Upload ? path.basename(user.cv_Upload) : ''
  };
}

function buildProfileUpdateData(username, email) {
  const updateData = {};
  if (username) updateData.fullName = username;
  if (email) updateData.email = email;
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
      if (file.fieldname === 'profileImage') {
        uploadPath += 'profile-images/';
      } else if (file.fieldname === 'cv') {
        uploadPath += 'cvs/';
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



module.exports = {
  getUserCollection,
  formatProfileData,
  buildProfileUpdateData,
  ensureUploadDirectory,
  createUploadStorage,
  fileFilter,
  createUploadMiddleware,
  deleteOldFile,
  handleFileUploadAndUpdate,
  
};