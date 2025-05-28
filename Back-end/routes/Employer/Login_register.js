const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// ✅ Create company-images folder if not exists
const uploadDir = 'uploads/company-images/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer config for company images
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
router.post('/employer_register', upload.fields([
  { name: 'companyImage', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Registration request body:', req.body);

    if (!req.body || !req.body.companyName || !req.body.email || !req.body.password || !req.body.comDescription || !req.body.contactNumber) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const { companyName, email, password, comDescription, contactNumber, companyWebsite, role } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    
    if (!isValidPhoneNumber(contactNumber)) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }
    

    const db = req.app.locals.db;
    const Companycollection = db.collection('Companies');
    const existingUser = await Companycollection.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
      // search all collection use one email or not create later S
    }

    const imagePath = req.files?.['companyImage']?.[0]?.path || null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'Company';

    const userData = {
      companyName,
      email,
      role: userRole,
      password: hashedPassword,
      comDescription,
      contactNumber,
      companyWebsite,
      companyImage: imagePath,
      createdAt: new Date()
    };

    const result = await Companycollection.insertOne(userData);
    res.status(201).json({ message: 'User registered successfully', result });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
}); 



module.exports = router;
