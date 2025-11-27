// src/services/jobSeekerApiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/admin';



export const jobSeekerApiService = {
  // Get authentication headers
  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  },

  // Get all job seekers
  getAllJobSeekers: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/jobseekers`,
        {
          headers: jobSeekerApiService.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching job seekers:', error);
      throw error;
    }
  },

  // Delete a job seeker using bulk delete endpoint
  deleteJobSeeker: async (userId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/jobseekers/bulk-delete`,
        { userIds: [userId] }, // send userId inside array in body
        {
          headers: jobSeekerApiService.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting job seeker:', error);
      throw error;
    }
  },

 
};