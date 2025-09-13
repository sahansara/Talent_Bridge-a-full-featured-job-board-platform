express = require('express');
const bcrypt = require('bcryptjs');
const { uploadMiddlewares } = require('../../config/multer');
const { isValidEmail, validateRequiredFields } = require('../../utils/validation');
const { STATUS_CODES, MESSAGES, USER_ROLES, SECURITY } = require('../../config/constants');

const router = express.Router();


router.post('/register', uploadMiddlewares.jobSeekerFiles, async (req, res) => {
  try {
   
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'password'];
    const validation = validateRequiredFields(req.body, requiredFields);
    
    if (!validation.isValid) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ 
        error: validation.message 
      });
    }
    
    const { fullName, email, password, role } = req.body;
    const { seekEmployees } = req.app.locals.collections;
    
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ 
        error: MESSAGES.ERROR.INVALID_EMAIL 
      });
    }
    
    // Check if email already exists 
    const existingUser = await seekEmployees.findOne({ email });
    if (existingUser) {
      return res.status(STATUS_CODES.CONFLICT).json({ 
        error: MESSAGES.ERROR.EMAIL_EXISTS 
      });
    }

    // Handle file uploads
    const cvPath = req.files && req.files['cv_Upload'] ? req.files['cv_Upload'][0].path : null;
    const imagePath = req.files && req.files['image'] ? req.files['image'][0].path : null;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SECURITY.BCRYPT_SALT_ROUNDS);
    
    
    const userRole = role || USER_ROLES.JOB_SEEKER;

    // Create user data object
    const userData = {
      fullName,
      email,
      role: userRole,
      password: hashedPassword,
      cv_Upload: cvPath,
      image: imagePath,
      createdAt: new Date()
    };

    // Insert user into 
    const result = await seekEmployees.insertOne(userData);
    
   
    
    res.status(STATUS_CODES.CREATED).json({ 
      message: MESSAGES.SUCCESS.USER_REGISTERED, 
      userId: result.insertedId,
      userData: {
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt
      }
    });
    
  } catch (err) {
    console.error('Job Seeker registration error:', err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
      error: MESSAGES.ERROR.INTERNAL_ERROR 
    });
  }
});

module.exports = router;