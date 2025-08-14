import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/';

// Create an axios instance with base URL and token
const api = axios.create({
  baseURL: `${API_BASE_URL}api`, // API endpoint base URL
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
    if (response.data.image && response.data.image !== '') {
      // Check if the URL already includes http or https
      if (response.data.image.startsWith('http')) {
        imageUrl = `${response.data.image}?t=${new Date().getTime()}`;
      } else {
        // Add the base URL if needed
        const cleanPath = response.data.image.replace(/\\/g, '/').replace(/^\/uploads/, '');
        imageUrl = `${api.defaults.baseURL}/uploads/${image}?t=${new Date().getTime()}`;
      }
    }
    
    console.log("Image URL set to:", imageUrl);
    
    return {
      employerName: response.data.employerName || '',
      email: response.data.email || '',
      comDescription: response.data.comDescription || '',
      contactNumber: response.data.contactNumber || '',
      employerWebsite: response.data.employerWebsite || '',
      image: imageUrl,
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
    const updatedImageUrl = response.data.image ? 
      `${response.data.image}?t=${new Date().getTime()}` : 
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