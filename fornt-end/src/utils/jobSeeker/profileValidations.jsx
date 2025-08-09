export const validateProfileForm = (formData) => {
  const errors = [];

  // Validate passwords if the user is trying to change them
  if (formData.newPassword || formData.currentPassword) {
    if (!formData.currentPassword) {
      errors.push('Current password is required to set a new password');
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      errors.push("New passwords don't match!");
    }
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateFile = {
  image: (file) => {
    if (!file.type.match('image.*')) {
      return {
        isValid: false,
        error: 'Please select an image file'
      };
    }
    return { isValid: true };
  },

  pdf: (file) => {
    if (file.type !== 'application/pdf') {
      return {
        isValid: false,
        error: 'Please select a PDF file'
      };
    }
    return { isValid: true };
  }
};