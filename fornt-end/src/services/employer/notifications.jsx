const API_BASE_URL = 'http://localhost:3000/api/Company';

class NotificationApiService {
  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  static async fetchJobPostNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      return data.notifications || data || [];
    } catch (error) {
      console.error('Job post notification fetch error:', error);
      throw error;
    }
  }

  static async fetchApplicationNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/notifications`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
     
      return data.notifications || data || [];
    } catch (error) {
      console.error('Application notification fetch error:', error);
      throw error;
    }
  }

  static async markAsRead(notificationId, type) {
    try {
      const endpoint = type === 'applications' 
        ? `${API_BASE_URL}/applications/notifications/${notificationId}/read`
        : `${API_BASE_URL}/notifications/${notificationId}/read`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      return response;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  static async deleteNotification(notificationId, type) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const endpoint = type === 'applications' 
        ? `${API_BASE_URL}/applications/notifications/${notificationId}`
        : `${API_BASE_URL}/notifications/${notificationId}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete notification. Please try again.');
      }

      return response;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }
}

export default NotificationApiService;