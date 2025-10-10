const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
// Example for Express.js backend


// Import configurations
const { databaseConnection } = require('./src/config/database');
const { getCorsOptions } = require('./src/config/cors');
const { uploadMiddlewares, ensureUploadDirectories, handleUploadError } = require('./src/config/multer');
const { ENV } = require('./src/config/constants');
require("dotenv").config();

// Import middleware
const { ensureDbConnected, authenticateToken } = require('./src/middleware/auth');
const { 
  authenticateToken: authenticateAdminToken, 
  requireAdmin, 
  adminAuth, 
  adminRateLimit, 
   
} = require('./src/middleware/adminAuth');

// Import route modules
const authRoutes = require('./src/routes/auth/authRoutes');


const register = require('./src/routes/Job_seeker/register');
const mainProfile = require('./src/routes/Job_seeker/mainProfile');
const Login_register = require('./src/routes/Employer/register');
const jobPosts = require('./src/routes/Employer/jobPosts');
const EM_mainProfile = require('./src/routes/Employer/mainProfile');
const register_dashboard = require('./src/routes/Admin/register_dashboard');
const Manage_jobpost = require('./src/routes/Admin/Manage_jobpost');
const Job_Post = require('./src/routes/Job_seeker/Job_post');
const applications = require('./src/routes/Employer/applications.js');
const Manage_jobSeeker = require('./src/routes/Admin/Manage_jobSeeker');
const Manage_Employers = require('./src/routes/Admin/Manage_Employers');
const notifications = require('./src/routes/Job_seeker/notifications');
const feedback = require('./src/routes/feedback/feedback');
const EM_NOTIFICATIONS =require('./src/routes/Employer/notifications')
const ADNOTIFICATION  = require('./src/routes/Admin/notification.js')
const chatbotRoutes = require("./src/routes/Chatbot/chatbot");

const app = express();
const port = ENV.PORT;

// Ensure upload directories exist
ensureUploadDirectories();

// CORS configuration
app.use(cors(getCorsOptions()));

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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


app.use(handleUploadError);

// Database connection and server startup
async function main() {
  try {
    
    const { db, collections } = await databaseConnection.connect();
    
    
    app.locals.db = db;
    app.locals.collections = collections;

    
    mountRoutes();

    
    app.listen(port, () => {
      
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

function mountRoutes() {
  // Health check route
  app.get('/api/test', (req, res) => {
    res.json({ success: true, message: "Backend is working!" });
  });

  // Public authentication routes
  app.use('/api', authRoutes);
  
  // PUBLIC ROUTES 
  
  app.use('/api/job-seeker', register);
  
  // Company/Employer registration 
  app.use('/api/company', Login_register);
  
  // Admin registration 
  app.use('/api/admin', ensureDbConnected, register_dashboard);
  // Feedback route 
  app.use('/api/feedback', ensureDbConnected, feedback);
  // Chatbot route
  app.use("/api/chatbot", chatbotRoutes);
  
  // Job Seeker protected routes
  app.use('/api/users', ensureDbConnected, authenticateToken, mainProfile);
  app.use('/api/job-seeker', ensureDbConnected, authenticateToken, Job_Post);
  app.use('/api/job-seeker', ensureDbConnected, authenticateToken, notifications);
  
  // Company/Employer protected routes
  app.use('/api/Company', ensureDbConnected, authenticateToken, jobPosts);
  app.use('/api/Company', ensureDbConnected, authenticateToken, EM_mainProfile);
  app.use('/api/Company', ensureDbConnected, authenticateToken, applications);
  app.use('/api/Company', ensureDbConnected, authenticateToken, EM_NOTIFICATIONS);

  // ADMIN PROTECTED ROUTES (Admin authentication + authorization required)
  
  app.use('/api/admin', adminRateLimit);
  
  // Admin protected routes with full admin authentication chain
  app.use('/api/admin', ensureDbConnected, authenticateAdminToken, requireAdmin,  Manage_jobpost);
  
  app.use('/api/admin',ensureDbConnected,authenticateAdminToken,requireAdmin, Manage_jobSeeker);
  
  app.use('/api/admin', ensureDbConnected, authenticateAdminToken, requireAdmin,    Manage_Employers);

  app.use('/api/admin', ensureDbConnected, authenticateAdminToken, requireAdmin,  ADNOTIFICATION);

  

  // Catch-all for undefined routes
  app.use((req, res) => {
    res.status(404).json({ 
      success: false,
      error: 'Route not found',
      code: 'ROUTE_NOT_FOUND'
    });
  });
}

main().catch(console.error);

module.exports = app;