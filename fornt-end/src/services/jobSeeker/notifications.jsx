// src/services/notificationApiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/job-seeker';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Custom error handler for consistent error messages
const handleApiError = (error, defaultMessage) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || defaultMessage;
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return error.message || defaultMessage;
  }
};

export const notificationAPI = {
  // Fetch job post notifications (job vacancy notifications)
  fetchJobPostNotifications: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/jobVacancy/notifications`,
        { headers: getAuthHeaders() }
      );
      
      // Normalize response data structure
      return response.data.notifications || response.data || [];
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch job post notifications');
      console.error('Job post notification fetch error:', error);
      throw new Error(errorMessage);
    }
  },

  // Fetch application notifications
  fetchApplicationNotifications: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/applications/notifications`,
        { headers: getAuthHeaders() }
      );
      
      // Normalize response data structure
      return response.data.notifications || response.data || [];
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch application notifications');
      console.error('Application notification fetch error:', error);
      throw new Error(errorMessage);
    }
  },

  // Mark application notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/applications/notifications/${notificationId}/read`,
        {},
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to mark notification as read');
      console.error('Mark as read error:', error);
      throw new Error(errorMessage);
    }
  },

  // Delete application notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/applications/notifications/${notificationId}`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to delete notification');
      console.error('Delete notification error:', error);
      throw new Error(errorMessage);
    }
  },

  // Mark multiple notifications as read (bulk operation)
  markMultipleAsRead: async (notificationIds) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/applications/notifications/bulk/read`,
        { notificationIds },
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to mark notifications as read');
      console.error('Bulk mark as read error:', error);
      throw new Error(errorMessage);
    }
  },

  // Delete multiple notifications (bulk operation)
  deleteMultipleNotifications: async (notificationIds) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/applications/notifications/bulk`,
        {
          headers: getAuthHeaders(),
          data: { notificationIds }
        }
      );
      
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to delete notifications');
      console.error('Bulk delete error:', error);
      throw new Error(errorMessage);
    }
  },

  // Get notification statistics
  getNotificationStats: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/notifications/stats`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch notification statistics');
      console.error('Notification stats error:', error);
      throw new Error(errorMessage);
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/notification-preferences`,
        preferences,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to update notification preferences');
      console.error('Update preferences error:', error);
      throw new Error(errorMessage);
    }
  },

  // Get notification preferences
  getNotificationPreferences: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/notification-preferences`,
        { headers: getAuthHeaders() }
      );
      
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to fetch notification preferences');
      console.error('Get preferences error:', error);
      throw new Error(errorMessage);
    }
  }
};

// Alternative export for backward compatibility
export const notificationApiService = notificationAPI;
