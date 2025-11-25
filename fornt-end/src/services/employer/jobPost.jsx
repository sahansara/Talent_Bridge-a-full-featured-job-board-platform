import axios from 'axios';
import {API_BASE_URLS} from  "../../config/api"

const API_BASE_URL = `${API_BASE_URLS}`;

class JobPostApiService {
  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  static getMultipartHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    };
  }

  static async fetchUserData() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Company/profile`, {
        headers: this.getAuthHeaders()
      });
      return response.data || { employerName: 'employer', comDescription: 'Your employer description' };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  static async fetchJobs() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Company/jobs`, {
        headers: this.getAuthHeaders()
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  static async createJob(jobData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/Company/jobs`, jobData, {
        headers: this.getMultipartHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  static async updateJob(jobId, jobData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/Company/jobs/${jobId}`, jobData, {
        headers: this.getMultipartHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  static async deleteJob(jobId) {
    try {
      await axios.delete(`${API_BASE_URL}/api/Company/jobs/${jobId}`, {
        headers: this.getAuthHeaders()
      });
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }
}

export default JobPostApiService;