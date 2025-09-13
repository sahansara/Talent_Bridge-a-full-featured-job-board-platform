
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phoneNumber);
}
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

function isValidObjectId(id) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

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
  isValidPhoneNumber,
  validateRequiredFields,
  isValidFileType,
  isValidFileSize,
  isValidObjectId,
  sanitizeInput
};