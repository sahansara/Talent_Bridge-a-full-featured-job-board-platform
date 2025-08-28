// middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');
const { SECURITY , STATUS_CODES, MESSAGES,} = require('../config/constants');
// Database connection (adjust according to your DB setup)
const connectDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return client.db(process.env.DB_NAME);
};

// Enhanced authenticateToken middleware specifically for admins
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    const JWT_SECRET = SECURITY.JWT_SECRET;
    if (!token) {
      return res.status(STATUS_CODES.INTERNAL_ERROR).json({
        success: false,
        message: "Access token required",
        code: MESSAGES.ERROR.NO_TOKEN
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    
    // Get database connection from app.locals (set in index.js)
    const db = req.app.locals.db;
    if (!db) {
      return res.status( STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Database connection not available',
        code: MESSAGES.ERROR.DATABASE_ERROR
      });
    }

    // Check in Admins collection specifically
    const adminsCollection = db.collection('Admins');
    
    const user = await adminsCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } } // Exclude password from result
    );

    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Admin user not found',
        code: MESSAGES.ERROR.USER_NOT_FOUND
      });
    }

    // Check if admin account is active
    if (user.status === 'inactive' || user.status === 'suspended') {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: 'Admin account is inactive or suspended',
        code: MESSAGES.ERROR.ACCOUNT_INACTIVE
      });
    }

    // Attach user info to request
    req.user = user;
    req.userId = user._id;
    next();

  } catch (error) {
    console.error('Admin token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {aaa
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Token has expired',
        code: MESSAGES.ERROR.TOKEN_EXPIRED
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid token',
        code: MESSAGES.ERROR.INVALID_TOKEN
      });
    }

    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error during authentication',
      code: MESSAGES.ERROR.AUTH_ERROR
    });
  }
};

// Admin authorization middleware
const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required',
        code: MESSAGES.ERROR.AUTH_REQUIRED
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'Admin') {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: 'Admin access required. Current role: ' + (req.user.role || 'unknown'),
        code: MESSAGES.ERROR.ACCESS_DENIED
      });
    }

    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Authorization check failed',
      code: MESSAGES.ERROR.AUTH_ERROR
    });
  }
};

// Combined middleware for admin routes
const adminAuth = [authenticateToken, requireAdmin];

// Rate limiting for admin routes (optional but recommended)
const rateLimit = require('express-rate-limit');

const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    code: MESSAGES.ERROR.RATE_LIMIT_EXCEEDED
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Logging middleware for admin actions
const logAdminActions = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log admin actions for audit trail
    console.log({
      timestamp: new Date().toISOString(),
      admin: {
        id: req.user?._id,
        email: req.user?.email,
        role: req.user?.role
      },
      action: {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip || req.connection?.remoteAddress,
        userAgent: req.get('User-Agent')
      },
      response: {
        statusCode: res.statusCode,
        success: (() => {
          try {
            return JSON.parse(data)?.success || false;
          } catch {
            return res.statusCode < 400;
          }
        })()
      }
    });
    
    originalSend.call(this, data);
  };
  
  next();
};

// Permission-based middleware (for granular permissions)
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required',
        code: MESSAGES.ERROR.AUTH_REQUIRED
      });
    }

    // Check if user has the required permission
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: `Permission '${permission}' required`,
        code: MESSAGES.ERROR.INSUFFICIENT_PERMISSIONS
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  adminAuth,
  adminRateLimit,
  logAdminActions,
  requirePermission
};