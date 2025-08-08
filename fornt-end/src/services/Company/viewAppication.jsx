import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/';

// Function to get token safely
const getAuthToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.warn('localStorage not available:', error);
    return null;
  }
};

// API Service for application management
export const applicationApiService = {
  // Fetch all applications
  fetchApplications: async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `${API_BASE_URL}api/Company/All-applications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Check if response is HTML (error case)
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      throw new Error('API endpoint not found - received HTML instead of JSON');
    }

    // Handle your specific API response format
    if (response.data && response.data.jobPosts) {
      return response.data.jobPosts;
    } else {
      throw new Error('Invalid response format - jobPosts not found');
    }
  },

  // Update application status
  updateApplicationStatus: async (applicationId, newStatus) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    await axios.put(
      `${API_BASE_URL}api/Company/applications/${applicationId}/status`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  },

  // Update application notes
  updateApplicationNotes: async (applicationId, notes) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    await axios.put(
      `${API_BASE_URL}api/Company/applications/${applicationId}/notes`,
      { notes: notes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  },

  // Get CV preview URL
  getCVPreviewUrl: (cvUrl) => {
    if (!cvUrl) return null;
    
    // Extract filename from the CV URL - handle both formats
    let filename;
    if (cvUrl.includes('uploads/cvs/') || cvUrl.includes('uploads\\cvs\\')) {
      filename = cvUrl.split(/[/\\]/).pop();
    } else {
      filename = cvUrl.split('/').pop();
    }
    
    console.log('Original CV URL:', cvUrl);
    console.log('Extracted filename:', filename);
    
    // Use the Company API endpoint
    const previewUrl = `${API_BASE_URL}api/Company/cv/${filename}`;
    console.log('Generated Preview URL:', previewUrl);
    
    return previewUrl;
  },

  // Download CV
  downloadCV: async (cvUrl) => {
    if (!cvUrl) {
      throw new Error('No CV available');
    }
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const previewUrl = applicationApiService.getCVPreviewUrl(cvUrl);
    
    // Add authorization header by creating a fetch request
    const response = await fetch(previewUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Create blob and download
    const blob = await response.blob();
    return { blob, filename: cvUrl.split(/[/\\]/).pop() || 'cv.pdf' };
  }
};

export { getAuthToken };