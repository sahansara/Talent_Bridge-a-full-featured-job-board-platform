import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/job-seeker/register";
const registerApi = {
  submitForm: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        }
      });
      return response.data;   
    } catch (error) {
      console.error("Error submitting registration:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default registerApi;
