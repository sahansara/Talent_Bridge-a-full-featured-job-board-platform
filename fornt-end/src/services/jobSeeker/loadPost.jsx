import axios from 'axios';
import {API_BASE_URLS} from  "../../config/api"

const API_BASE_URL = `${API_BASE_URLS}/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const jobAPI = {
  // Fetch all jobs with optional search
  fetchJobs: async (searchQuery = '') => {
    const response = await axios.get(
      `${API_BASE_URL}/job-seeker/jobs${searchQuery ? `?search=${searchQuery}` : ''}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Fetch single job details
  fetchJobDetails: async (jobId) => {
    const response = await axios.get(
      `${API_BASE_URL}/job-seeker/job/${jobId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Submit job application
  submitApplication: async (jobId) => {
    const response = await axios.post(
      `${API_BASE_URL}/job-seeker/applications`,
      { jobId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },

  // Check application status
  checkApplicationStatus: async (jobId) => {
    const response = await axios.get(
      `${API_BASE_URL}/job-seeker/applications?jobId=${jobId}`,
      { headers: getAuthHeaders() }
    );
    return response.data && response.data.length > 0;
  }
};

export const userAPI = {
  // Fetch user profile
  fetchUserProfile: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/users/profile`,
      { headers: getAuthHeaders() }
    );
  
    return {
      username: response.data.username,
      email: response.data.email,
      profileImage: response.data.profileImage,
      cvFilename: response.data.cvFilename
    };
   
  }
};