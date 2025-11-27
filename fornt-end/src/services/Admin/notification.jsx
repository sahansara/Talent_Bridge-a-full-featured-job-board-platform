const API_BASE_URL = 'http://localhost:3000/api/admin'; 

class AdminNotificationApiService {
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
        throw new Error('Failed to fetch admin notifications');
      }
      
      const data = await response.json();
      
      return data.notifications || data || [];
    } catch (error) {
      console.error('Admin notification fetch error:', error);
      throw error;
    }
  }

  // Mark admin notification as read
  static async markAsRead(notificationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark admin notification as read');
      }
      
      return response;
    } catch (error) {
      console.error('Mark admin notification as read error:', error);
      throw error;
    }
  }

  // Get notification count (unread)
  static async getNotificationCount() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/count`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notification count');
      }
      
      const data = await response.json();
      return data.unreadCount || 0;
    } catch (error) {
      console.error('Notification count fetch error:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      
      return response;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }
}

export default AdminNotificationApiService;