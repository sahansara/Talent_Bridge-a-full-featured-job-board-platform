const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, authenticateToken } = require('../../middleware/auth');
const { isValidEmail } = require('../../utils/validation');
const { STATUS_CODES, MESSAGES, USER_ROLES, SECURITY } = require('../../config/constants');

const router = express.Router();


// Verify token endpoint
router.get('/auth/verify', authenticateToken, async (req, res) => {
  try {
    // If we reach here, the token is valid (authenticateToken middleware passed)
    const { db,collections } = req.app.locals;
    const { ObjectId } = require('mongodb');
    
    // Get user details from database based on the token user info
    let user = null;
    let userCollection = null;

    // Check which collection the user belongs to based on role
    switch (req.user.role) {
      case 'jobseeker':
        userCollection = collections.seek_employees || db.collection('seek_employees'); 
        break;
      case 'employer':
        userCollection = collections.Companies || db.collection('Companies');
        break;
      case 'Admin':
        userCollection = collections.admins || db.collection('admins');
        break;
      default:
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    
    // Convert userId to ObjectId if it's a string
    let userId;
    try {
      userId = typeof req.user.userId === 'string' 
        ? new ObjectId(req.user.userId) 
        : req.user.userId;
    } catch (err) {
      console.error('Invalid ObjectId:', req.user.userId);
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Find user in appropriate collection
     user = await userCollection.findOne({ _id: userId });

    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove sensitive information
    const { password, ...userWithoutPassword } = user;

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: req.user.role,
        name: user.fullName || user.employerName || user.Adminfullname,
        ...userWithoutPassword
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(STATUS_CODES.INTERNAL_ERROR).json({
      success: false,
      message: MESSAGES.ERROR.INTERNAL_ERROR
    });
  }
});

// ✅ Login route - for all roles (admin, jobseeker, employers)
router.post('/login', async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    console.log(`Login attempt for: ${email}`);

    if (!email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ 
        error: MESSAGES.ERROR.MISSING_FIELDS 
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ 
        error: MESSAGES.ERROR.INVALID_EMAIL 
      });
    }

    const { seekEmployees, companies, admins } = req.app.locals.collections;
    let user = null;
    let role = null;

    // 1. Check in Job Seekers
    user = await seekEmployees.findOne({ email });
    if (user) {
      console.log(`User found in job seekers collection: ${user._id}`);
      role = user.role || USER_ROLES.JOB_SEEKER;
    }

    // 2. Check in Employers
    if (!user) {
      user = await companies.findOne({ email });
      if (user) {
        console.log(`User found in employers collection: ${user._id}`);
        role = user.role || USER_ROLES.employer;
      }
    }

    // 3. Check in Admins
    if (!user) {
      user = await admins.findOne({ email });
      if (user) {
        console.log(`Admin user found in admins collection: ${user._id}`);
        role = user.role || USER_ROLES.ADMIN;
      }
    }

    // User not found in any collection
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
        error: MESSAGES.ERROR.INVALID_CREDENTIALS 
      });
    }

    // Password check
    console.log(`Comparing password for user: ${user._id}`);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password valid: ${isPasswordValid}`);
    
    if (!isPasswordValid) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
        error: MESSAGES.ERROR.INVALID_CREDENTIALS 
      });
    }

    // JWT Token creation
    const expiresIn = remember ? SECURITY.JWT_REMEMBER_EXPIRES_IN : SECURITY.JWT_EXPIRES_IN;

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: role
      },
      JWT_SECRET,
      { expiresIn }
    );

    res.status(STATUS_CODES.SUCCESS).json({
      message: MESSAGES.SUCCESS.USER_LOGGED_IN,
      userId: user._id,
      token,
      role,
      expiresIn,
      user: {
        fullName: user.fullName || user.employerName || user.Adminfullname,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
      error: MESSAGES.ERROR.INTERNAL_ERROR 
    });
  }
});

// ✅ Logout route - for all roles (admin, jobseeker, employers)
router.post('/logout', authenticateToken, (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // Here we just confirm the logout action
    console.log(`User ${req.user.email} with role ${req.user.role} logged out`);
    
    res.status(STATUS_CODES.SUCCESS).json({ 
      message: MESSAGES.SUCCESS.USER_LOGGED_OUT,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
      error: MESSAGES.ERROR.INTERNAL_ERROR 
    });
  }
});

module.exports = router;