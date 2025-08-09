export const notificationUtils = {
  // Format date
  formatDate(dateString) {
    if (!dateString) return 'Unknown date';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 10) return 'Just now';
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
  if (diffMinutes === 1) return '1 minute ago';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  if (diffYears === 1) return '1 year ago';
  return `${diffYears} years ago`;
},

  // Get status styling for applications
  getStatusStyling(status) {
    switch(status) {
      case 'Accepted':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200 hover:border-green-300',
          text: 'text-green-700'
        };
      case 'Rejected':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200 hover:border-red-300',
          text: 'text-red-700'
        };
      case 'Under Review':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200 hover:border-orange-300',
          text: 'text-orange-700'
        };
      case 'Applied':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200 hover:border-blue-300',
          text: 'text-blue-700'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200 hover:border-gray-300',
          text: 'text-gray-700'
        };
    }
  },

  // Get unread count for notifications
  getUnreadCount(notifications) {
    return notifications.filter(n => n.status !== 'read' && !n.isRead).length;
  },

  // Filter notifications based on search term
  filterNotifications(notifications, searchTerm) {
    return notifications.filter(notification =>
      (notification.jobTitle && notification.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notification.type && notification.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notification.companyName && notification.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (notification.jobtype && notification.jobtype.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
};