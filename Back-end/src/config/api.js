// Get base URL from environment variable
const getApiBaseUrl = () => {
  // In production (Docker)
  const isProd = process.env.NODE_ENV === 'production' || process.env.PROD === 'true';
  if (isProd) {
    return '';
  }
  
  // In development,
  return process.env.VITE_API_BASE_URLS || process.env.API_BASE_URL || 'http://localhost:3000';
};

const API_BASE_URLS = getApiBaseUrl();

// Helper function to build full API URL
const buildApiUrl = (endpoint = '') => {
  
  const ep = String(endpoint || '');
  const cleanEndpoint = ep.startsWith('/') ? ep : `/${ep}`;
  return `${API_BASE_URLS}${cleanEndpoint}`;
};

module.exports = {
  API_BASE_URLS,
  buildApiUrl
};