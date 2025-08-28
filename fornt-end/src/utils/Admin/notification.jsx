export const formatDate = (dateString) => {
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
};

// Updated to match admin notification structure using isRead field
export const getUnreadCount = (notifications) => {
  return notifications.filter(n => !n.isRead).length;
};

// Updated filter function for admin notifications
export const filterNotifications = (notifications, searchTerm) => {
  return notifications.filter(notification =>
   
    (notification.jobInfo?.title && notification.jobInfo.title.toLowerCase().includes(searchTerm.toLowerCase())) ||

    (notification.employerInfo?.companyName && notification.employerInfo.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    
    (notification.messages && notification.messages.toLowerCase().includes(searchTerm.toLowerCase())) ||
    
    (notification.employerId && notification.employerId.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};

export const getNotificationStyles = (notificationType, isUnread) => {
  let bgClass = '';
  let borderClass = '';
  let typeTextColor = 'text-gray-500';
  
  switch (notificationType) {
    case 'jobpost':
    case 'job_approval':
    case 'pending_approval':
      bgClass = 'bg-gradient-to-r from-blue-50 to-indigo-50';
      borderClass = 'border-blue-200 hover:border-blue-300';
      typeTextColor = 'text-blue-600';
      break;
    case 'job_approved':
      bgClass = 'bg-gradient-to-r from-green-50 to-emerald-50';
      borderClass = 'border-green-200 hover:border-green-300';
      typeTextColor = 'text-green-600';
      break;
    case 'job_rejected':
      bgClass = 'bg-gradient-to-r from-red-50 to-pink-50';
      borderClass = 'border-red-200 hover:border-red-300';
      typeTextColor = 'text-red-600';
      break;
    case 'review_required':
      bgClass = 'bg-gradient-to-r from-orange-50 to-yellow-50';
      borderClass = 'border-orange-200 hover:border-orange-300';
      typeTextColor = 'text-orange-600';
      break;
    default:
      bgClass = isUnread
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50'
        : 'bg-gradient-to-r from-gray-50 to-slate-50';
      borderClass = isUnread
        ? 'border-blue-200 hover:border-blue-300'
        : 'border-gray-200 hover:border-gray-300';
      typeTextColor = 'text-blue-600';
  }
  
  return { bgClass, borderClass, typeTextColor };
};