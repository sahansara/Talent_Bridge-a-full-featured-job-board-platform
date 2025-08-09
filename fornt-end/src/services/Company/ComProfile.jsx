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
    const response = await api.get('/company/Employer/profile');
    console.log("Profile response:", response.data);
    
    // Handle the profile image URL
    let imageUrl = '/api/placeholder/400/400';
    if (response.data.companyImage && response.data.companyImage !== '') {
      // Check if the URL already includes http or https
      if (response.data.companyImage.startsWith('http')) {
        imageUrl = `${response.data.companyImage}?t=${new Date().getTime()}`;
      } else {
        // Add the base URL if needed
        const cleanPath = response.data.companyImage.replace(/\\/g, '/').replace(/^\/uploads/, '');
        imageUrl = `${api.defaults.baseURL}/uploads/${cleanPath}?t=${new Date().getTime()}`;
      }
    }
    
    console.log("Image URL set to:", imageUrl);
    
    return {
      companyName: response.data.companyName || '',
      email: response.data.email || '',
      comDescription: response.data.comDescription || '',
      contactNumber: response.data.contactNumber || '',
      companyWebsite: response.data.companyWebsite || '',
      companyImage: imageUrl
    };
  },

  // Upload profile image
  uploadProfileImage: async (file) => {
    const imageFormData = new FormData();
    imageFormData.append('companyImage', file);
    
    const response = await api.post('Company/Employer/profile/upload-image', imageFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Update the profile image URL with a timestamp to prevent caching
    const updatedImageUrl = response.data.companyImage ? 
      `${response.data.companyImage}?t=${new Date().getTime()}` : 
      null;
    
    return updatedImageUrl;
  },

  // Update profile information
  updateProfile: async (profileData) => {
    await api.put('Company/Employer/profile', {
      companyName: profileData.companyName,
      email: profileData.email,
      comDescription: profileData.comDescription,
      contactNumber: profileData.contactNumber,
      companyWebsite: profileData.companyWebsite
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    await api.put('Company/Employer/profile/change-password', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  }
};

export { api };
export default profileApiService;