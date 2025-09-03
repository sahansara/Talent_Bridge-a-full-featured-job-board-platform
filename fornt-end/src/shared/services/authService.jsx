import axios from 'axios';

export const logout = async (config, navigate) => {
  try {
  
    await axios.post(config.api.logout, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    
    clearUserData();
    
  
    window.location.href = `/User_login?v=${Math.floor(Date.now() / 1000)}`;
   
  } catch (error) {
    console.error('Logout failed:', error);
    
    // Even if API fails, clear token and redirect
    clearUserData();
    window.location.href = `/User_login?v=${Math.floor(Date.now() / 1000)}`;
  }
};

// Helper function to clear user data while preserving remember me data
const clearUserData = () => {
  // Get remember me data before clearing (if you want to preserve it)
  const rememberMe = localStorage.getItem('rememberMe');
  const savedEmail = localStorage.getItem('savedEmail');
  
  // Clear authentication tokens
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  
  // Clear user session data
  localStorage.removeItem('user');
  localStorage.removeItem('userProfile');
  localStorage.removeItem('userPreferences');
  localStorage.removeItem('userSettings');
  
  // Clear any cached data
  localStorage.removeItem('cachedData');
  localStorage.removeItem('tempData');
  
  // Clear session storage completely
  sessionStorage.clear();
  
  // Restore remember me data if it existed
  if (rememberMe) {
    localStorage.setItem('rememberMe', rememberMe);
  }
  if (savedEmail) {
    localStorage.setItem('savedEmail', savedEmail);
  }
  
  // Clear any cookies (except remember me related ones)
  clearAuthCookies();
};


const clearAuthCookies = () => {
 
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
  document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
  document.cookie = 'userSession=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
};