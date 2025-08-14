// src/services/employerApiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/admin';



export const employerApiService = {
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

  // Get all companies
  getAllCompanies: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Company`,
        {
          headers: employerApiService.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Delete a employer
  deleteemployer: async (employerId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/Company/${employerId}`,
        {
          headers: employerApiService.getAuthHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting employer:', error);
      throw error;
    }
  },

  // Get sample companies (fallback)
  getSampleCompanies: () => {
    return sampleCompanies;
  }
};