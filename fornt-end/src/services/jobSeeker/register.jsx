import axios from "axios";
import {API_BASE_URLS} from  "../../config/api"

const API_BASE_URL = `${API_BASE_URLS}/api/job-seeker/register`;
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
