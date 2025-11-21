

const CORS_CONFIG = {
  development: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  
  production: '*',  // Allow all origins for production
  
  test: [
    'http://localhost:3000',
    'http://localhost:5173'
  ]
};

function getAllowedOrigins() {
  const env = process.env.NODE_ENV || 'development';
  
  const envOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];
  
  const configOrigins = CORS_CONFIG[env] || CORS_CONFIG.development;
  

  if (configOrigins === '*') {
    return '*';
  }
  
  return [...configOrigins, ...envOrigins];
}

function corsOriginHandler(origin, callback) {
  const allowedOrigins = getAllowedOrigins();
  

  if (allowedOrigins === '*') {
    return callback(null, true);
  }
  
  // Allow requests with no origin
  if (!origin) return callback(null, true);
  
  if (allowedOrigins.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    console.warn(` CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  }
}

const corsOptions = {
  origin: corsOriginHandler,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 200
};

const corsOptionsDev = {
  origin: '*',  //  Allow all in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  exposedHeaders: ['Content-Length', 'Content-Type', 'Authorization'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 200
};

function getCorsOptions() {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'development' || env === 'test') {
    console.log(' Using permissive CORS for development (allow all origins)');
    return corsOptionsDev;
  }
  
  console.log(' Using CORS for production (allow all origins)');
  return {
    ...corsOptions,
    origin: '*',  //  Allow all origins in production too
    credentials: true
  };
}

function corsWithLogging(req, res, next) {
  const origin = req.headers.origin || 'No origin';
  const method = req.method;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(` CORS ${method} request from: ${origin}`);
  }
  
  const cors = require('cors');
  const corsMiddleware = cors(getCorsOptions());
  
  corsMiddleware(req, res, (err) => {
    if (err) {
      console.error(` CORS error for ${origin}:`, err.message);
      return res.status(403).json({
        error: 'CORS policy violation',
        message: 'Origin not allowed by CORS policy'
      });
    }
    next();
  });
}

function setManualCorsHeaders(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control,X-File-Name');
  res.header('Access-Control-Expose-Headers', 'Content-Length,Content-Type,Authorization');
  res.header('Access-Control-Max-Age', '86400');
  
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