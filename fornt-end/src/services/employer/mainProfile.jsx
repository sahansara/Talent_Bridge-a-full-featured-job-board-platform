import axios from 'axios';
import {API_BASE_URLS} from  "../../config/api"


const api = axios.create({
  baseURL: `${API_BASE_URLS}/api`,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Profile API Service
export const profileApiService = {
  // Fetch user profile
  fetchProfile: async () => {
    const response = await api.get('/company/profile');
    
    
    // Handle the profile image URL
    let imageUrl = '/api/placeholder/400/400';
    if (response.data.employerImage && response.data.employerImage !== '') {
      // Check if the URL already includes http or https
      if (response.data.employerImage.startsWith('http')) {
        imageUrl = `${response.data.employerImage}?t=${new Date().getTime()}`;
      } else {
        const baseUrl = `${API_BASE_URLS}`;
        // Add the base URL if needed
        const normalizedPath = response.data.employerImage.replace(/\\/g, '/');
        imageUrl = `${baseUrl}/${normalizedPath}?t=${new Date().getTime()}`;
      }
    }
    
    
    return {
      employerName: response.data.employerName || '',
      email: response.data.email || '',
      comDescription: response.data.comDescription || '',
      contactNumber: response.data.contactNumber || '',
      employerWebsite: response.data.employerWebsite || '',
      employerImage: imageUrl,
    };
  },

  // Upload profile image
  uploadProfileImage: async (file) => {
    const imageFormData = new FormData();
    imageFormData.append('companyImage', file);
    
    const response = await api.post('Company/profile/upload-image', imageFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Update the profile image URL with a timestamp to prevent caching
    const updatedImageUrl = response.data.employerImage ? 
      `${response.data.employerImage}?t=${new Date().getTime()}` : 
      null;
    
    return updatedImageUrl;
  },

  // Update profile information
  updateProfile: async (profileData) => {
    await api.put('Company/profile', {
      employerName: profileData.employerName,
      email: profileData.email,
      comDescription: profileData.comDescription,
      contactNumber: profileData.contactNumber,
      employerWebsite: profileData.employerWebsite
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    await api.put('Company/profile/change-password', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  }
};

export { api };
export default profileApiService;