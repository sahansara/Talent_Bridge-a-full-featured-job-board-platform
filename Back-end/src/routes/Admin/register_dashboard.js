const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const jwt = require('jsonwebtoken');



// 👇 Middleware moved here from index.js
const JWT_SECRET = 'VZJqCdrVHoo7vEOEm3l41HePGd1L1usf';
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ✅ Create Admin-images folder if not exists
const uploadDir = 'uploads/Admin-images/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer config for employer images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// ✅ Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
// ✅ Phone number validation function
function isValidPhoneNumber(number) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(number);
}


// ✅ Registration route
router.post('/admin_register', upload.fields([
  { name: 'adminImage', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Registration request body:', req.body);

    if (!req.body || !req.body.Adminfullname || !req.body.email || !req.body.password || !req.body.adminDescription || !req.body.contactNumber) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const { Adminfullname, email, password, adminDescription, contactNumber, role } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    
    if (!isValidPhoneNumber(contactNumber)) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }
    

    const db = req.app.locals.db;
    const admincollection = db.collection('Admins');
    const existingUser = await admincollection.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
      // search all collection use one email or not create later S
    }

    const imagePath = req.files?.['adminImage']?.[0]?.path || null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'Admin';

    const userData = {
      Adminfullname,
      email,
      role: userRole,
      password: hashedPassword,
      adminDescription,
      contactNumber,
      adminImage: imagePath,
      createdAt: new Date()
    };

    const result = await admincollection.insertOne(userData);
    res.status(201).json({ message: 'Admin User registered successfully', result });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
}); 



// ✅ Get user profile route
router.get('/profile', authenticateToken,  async (req, res) => {
  try {
    const userId = req.user.userId;

    const db = req.app.locals.db;
    const admincollection = db.collection('Admins');
    const user = await admincollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data without password
    const userData = {
      Adminfullname: user.Adminfullname,
      adminDescription: user.adminDescription,
      role: user.role,  
      adminImage: user.adminImage ? user.adminImage : null,
    };
    res.status(200).json(userData);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// ✅ Logout route
router.post('/logout',authenticateToken,  (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});


module.exports = router;
