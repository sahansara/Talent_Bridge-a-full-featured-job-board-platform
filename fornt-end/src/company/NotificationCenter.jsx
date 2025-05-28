import React, { useState, useEffect } from 'react';



import { CheckCircle, XCircle, FileText, Users, Search, Trash2, Briefcase } from 'lucide-react';

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('jobpost');
  const [jobPostNotifications, setJobPostNotifications] = useState([]);
  const [notificationNotifications, setApplicationNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState({});

  // Fetch job post notifications (your existing API)
  const fetchJobPostNotifications = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/Company/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'notification/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      const notificationsData = data.notifications || data || [];
      
      setJobPostNotifications(notificationsData);
      setError(null);
    } catch (err) {
      console.error('Job post notification fetch error:', err);
      setError(err.message || 'Failed to fetch job post notifications. Please try again.');
      setJobPostNotifications([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchApplicationNotifications = async () => {
    try {
       setLoading(true);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/Company/applications/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'notification/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      console.log(data);
      const notificationsData = data.notifications || data || [];
      
      const mockApplicationNotifications = [
        {
          _id: 'app1',
          type: 'new_notification',
          message: 'New notification received for Senior Developer position',
          jobTitle: 'Senior React Developer',
          applicantName: 'John Smith',
          status: 'unread',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'app2',
          type: 'notification_withdrawn',
          message: 'Application withdrawn by candidate',
          jobTitle: 'UI/UX Designer',
          applicantName: 'Sarah Johnson',
          status: 'read',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setApplicationNotifications(notificationsData);
    } catch (err) {
      console.error('Application notification fetch error:', err);
      setApplicationNotifications([]);
    }
  };

  // Mark notification as read
  
const markAsRead = async (notificationId, type) => {
  try {
    const token = localStorage.getItem('token');
    
    // Choose endpoint based on notification type
    const endpoint = type === 'notifications' 
      ? `http://localhost:3000/api/Company/applications/notifications/${notificationId}/read`
      : `http://localhost:3000/api/Company/notifications/${notificationId}/read`;
    
    await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Update local state based on notification type
    if (type === 'jobpost') {
      setJobPostNotifications(prev => 
        (prev || []).map(notification => 
          notification._id === notificationId 
            ? {...notification, status: 'read'} 
            : notification
        )
      );
    } else {
      setApplicationNotifications(prev => 
        (prev || []).map(notification => 
          notification._id === notificationId 
            ? {...notification, status: 'read'} 
            : notification
        )
      );
    }
  } catch (err) {
    console.error('Mark as read error:', err);
    setError('Failed to mark notification as read.');
  }
};

  // Delete notification
  const deleteNotification = async (notificationId, type) => {
  try {
    setDeleteLoading(prev => ({ ...prev, [notificationId]: true }));
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    // Choose endpoint based on notification type
    const endpoint = type === 'notifications' 
      ? `http://localhost:3000/api/Company/applications/notifications/${notificationId}`
      : `http://localhost:3000/api/Company/notifications/${notificationId}`;
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      // Update local state based on notification type
      if (type === 'jobpost') {
        setJobPostNotifications(prev => 
          (prev || []).filter(notification => notification._id !== notificationId)
        );
      } else {
        setApplicationNotifications(prev => 
          (prev || []).filter(notification => notification._id !== notificationId)
        );
      }
    } else {
      throw new Error('Failed to delete notification. Please try again.');
    }
  } catch (err) {
    console.error('Delete notification error:', err);
    const errorMessage = err.message || 'Failed to delete notification. Please try again.';
    setError(errorMessage);
    setTimeout(() => setError(null), 3000);
  } finally {
    setDeleteLoading(prev => ({ ...prev, [notificationId]: false }));
  }
};

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  // Render notification icon
  const renderNotificationIcon = (type) => {
    switch(type) {
      case 'job_approved':
        return <CheckCircle className="text-green-500 w-6 h-6" />;
      case 'job_rejected':
        return <XCircle className="text-red-500 w-6 h-6" />;
      case 'new_notification':
        return <Users className="text-blue-500 w-6 h-6" />;
      case 'notification_withdrawn':
        return <XCircle className="text-orange-500 w-6 h-6" />;
      default:
        return <FileText className="text-gray-500 w-6 h-6" />;
    }
  };

  // Get current notifications based on active tab
  const getCurrentNotifications = () => {
    return activeTab === 'jobpost' ? jobPostNotifications : notificationNotifications;
  };

  // Filter notifications based on search term
  const filteredNotifications = getCurrentNotifications().filter(notification =>
    (notification.jobTitle && notification.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (notification.type && notification.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (notification.applicantName && notification.applicantName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get unread count for each tab
  const getUnreadCount = (notifications) => {
    return notifications.filter(n => n.status !== 'read').length;
  };

  useEffect(() => {
    fetchJobPostNotifications();
    fetchApplicationNotifications();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Notification Center
          </h1>
          <p className="text-gray-600 text-lg">Stay updated with your latest job posts and notifications</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-md">
            <div className="flex items-center">
              <XCircle className="text-red-400 w-5 h-5 mr-3" />
              <span className="text-red-700 font-medium">{error}</span>
              <button 
                onClick={() => activeTab === 'jobpost' ? fetchJobPostNotifications() : fetchApplicationNotifications()} 
                className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <nav className="flex space-x-0">
              <button
                onClick={() => setActiveTab('jobpost')}
                className={`flex-1 py-6 px-8 text-center font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
                  activeTab === 'jobpost'
                    ? 'text-blue-600 bg-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="w-6 h-6" />
                  <span>Job Posts</span>
                  {getUnreadCount(jobPostNotifications) > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse shadow-lg">
                      {getUnreadCount(jobPostNotifications)}
                    </span>
                  )}
                </div>
                {activeTab === 'jobpost' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-6 px-8 text-center font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
                  activeTab === 'notifications'
                    ? 'text-blue-600 bg-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <Users className="w-6 h-6" />
                  <span>Applications</span>
                  {getUnreadCount(notificationNotifications) > 0 && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse shadow-lg">
                      {getUnreadCount(notificationNotifications)}
                    </span>
                  )}
                </div>
                {activeTab === 'notifications' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
                )}
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'jobpost' ? 'job post' : 'notification'} notifications...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm 
                           focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 
                           transition-all duration-300 text-gray-700 placeholder-gray-400
                           hover:border-blue-300 hover:shadow-md"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    {activeTab === 'jobpost' ? (
                      <FileText className="w-12 h-12 text-gray-400" />
                    ) : (
                      <Users className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No {activeTab === 'jobpost' ? 'job post' : 'notification'} notifications found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? 'Try adjusting your search terms' 
                      : `You'll see ${activeTab === 'jobpost' ? 'job post updates' : 'notification updates'} here when they arrive`
                    }
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const isUnread = notification.status !== 'read';
                  let bgClass = '';
                  let borderClass = '';
                  let typeTextColor = 'text-gray-500';

                  switch (notification.type) {
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
                    case 'new_notification':
                      bgClass = 'bg-gradient-to-r from-blue-50 to-indigo-50';
                      borderClass = 'border-blue-200 hover:border-blue-300';
                      typeTextColor = 'text-blue-600';
                      break;
                    case 'notification_withdrawn':
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
                  }

                  return (
                    // Replace the notification card JSX (around lines 420-480) with this:

<div 
  key={notification._id} 
  className={`flex items-start p-6 rounded-xl border-2 ${bgClass} ${borderClass} 
             transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1
             ${isUnread ? 'shadow-md' : 'shadow-sm'}`}
>
  {/* Unread Indicator */}
  {isUnread && (
    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 mt-2 animate-pulse"></div>
  )}

  {/* Notification Icon */}
  <div className="mr-4 p-2 rounded-lg bg-white shadow-sm">
    {renderNotificationIcon(notification.type)}
  </div>

  {/* Job Seeker Image */}
  <div className="mr-4 flex-shrink-0">
    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
      {notification.jobSeekerImage ? (
        <img 
          src={notification.jobSeekerImage.startsWith('http') ? notification.jobSeekerImage : `http://localhost:3000/${notification.jobSeekerImage}`} 
          alt={`${notification.jobSeekerName || 'Job Seeker'} profile`}
          className="h-full w-full object-cover"
        />
      ) : (
        <Briefcase className="text-gray-400" size={20} />
      )}
    </div>
  </div>

  {/* Notification Content */}
  <div className="flex-grow">
    <h3 className={`font-bold text-gray-800 text-lg mb-1 ${isUnread ? 'text-gray-900' : ''}`}>
      {notification.jobTitle || 'Untitled Notification'}
    </h3>
    
    {(notification.applicantName || notification.jobSeekerName) && (
      <p className="text-gray-700 font-medium mb-1">
        Applicant: {notification.applicantName || notification.jobSeekerName}
      </p>
    )}
    
    <p className="text-gray-600 mb-3 leading-relaxed">
      {notification.message || 'No additional details'}
    </p>
    
    <div className="flex items-center gap-4 text-sm">
      <span className={`px-3 py-1 rounded-full font-medium ${typeTextColor} bg-white shadow-sm`}>
        {notification.type?.replace('_', ' ').toUpperCase() || 'NOTIFICATION'}
      </span>
      <span className="text-gray-500">
        {formatDate(notification.createdAt)}
      </span>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex flex-col gap-3 ml-4 flex-shrink-0">
    {isUnread && (
      <button
        onClick={() => markAsRead(notification._id, activeTab)}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium
                 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 
                 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Mark as Read
      </button>
    )}
    
    <button
      onClick={() => deleteNotification(notification._id, activeTab)}
      disabled={deleteLoading[notification._id]}
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium
               bg-gradient-to-r from-red-500 to-red-600 text-white
               hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 
               focus:ring-offset-2 transform hover:scale-105 transition-all duration-200
               shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed 
               disabled:hover:transform-none disabled:hover:shadow-md"
    >
      {deleteLoading[notification._id] ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>Deleting...</span>
        </>
      ) : (
        <>
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </>
      )}
    </button>
  </div>
</div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;