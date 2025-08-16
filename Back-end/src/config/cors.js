/**
 * CORS (Cross-Origin Resource Sharing) configuration
 * Centralized CORS setup for the application
 */

// CORS configuration based on environment
const CORS_CONFIG = {
  // Allowed origins - customize based on your frontend URLs
  development: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  
  production: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'https://app.yourdomain.com'
  ],
  
  test: [
    'http://localhost:3000',
    'http://localhost:5173'
  ]
};

/**
 * Get allowed origins based on environment
 * @returns {array} Array of allowed origins
 */
function getAllowedOrigins() {
  const env = process.env.NODE_ENV || 'development';
  
  // Allow additional origins from environment variable
  const envOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];
  
  const configOrigins = CORS_CONFIG[env] || CORS_CONFIG.development;
  
  return [...configOrigins, ...envOrigins];
}

/**
 * Dynamic origin function for CORS
 * @param {string} origin - The origin of the request
 * @param {function} callback - Callback function
 */
function corsOriginHandler(origin, callback) {
  const allowedOrigins = getAllowedOrigins();
  
  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) return callback(null, true);
  
  if (allowedOrigins.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    console.warn(`🚫 CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  }
}

/**
 * CORS options configuration
 */
const corsOptions = {
  origin: corsOriginHandler,
  
  // Allow credentials (cookies, authorization headers)
  credentials: true,
  
  // Allowed HTTP methods
  methods: [
    'GET',
    'POST', 
    'PUT', 
    'DELETE', 
    'OPTIONS',
    'PATCH'
  ],
  
  // Allowed request headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  
  // Headers exposed to the client
  exposedHeaders: [
    'Content-Length',
    'Content-Type',
    'Authorization'
  ],
  
  // How long the browser should cache preflight requests (in seconds)
  maxAge: 86400, // 24 hours
  
  // Handle preflight requests
  preflightContinue: false,
  
  // Provide successful status for preflight requests
  optionsSuccessStatus: 200
};

/**
 * Development CORS options (more permissive)
 */
const corsOptionsDev = {
  ...corsOptions,
  origin: true, // Allow all origins in development
  credentials: true
};

/**
 * Get CORS options based on environment
 * @returns {object} CORS options object
 */
function getCorsOptions() {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'development' || env === 'test') {
    console.log('🔓 Using permissive CORS for development');
    return corsOptionsDev;
  }
  
  console.log('🔒 Using restrictive CORS for production');
  return corsOptions;
}

/**
 * Custom CORS middleware with logging
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
function corsWithLogging(req, res, next) {
  const origin = req.headers.origin || 'No origin';
  const method = req.method;
  
  // Log CORS requests in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🌐 CORS ${method} request from: ${origin}`);
  }
  
  // Apply CORS
  const cors = require('cors');
  const corsMiddleware = cors(getCorsOptions());
  
  corsMiddleware(req, res, (err) => {
    if (err) {
      console.error(`❌ CORS error for ${origin}:`, err.message);
      return res.status(403).json({
        error: 'CORS policy violation',
        message: 'Origin not allowed by CORS policy'
      });
    }
    next();
  });
}

/**
 * Manual CORS headers setter (alternative to cors package)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
function setManualCorsHeaders(req, res, next) {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  
  // Check if origin is allowed
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control,X-File-Name');
  res.header('Access-Control-Expose-Headers', 'Content-Length,Content-Type,Authorization');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}

module.exports = {
  corsOptions,
  corsOptionsDev,
  getCorsOptions,
  corsWithLogging,
  setManualCorsHeaders,
  getAllowedOrigins,
  CORS_CONFIG
};