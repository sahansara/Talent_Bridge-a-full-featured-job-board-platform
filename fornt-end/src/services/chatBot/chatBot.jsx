import axios from "axios";
import {API_BASE_URLS} from  "../../config/api"

const API_BASE_URL = `${API_BASE_URLS}/api/chatbot`;



const ChatbotApiService = {
  sendMessage: async (message) => {
    try {
      const response = await axios.post(API_BASE_URL, 
        { message },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default ChatbotApiService;