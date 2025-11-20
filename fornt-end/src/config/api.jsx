// Get base URL from environment variable
const getApiBaseUrl = () => {
  // In production (Docker)
  if (import.meta.env.PROD) {
    return '';  
  }
  
  // In development,
  return import.meta.env.VITE_API_BASE_URLS || 'http://localhost:3000';
};

export const API_BASE_URLS = getApiBaseUrl();

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => {
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URLS}${cleanEndpoint}`;
};

export default {
  API_BASE_URLS,
  buildApiUrl
};