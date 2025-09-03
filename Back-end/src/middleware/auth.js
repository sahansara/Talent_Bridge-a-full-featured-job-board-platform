const jwt = require('jsonwebtoken');
const { SECURITY, STATUS_CODES, MESSAGES } = require('../config/constants');

const JWT_SECRET = SECURITY.JWT_SECRET;

// Middleware to ensure database connection is available
function ensureDbConnected(req, res, next) {
  if (!req.app.locals.db) {
    return res.status(STATUS_CODES.SERVICE_UNAVAILABLE).json({ 
      success: false,
      error: MESSAGES.ERROR.DATABASE_ERROR 
    });
  }
  next();
}

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({ 
      success: false,
      error: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res.status(STATUS_CODES.FORBIDDEN).json({ 
        success: false,
        error: MESSAGES.ERROR.INVALID_TOKEN || 'Invalid or expired token'
      });
    }
    
    req.user = decoded;
    next();
  });
}

// Utility function to generate JWT token
function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Utility function to verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

module.exports = {
  ensureDbConnected,
  authenticateToken,
  generateToken,
  verifyToken,
  JWT_SECRET
};