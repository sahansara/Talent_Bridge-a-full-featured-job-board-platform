// src/services/appliedJobsApiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiError = (error, defaultMessage) => {
  if (error.response) {
    return error.response.data?.message || defaultMessage;
  } else if (error.request) {
    return 'Network error. Please check your connection.';
  } else {
    return error.message || defaultMessage;
  }
};

export const appliedJobsAPI = {
  // Fetch user's applications
  fetchApplications: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/job-seeker/my-applications`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to load applications');
      console.error('Fetch applications error:', error);
      throw new Error(errorMessage);
    }
  },

  // Withdraw application
  withdrawApplication: async (applicationId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/job-seeker/applications/${applicationId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to withdraw application');
      console.error('Withdraw application error:', error);
      throw new Error(errorMessage);
    }
  },

  // Update application status (if allowed)
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/job-seeker/applications/${applicationId}/status`,
        { status },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to update application status');
      console.error('Update application status error:', error);
      throw new Error(errorMessage);
    }
  }
};