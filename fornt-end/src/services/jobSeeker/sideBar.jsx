import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const logout = async (navigate) => {
  try {
    await axios.post(`${API_BASE_URL}/jobseeker/logout`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    localStorage.removeItem('token');
    navigate('/User_login');
  } catch (error) {
    console.error('Error during logout:', error);
    localStorage.removeItem('token');
    navigate('/User_login');
  }
};

export const useUserData = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    profileImage: null,
  });

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUserData({
        fullName: response.data.fullName || 'User',
        profileImage: response.data.image || null,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData({
        fullName: 'nimak',
        profileImage: null,
      });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { userData, fetchUserData, logout };
};

export default useUserData;