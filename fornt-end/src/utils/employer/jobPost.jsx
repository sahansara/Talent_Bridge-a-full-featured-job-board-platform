import { API_BASE_URLS } from '../../config/api';

// Location  dropdown
export const locationOptions = [
  "Western Province",
  "Central Province",
  "Southern Province",
  "Northern Province",
  "Eastern Province",
  "North Western Province",
  "North Central Province",
  "Uva Province",
  "Sabaragamuwa Province"
];

// Job type dropdown
export const jobTypeOptions = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Remote'
];

// Default form data structure
export const defaultFormData = {
  _id: null,
  title: '',
  description: '',
  location: '',
  jobType: '',
  salary: '',
  thumbnail: null
};

// Default user data structure
export const defaultUserData = {
  employerName: 'Your Company',
  comDescription: 'Your company description appears here'
};

// Mock jobs data for fallback
export const mockJobs = [
  {
    _id: '507f1f77bcf86cd799439011',
    title: 'Software Engineer',
    description: 'A brief description of the Software Engineer job position.',
    location: 'Chicago, IL',
    jobType: 'Full-time',
    salary: '$100,000 - $130,000',
    thumbnail: null
  },
  {
    _id: '507f1f77bcf86cd799459011',
    title: 'Marketing Coordinator',
    description: 'A brief description of the Marketing Coordinator job position.',
    location: 'Chicago, IL',
    jobType: 'Full-time',
    salary: '$60,000 - $75,000',
    thumbnail: null
  },
  {
    _id: '507f1f77bcf86cd799839011',
    title: 'Product Manager',
    description: 'A brief description of the Product Manager job position.',
    location: 'Chicago, IL',
    jobType: 'Full-time',
    salary: '$110,000 - $140,000',
    thumbnail: null
  }
];

// Utility function to validate file size
export const validateFileSize = (file, maxSizeInMB = 2) => {
  if (!file) return true;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Enhanced validation function for job updates
export const validateFileForUpdate = (file, isEditing, originalThumbnail, maxSizeInMB = 2) => {
  // If no file provided
  if (!file) return { isValid: true, message: '' };
  
  // If editing and file is a string (existing image URL/path), skip validation
  if (isEditing && typeof file === 'string') {
    return { isValid: true, message: '' };
  }
  
  // If editing and same file as original, skip validation
  if (isEditing && originalThumbnail && file === originalThumbnail) {
    return { isValid: true, message: '' };
  }
  
  // Only validate if it's a new File object (newly selected file)
  if (file instanceof File) {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const isValid = file.size <= maxSizeInBytes;
    return {
      isValid,
      message: isValid ? '' : `Image file is too large! Maximum size is ${maxSizeInMB}MB.`
    };
  }
  
  return { isValid: true, message: '' };
};

// Check if file has been changed
export const hasFileChanged = (currentFile, originalFile) => {
  // If no current file, consider it unchanged
  if (!currentFile) return false;
  
  // If current file is a File object, it's a new selection
  if (currentFile instanceof File) return true;
  
  // If both are strings (URLs/paths), compare them
  if (typeof currentFile === 'string' && typeof originalFile === 'string') {
    return currentFile !== originalFile;
  }
  
  // If one is File and other is string, it's changed
  return true;
};

// Utility function to truncate text
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Utility function to generate random ID for demo purposes
export const generateRandomId = () => {
  return Math.random().toString(36).substring(7);
};

// Utility function to get thumbnail URL
export const getThumbnailUrl = (thumbnail) => {
  if (!thumbnail) return null;
  return thumbnail.startsWith('http') ? thumbnail : `${API_BASE_URLS}/${thumbnail}`;
};