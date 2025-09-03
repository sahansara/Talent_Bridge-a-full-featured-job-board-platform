/**
 * Application constants and configuration
 * Centralized constants for the entire application
 */

// Environment configuration
const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost'
};

// Security configuration
const SECURITY = {
  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET || 'VZJqCdrVHoo7vEOEm3l41HePGd1L1usf',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  JWT_REMEMBER_EXPIRES_IN: process.env.JWT_REMEMBER_EXPIRES_IN || '30d',
  
  // Bcrypt configuration
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100, // Max requests per window
  
  // CORS
  CORS_MAX_AGE: 86400 // 24 hours
};

// User roles and permissions
const USER_ROLES = {
  ADMIN: 'admin',
  JOB_SEEKER: 'jobseeker',
  employer: 'employer', 
  
  // Role hierarchy (for permission checking)
  HIERARCHY: {
    admin: 3,
   
    employer: 2, // Same level as employer
    jobseeker: 1
  }
};

// Database collection names
const COLLECTIONS = {

  ROLE : { 
    ADMIN: 'Admins',
    JOB_SEEKER: 'seek_employees',
    EMPLOYER: 'Companies'

  },

  NOTIFICATIONS: {
    EM_NOTIFICATIONS:'employer_notifications',
    SEEKER_NOTIFICATIONS: 'job_seeker_notifications',
    ADMIN_NOTIFICATIONS: 'notifications',
    VACANCIES_NOTIFICATIONS: 'vacancy_notifications',
    JOBPOST_NOTIFICATIONS:'jobpost_notifications'
  },

  OTHER : {
    JOB_POST: 'Job_Posts',
    APPLICATIONS: 'job_applications',
    FeedBack: 'feedbacks',

  }
};

// Application status codes
const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Application messages
const MESSAGES = {
  // Success messages
  SUCCESS: {
    USER_REGISTERED: 'User registered successfully',
    USER_LOGGED_IN: 'Login successful',
    USER_LOGGED_OUT: 'Logout successful',
    PROFILE_UPDATED: 'Profile updated successfully',
    PROFILE_RETRIEVED: 'Profile retrieved successfully',
    JOB_POSTED: 'Job posted successfully',
    APPLICATION_SUBMITTED: 'Application submitted successfully',
    DATA_RETRIEVED: 'Data retrieved successfully'
  },
  
  // Error messages
  ERROR: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already in use',
    USER_NOT_FOUND: 'User not found',
    ACCESS_DENIED: 'Access  denied',
    INVALID_TOKEN: 'Invalid or expired token',
    MISSING_FIELDS: 'Please provide all required fields',
    INVALID_EMAIL: 'Please provide a valid email address',
    WEAK_PASSWORD: 'Password does not meet security requirements',
    FILE_TOO_LARGE: 'File size exceeds maximum limit',
    INVALID_FILE_TYPE: 'Invalid file type',
    DATABASE_ERROR: 'Database operation failed',
    INTERNAL_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation failed',
    NO_TOKEN: 'Access token required',
    ACCOUNT_INACTIVE: 'Account is inactive or suspended',
    TOKEN_EXPIRED: 'Token has expired',
    AUTH_ERROR: 'Authentication error',
    AUTH_REQUIRED: 'Authentication required',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions for this action',
    RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later'
    
  }
};

// File upload constants
const FILE_UPLOAD = {
  MAX_SIZE: {
    CV: 5 * 1024 * 1024, // 5MB
    IMAGE: 2 * 1024 * 1024, // 2MB
    DOCUMENT: 10 * 1024 * 1024, // 10MB
    LOGO: 1 * 1024 * 1024 // 1MB
  },
  
  ALLOWED_TYPES: {
    CV: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
  },
  
  DIRECTORIES: {
    BASE: 'uploads/',
    CVS: 'uploads/cvs/',
    IMAGES: 'uploads/images/',
    DOCUMENTS: 'uploads/documents/',
    employer_LOGOS: 'uploads/company-logos/'
  }
};

// Validation constants
const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  OBJECTID_REGEX: /^[0-9a-fA-F]{24}$/,
  
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false
  },
  
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  
  employer: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 1000
  }
};



// Job posting constants
const JOB_POSTING = {
  TYPES: {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    CONTRACT: 'contract',
    TEMPORARY: 'temporary',
    INTERNSHIP: 'internship',
    FREELANCE: 'freelance'
  },
  
  EXPERIENCE_LEVELS: {
    ENTRY: 'entry',
    JUNIOR: 'junior',
    MID: 'mid',
    SENIOR: 'senior',
    LEAD: 'lead',
    EXECUTIVE: 'executive'
  },
  
  STATUS: {
    DRAFT: 'draft',
    ACTIVE: 'active',
    PAUSED: 'paused',
    CLOSED: 'closed',
    EXPIRED: 'expired'
  }
};

// Application status constants
const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWING: 'reviewing',
  SHORTLISTED: 'shortlisted',
  INTERVIEWED: 'interviewed',
  OFFERED: 'offered',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
};



// Time constants  milliseconds
const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
};



// Regular expressions for validation
const REGEX_PATTERNS = {
  EMAIL: VALIDATION.EMAIL_REGEX,
  PHONE: VALIDATION.PHONE_REGEX,
  OBJECTID: VALIDATION.OBJECTID_REGEX,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  POSTAL_CODE: /^[0-9]{5}(-[0-9]{4})?$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHABETIC: /^[a-zA-Z\s]+$/
};

// Environment-specific configurations
const ENV_CONFIG = {
  development: {
    LOG_LEVEL: 'debug',
    ENABLE_CORS_ALL: true,
    ENABLE_REQUEST_LOGGING: true,
    ENABLE_ERROR_STACK: true
  },
  
  production: {
    LOG_LEVEL: 'error',
    ENABLE_CORS_ALL: false,
    ENABLE_REQUEST_LOGGING: false,
    ENABLE_ERROR_STACK: false
  },
  
  test: {
    LOG_LEVEL: 'silent',
    ENABLE_CORS_ALL: true,
    ENABLE_REQUEST_LOGGING: false,
    ENABLE_ERROR_STACK: true
  }
};

// Export all constants
module.exports = {
  ENV,
  SECURITY,
  USER_ROLES,
  COLLECTIONS,
  STATUS_CODES,
  MESSAGES,
  FILE_UPLOAD,
  VALIDATION,  
  JOB_POSTING,
  APPLICATION_STATUS,
  TIME,
  REGEX_PATTERNS,
  ENV_CONFIG
};