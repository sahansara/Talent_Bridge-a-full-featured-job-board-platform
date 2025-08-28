import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/feedback";

const FeedbackApiService = {

  submitFeedback: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/submit`, formData, {
        headers: { "Content-Type": "application/json" }
      })
      return response.data;   
    } catch (error) {
      console.error("Error submitting feedback:", error.response?.data || error.message);
      throw error;
    }
  },


  getHighRatedFeedback: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching high-rated feedback:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default FeedbackApiService;
