/**
 * Simple Multer configuration for CV and Image uploads only
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload directories
const UPLOAD_DIRS = {
  CVS: 'uploads/cvs/',
  PROFILE_IMAGES: 'uploads/profile-images/'
};

// File size limits
const FILE_SIZE_LIMITS = {
  CV: 5 * 1024 * 1024, // 5MB
  IMAGE: 2 * 1024 * 1024 // 2MB
};

// Allowed file types
const ALLOWED_TYPES = {
  CV: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
};

// Allowed extensions
const ALLOWED_EXTENSIONS = {
  CV: ['.pdf', '.doc', '.docx'],
  IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

/**
 * Ensure upload directories exist
 */
function ensureUploadDirectories() {
  Object.values(UPLOAD_DIRS).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
}

/**
 * Generate unique filename
 */
function generateUniqueFilename(file) {
  const timestamp = Date.now();
  const randomSuffix = Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  const baseName = path.basename(file.originalname, ext)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 15);
  
  return `${baseName}_${timestamp}_${randomSuffix}${ext}`;
}

/**
 * File filter for mixed uploads (CV + Image)
 */
function fileFilter(req, file, cb) {
  console.log(`📄 Checking: ${file.originalname} (${file.fieldname})`);
  
  let fileType, allowedTypes, allowedExtensions;
  
  // Determine file type based on field name
  if (file.fieldname === 'cv_Upload' || file.fieldname === 'cv') {
    fileType = 'CV';
    allowedTypes = ALLOWED_TYPES.CV;
    allowedExtensions = ALLOWED_EXTENSIONS.CV;
  } else if (file.fieldname === 'image' || file.fieldname === 'profileImage') {
    fileType = 'IMAGE';
    allowedTypes = ALLOWED_TYPES.IMAGE;
    allowedExtensions = ALLOWED_EXTENSIONS.IMAGE;
  } else {
    return cb(new Error(`Unexpected field: ${file.fieldname}`), false);
  }
  
  // Check MIME type
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error(`Invalid ${fileType} file type. Allowed: ${allowedTypes.join(', ')}`), false);
  }
  
  // Check extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Invalid ${fileType} extension. Allowed: ${allowedExtensions.join(', ')}`), false);
  }
  
  console.log(`✅ ${fileType} file validated: ${file.originalname}`);
  cb(null, true);
}

/**
 * Storage configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDirectories();
    
    // Store in appropriate directory based on field name
    if (file.fieldname === 'cv_Upload') {
      cb(null, UPLOAD_DIRS.CVS);
    } else if (file.fieldname === 'image') {
      cb(null, UPLOAD_DIRS.PROFILE_IMAGES);
    } else {
      cb(new Error(`Invalid field: ${file.fieldname}`));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    
    // Generate filename based on field type
    if (file.fieldname === 'cv_Upload') {
      cb(null, 'cv-' + uniqueSuffix + ext);
    } else if (file.fieldname === 'image') {
      cb(null, 'profileImage-' + uniqueSuffix + ext);
    } else {
      cb(new Error(`Invalid field: ${file.fieldname}`));
    }
  }
});

/**
 * Upload middlewares
 */
const uploadMiddlewares = {
  // Job seeker registration (CV + Profile Image)
  jobSeekerFiles: multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024, files: 2 } // 10MB total, max 2 files
  }).fields([
    { name: 'cv_Upload', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  
  // Single CV upload
  cvUpload: multer({
    storage,
    fileFilter,
    limits: { fileSize: FILE_SIZE_LIMITS.CV }
  }).single('cv'),
  
  // Single image upload  
  imageUpload: multer({
    storage,
    fileFilter,
    limits: { fileSize: FILE_SIZE_LIMITS.IMAGE }
  }).single('image')
};

/**
 * Handle upload errors
 */
function handleUploadError(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
  }
  
  if (error.message) {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
}

/**
 * Clean up files
 */
async function cleanupFiles(files) {
  if (!Array.isArray(files)) files = [files];
  
  for (const filePath of files) {
    try {
      if (filePath && fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`🗑️ Cleaned: ${filePath}`);
      }
    } catch (error) {
      console.error(`❌ Cleanup error: ${filePath}`, error);
    }
  }
}

module.exports = {
  uploadMiddlewares,
  handleUploadError,
  cleanupFiles,
  ensureUploadDirectories
};