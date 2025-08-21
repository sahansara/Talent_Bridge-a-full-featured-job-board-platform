import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserData = (config) => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    if (!config) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(config.api.profile, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserData(response.data);
      setIsLoading(false);
    } catch (error) {
      
      setError('Failed to load user data');
      
      // Set default values based on config
      const defaultData = {};
      defaultData[config.userDataMapping.name] = config.userDataMapping.defaultName;
      defaultData[config.userDataMapping.image] = null;
      
      setUserData(defaultData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [config]);

  return { userData, isLoading, error, fetchUserData };
};

export default useUserData;