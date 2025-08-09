import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/admin';

class PostApiService {
  // Get authorization headers
  getAuthHeaders() {
    return {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
  }

  // Fetch job posts by status
  async fetchJobPosts(status = 'pending') {
    try {
      const response = await axios.get(`${API_BASE_URL}/job-posts?status=${status}`, {
        headers: this.getAuthHeaders()
      });
      
      // Ensure each job post has a consistent identifier property
      const formattedJobs = (response.data.jobPosts || []).map(job => ({
        ...job,
        // Ensure we have a consistent id property that refers to the MongoDB _id
        id: job._id || job.id
      }));
      
      return formattedJobs;
    } catch (error) {
      console.error('Error fetching job posts:', error);
      throw error;
    }
  }

  // Get job details by ID
  async getJobDetails(jobId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/job-posts/${jobId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data.jobPost;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  }

  // Approve a job post
  async approveJobPost(jobId) {
    try {
      await axios.put(`${API_BASE_URL}/job-posts/${jobId}/approve`, {}, {
        headers: this.getAuthHeaders()
      });
      return true;
    } catch (error) {
      console.error('Error approving job post:', error);
      throw error;
    }
  }

  // Reject a job post
  async rejectJobPost(jobId) {
    try {
      await axios.put(`${API_BASE_URL}/job-posts/${jobId}/reject`, {}, {
        headers: this.getAuthHeaders()
      });
      return true;
    } catch (error) {
      console.error('Error rejecting job post:', error);
      throw error;
    }
  }

  
    
  
}

export default new PostApiService();