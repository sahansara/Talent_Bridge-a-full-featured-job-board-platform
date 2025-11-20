import axios from 'axios';

// Create an axios instance with base URL and token
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const profileAPI = {
  // Fetch user profile
  fetchProfile: async () => {
    const response = await api.get('/users/profile');
   
    // Handle the profile image URL
    let imageUrl = '/api/placeholder/400/400';
    
    if (response.data.profileImage && response.data.profileImage !== '') {
      if (response.data.profileImage.startsWith('http')) {
       
        imageUrl = `${response.data.profileImage}?t=${new Date().getTime()}`;
      } else {
        
        const baseUrl = 'http://localhost:3000';
        
        const normalizedPath = response.data.profileImage.replace(/\\/g, '/');
        imageUrl = `${baseUrl}/${normalizedPath}?t=${new Date().getTime()}`;
      }
    }
    
   
   
    return {
      username: response.data.username || '',
      email: response.data.email || '',
      currentCV: response.data.cvFilename || '',
      profileImage: imageUrl,
    };
  },
  // Update profile information
  updateProfile: async (profileData) => {
    return await api.put('/users/profile', {
      username: profileData.username,
      email: profileData.email
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return await api.put('/users/profile/change-password', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
  },

  // Upload profile image
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const response = await api.post('/users/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Return updated image URL with timestamp
    return response.data.profileImage ? 
      `${response.data.profileImage}?t=${new Date().getTime()}` : 
      null;
  },

  // Upload CV
  uploadCV: async (file) => {
    const formData = new FormData();
    formData.append('cv', file);
    
    return await api.post('/users/profile/upload-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default api;