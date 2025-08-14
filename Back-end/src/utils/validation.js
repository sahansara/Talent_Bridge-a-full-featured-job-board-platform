/**
 * Validation utility functions
 * Contains reusable validation logic for the application
 */

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
function isValidPassword(password) {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }

  if (!hasUpperCase || !hasLowerCase) {
    return {
      isValid: false,
      message: 'Password must contain both uppercase and lowercase letters'
    };
  }

  if (!hasNumbers) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }

  return {
    isValid: true,
    message: 'Password is valid'
  };
}

/**
 * Validates required fields in request body
 * @param {object} data - Data object to validate
 * @param {array} requiredFields - Array of required field names
 * @returns {object} - Validation result with isValid and missing fields
 */
function validateRequiredFields(data, requiredFields) {
  const missingFields = requiredFields.filter(field => 
    !data || !data[field] || data[field].toString().trim() === ''
  );

  return {
    isValid: missingFields.length === 0,
    missingFields: missingFields,
    message: missingFields.length > 0 
      ? `Missing required fields: ${missingFields.join(', ')}`
      : 'All required fields are present'
  };
}

/**
 * Validates file upload types
 * @param {object} file - Multer file object
 * @param {array} allowedTypes - Array of allowed MIME types
 * @returns {object} - Validation result
 */
function isValidFileType(file, allowedTypes) {
  if (!file) {
    return { isValid: false, message: 'No file provided' };
  }

  if (!allowedTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      message: `File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  return {
    isValid: true,
    message: 'File type is valid'
  };
}

/**
 * Validates file size
 * @param {object} file - Multer file object
 * @param {number} maxSizeInMB - Maximum file size in MB
 * @returns {object} - Validation result
 */
function isValidFileSize(file, maxSizeInMB) {
  if (!file) {
    return { isValid: false, message: 'No file provided' };
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      message: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${maxSizeInMB}MB`
    };
  }

  return {
    isValid: true,
    message: 'File size is valid'
  };
}

/**
 * Validates MongoDB ObjectId format
 * @param {string} id - ID string to validate
 * @returns {boolean} - True if valid ObjectId format
 */
function isValidObjectId(id) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

/**
 * Sanitizes input string by trimming whitespace and removing potentially harmful characters
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, ''); // Remove < and > characters
}

module.exports = {
  isValidEmail,
  isValidPassword,
  validateRequiredFields,
  isValidFileType,
  isValidFileSize,
  isValidObjectId,
  sanitizeInput
};