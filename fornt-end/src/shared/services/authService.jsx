// src/shared/services/authService.js
import axios from 'axios';

export const logout = async (config, navigate) => {
  try {
    await axios.post(config.api.logout, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    localStorage.removeItem('token');
    navigate('/User_login');
  } catch (error) {
    console.error('Logout failed:', error);
    // Even if API fails, clear token and redirect
    localStorage.removeItem('token');
    navigate('/User_login');
  }
};
