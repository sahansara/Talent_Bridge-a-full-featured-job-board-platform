// Profile validation utilities

export const profileValidationUtils = {
  // Validate form data
  validateForm: (formData) => {
    const errors = {};

    // Validate passwords if the user is trying to change them
    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        errors.password = 'Current password is required to set a new password';
        return { isValid: false, error: errors.password };
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        errors.password = "New passwords don't match!";
        return { isValid: false, error: errors.password };
      }
      
      if (formData.newPassword && formData.newPassword.length < 6) {
        errors.password = "Password must be at least 6 characters long";
        return { isValid: false, error: errors.password };
      }
    }

    // Validate email format
    if (formData.email && !profileValidationUtils.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      return { isValid: false, error: errors.email };
    }

    // Validate contact number
    if (formData.contactNumber && !profileValidationUtils.isValidContactNumber(formData.contactNumber)) {
      errors.contactNumber = 'Please enter a valid 10-digit contact number';
      return { isValid: false, error: errors.contactNumber };
    }

    // Validate website URL
    if (formData.companyWebsite && !profileValidationUtils.isValidURL(formData.companyWebsite)) {
      errors.website = 'Please enter a valid website URL';
      return { isValid: false, error: errors.website };
    }

    return { isValid: true, errors: {} };
  },

  // Email validation
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Contact number validation (10 digits)
  isValidContactNumber: (contactNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(contactNumber);
  },

  // URL validation
  isValidURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  },

  // File validation for image upload
  validateImageFile: (file) => {
    if (!file) return { isValid: false, error: 'No file selected' };
    
    if (!file.type.match('image.*')) {
      return { isValid: false, error: 'Please select an image file' };
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 5MB' };
    }
    
    return { isValid: true };
  },

  // Get error message for API errors
  getErrorMessage: (error) => {
    if (error.response && error.response.status === 401) {
      return 'Current password is incorrect';
    } else if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    } else {
      return 'An error occurred. Please try again.';
    }
  }
};

// Form field configurations
export const FORM_FIELDS = {
  company: {
    companyName: {
      label: 'Company Name',
      type: 'text',
      placeholder: 'Enter your company name',
      required: true
    },
    email: {
      label: 'Email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true
    },
    comDescription: {
      label: 'Company Description',
      type: 'textarea',
      placeholder: 'Enter your company description',
      rows: 4
    },
    contactNumber: {
      label: 'Contact Number',
      type: 'tel',
      placeholder: 'Enter 10-digit contact number',
      helper: 'Format: 10 digits without spaces or special characters'
    },
    companyWebsite: {
      label: 'Company Website',
      type: 'url',
      placeholder: 'https://example.com'
    }
  },
  security: {
    currentPassword: {
      label: 'Current Password',
      type: 'password',
      placeholder: 'Enter current password'
    },
    newPassword: {
      label: 'New Password',
      type: 'password',
      placeholder: 'Enter new password'
    },
    confirmPassword: {
      label: 'Confirm New Password',
      type: 'password',
      placeholder: 'Confirm new password'
    }
  }
};

// Initial form state
export const INITIAL_FORM_STATE = {
  companyName: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  comDescription: '',
  contactNumber: '',
  companyWebsite: '',
  companyImage: '/api/placeholder/400/400'
};

// Password visibility initial state
export const INITIAL_PASSWORD_VISIBILITY = {
  showCurrentPassword: false,
  showNewPassword: false,
  showConfirmPassword: false
};