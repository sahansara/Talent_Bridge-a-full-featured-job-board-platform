const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Import routes
const SK_profileRoutes = require('./routes/SK_profileRoutes');
const Login_register = require('./routes/Employer/Login_register');
const Em_dashboard = require('./routes/Employer/Em_dashboard');
const Em_profile = require('./routes/Employer/Em_profile');
const register_dashboard = require('./routes/Admin/register_dashboard');
const Manage_jobpost = require('./routes/Admin/Manage_jobpost');
const Job_Post = require('./routes/Job_seeker/Job_post');
const Em_applications = require('./routes/Employer/Em_applications');
const Manage_jobSeeker = require('./routes/Admin/Manage_jobSeeker');
const Manage_Employers = require('./routes/Admin/Manage_Employers');


const app = express();
const port = 3000;
const JWT_SECRET = 'VZJqCdrVHoo7vEOEm3l41HePGd1L1usf'; // Change this to a strong secret in production

// Configure middleware before routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Add your frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Parse JSON in request body
app.use(bodyParser.json());
// Parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files from uploads directory
// Serve static files from uploads directory
app.use('/uploads', express.static(
  path.join(__dirname, 'uploads'), 
  {
    setHeaders: (res, path) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
  }
));


// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// MongoDB setup
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'talent_Bridge';

let collection;
let Companycollection;
let admincollection; // Add this line to create the collection variable
let notificationsCollection;
async function main() {
  await client.connect();
  console.log('✅ Connected to MongoDB');
  const db = client.db(dbName);
  collection = db.collection('seek_employees');
  Companycollection = db.collection('Companies'); // Add this line to create the collection variable
  admincollection = db.collection('Admins'); // Add this line to create the collection variable
  notificationsCollection = db.collection('notifications');

  
  // Add this line to make the db connection available to routes
  app.locals.db = db;

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

main().catch(console.error);

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const ensureDbConnected = (req, res, next) => {
  if (!app.locals.db) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  next();
};


// Authentication middleware
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

// ✅ Registration route
app.post('/', upload.fields([
  { name: 'cv_Upload', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    
    // Check if required fields exist
    if (!req.body || !req.body.fullName || !req.body.email || !req.body.password) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    const { fullName, email, password ,role} = req.body;
    
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    
    // Check if email already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const cvPath = req.files && req.files['cv_Upload'] ? req.files['cv_Upload'][0].path : null;
    const imagePath = req.files && req.files['image'] ? req.files['image'][0].path : null;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
     // Set default role to jobseeker if none provided
     const userRole = role || 'jobseeker';

    const userData = {
      fullName,
      email,
      role: userRole,
      password: hashedPassword,
      cv_Upload: cvPath,
      image: imagePath,
      createdAt: new Date()
    };

    const result = await collection.insertOne(userData);
    res.status(201).json({ message: 'User registered successfully', result });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    console.log(`Login attempt for: ${email}`);

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    let user = null;
    let role = null;

    // 1. Check in Job Seekers
    user = await collection.findOne({ email });
    if (user) {
      console.log(`User found in job seekers collection: ${user._id}`);
      role = user.role || 'jobseeker';
    }

    // 2. Check in Employers
    if (!user) {
      user = await Companycollection.findOne({ email });
      if (user) {
        console.log(`User found in employers collection: ${user._id}`);
        role = user.role || 'Company';
      }
    }
     // 2. Check in admins
     if (!user) {
      user = await admincollection.findOne({ email });
      if (user) {
        console.log(`admin User found in employers collection: ${user._id}`);
        role = user.role || 'Admin';
      }
    }

    // User not found in any collection
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Password check
    console.log(`Comparing password for user: ${user._id}`);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password valid: ${isPasswordValid}`);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 6. JWT Token creation
    const expiresIn = remember ? '30d' : '24h';

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: role
      },
      JWT_SECRET,
      { expiresIn }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      role,
      expiresIn,
      user: {
        fullName: user.fullName || user.companyName || user.Adminfullname,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Get user profile route
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data without password
    const userData = {
      fullName: user.fullName,
      role: user.role,
      image: user.image ? user.image : null,
      
    };
    
    res.status(200).json(userData);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// ✅ Logout route
app.post('/jobseeker/logout', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});



// API company routes
app.use('/api/users', ensureDbConnected,authenticateToken, SK_profileRoutes);
app.use('/api/Company', ensureDbConnected,Login_register);
app.use('/api/Company', ensureDbConnected,authenticateToken, Em_dashboard);
app.use('/api/Company/Employer', ensureDbConnected,authenticateToken, Em_profile);
app.use('/api/job-seeker', ensureDbConnected, authenticateToken, Job_Post);
app.use('/api/Company', ensureDbConnected, authenticateToken, Em_applications);


// Admin routes
app.use('/api/admin', ensureDbConnected,register_dashboard);
app.use('/api/admin', ensureDbConnected, authenticateToken, Manage_jobpost);
app.use('/api/admin', ensureDbConnected, authenticateToken, Manage_jobSeeker);
app.use('/api/admin', ensureDbConnected, authenticateToken, Manage_Employers);




// Test route to check if the server is running and body-parser is working
app.post('/test', (req, res) => {
  console.log('Test request body:', req.body);
  res.status(200).json({ 
    message: 'Test successful', 
    receivedData: req.body 
  });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});