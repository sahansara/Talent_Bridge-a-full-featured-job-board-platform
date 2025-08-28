const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Import configurations
const { databaseConnection } = require('./src/config/database');
const { getCorsOptions } = require('./src/config/cors');
const { uploadMiddlewares, ensureUploadDirectories, handleUploadError } = require('./src/config/multer');
const { ENV } = require('./src/config/constants');

// Import middleware
const { ensureDbConnected, authenticateToken } = require('./src/middleware/auth');
const { 
  authenticateToken: authenticateAdminToken, 
  requireAdmin, 
  adminAuth, 
  adminRateLimit, 
  logAdminActions 
} = require('./src/middleware/adminAuth');

// Import route modules
const authRoutes = require('./src/routes/auth/authRoutes');

// Import existing routes
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

// File upload error handling
app.use(handleUploadError);

// Database connection and server startup
async function main() {
  try {
    // Connect to database
    const { db, collections } = await databaseConnection.connect();
    
    // Make database connection available to routes
    app.locals.db = db;
    app.locals.collections = collections;

    // Mount routes after database connection
    mountRoutes();

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`📊 Environment: ${ENV.NODE_ENV}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

function mountRoutes() {
  // Public authentication routes (login for all roles)
  app.use('/api', authRoutes);
  
  // PUBLIC ROUTES (No authentication required)
  
  app.use('/api/job-seeker', register);
  
  // Company/Employer registration - should be public
  app.use('/api/Company', ensureDbConnected, Login_register);
  
  // Admin registration - should be public
  app.use('/api/admin', ensureDbConnected, register_dashboard);
  
  // PROTECTED ROUTES (Authentication required)
  
  // Job Seeker protected routes
  app.use('/api/users', ensureDbConnected, authenticateToken, mainProfile);
  app.use('/api/job-seeker', ensureDbConnected, authenticateToken, Job_Post);
  app.use('/api/job-seeker', ensureDbConnected, authenticateToken, notifications);
  
  // Company/Employer protected routes
  app.use('/api/Company', ensureDbConnected, authenticateToken, jobPosts);
  app.use('/api/Company', ensureDbConnected, authenticateToken, EM_mainProfile);
  app.use('/api/Company', ensureDbConnected, authenticateToken, applications);
  app.use('/api/Company', ensureDbConnected, authenticateToken, notifications);

  // ADMIN PROTECTED ROUTES (Admin authentication + authorization required)
  // Apply rate limiting to all admin routes
  app.use('/api/admin', adminRateLimit);
  
  // Admin protected routes with full admin authentication chain
  app.use('/api/admin', 
    ensureDbConnected, 
    authenticateAdminToken, 
    requireAdmin, 
    logAdminActions, 
    Manage_jobpost
  );
  
  app.use('/api/admin', 
    ensureDbConnected, 
    authenticateAdminToken, 
    requireAdmin, 
    logAdminActions, 
    Manage_jobSeeker
  );
  
  app.use('/api/admin', 
    ensureDbConnected, 
    authenticateAdminToken, 
    requireAdmin, 
    logAdminActions, 
    Manage_Employers
  );

  // Alternative approach using the combined adminAuth middleware
  // You can replace the individual middleware chains above with:
  /*
  app.use('/api/admin', ensureDbConnected, adminAuth, logAdminActions, Manage_jobpost);
  app.use('/api/admin', ensureDbConnected, adminAuth, logAdminActions, Manage_jobSeeker);
  app.use('/api/admin', ensureDbConnected, adminAuth, logAdminActions, Manage_Employers);
  */

  // Test route
  app.post('/test', (req, res) => {
    console.log('Test request body:', req.body);
    res.status(200).json({ 
      message: 'Test successful', 
      receivedData: req.body 
    });
  });

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