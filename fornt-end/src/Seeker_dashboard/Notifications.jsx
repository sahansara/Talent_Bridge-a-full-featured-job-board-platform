import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, Users, Search, Trash2, Briefcase, Clock, UserCheck } from 'lucide-react';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('jobpost');
  const [jobPostNotifications, setJobPostNotifications] = useState([]);
  const [applicationNotifications, setApplicationNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState({});

  // Fetch job post notifications (job vacancy notifications)
  const fetchJobPostNotifications = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/job-seeker/jobVacancy/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
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

  // Fetch application notifications
  const fetchApplicationNotifications = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/job-seeker/applications/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      
      const notificationsData = data.notifications || data || [];
      
      setApplicationNotifications(notificationsData);
    } catch (err) {
      console.error('Application notification fetch error:', err);
      setApplicationNotifications([]);
    }
  };

  // Mark application notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      
      const endpoint = `http://localhost:3000/api/job-seeker/applications/notifications/${notificationId}/read`;
      
      await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state for application notifications
      setApplicationNotifications(prev => 
        (prev || []).map(notification => 
          notification._id === notificationId 
            ? {...notification, status: 'read', isRead: true} 
            : notification
        )
      );
    } catch (err) {
      console.error('Mark as read error:', err);
      setError('Failed to mark notification as read.');
    }
  };

  // Delete application notification
  const deleteNotification = async (notificationId) => {
    try {
      setDeleteLoading(prev => ({ ...prev, [notificationId]: true }));
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const endpoint = `http://localhost:3000/api/job-seeker/applications/notifications/${notificationId}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Update local state for application notifications
        setApplicationNotifications(prev => 
          (prev || []).filter(notification => notification._id !== notificationId)
        );
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

  // Render notification icon based on type and status
  const renderNotificationIcon = (type, status) => {
    if (activeTab === 'applications') {
      switch(status) {
        case 'Accepted':
          return <CheckCircle className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />;
        case 'Rejected':
          return <XCircle className="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />;
        case 'Under Review':
          return <Clock className="text-orange-600 w-5 h-5 sm:w-6 sm:h-6" />;
        case 'Applied':
          return <UserCheck className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />;
        default:
          return <FileText className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />;
      }
    }
    
    // Job post notifications
    switch(type) {
      case 'job_approved':
        return <CheckCircle className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />;
      case 'job_rejected':
        return <XCircle className="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <FileText className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  // Get status styling for applications
  const getStatusStyling = (status) => {
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
  };

  // Get current notifications based on active tab
  const getCurrentNotifications = () => {
    return activeTab === 'jobpost' ? jobPostNotifications : applicationNotifications;
  };

  // Filter notifications based on search term
  const filteredNotifications = getCurrentNotifications().filter(notification =>
    (notification.jobTitle && notification.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (notification.type && notification.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (notification.companyName && notification.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (notification.jobtype && notification.jobtype.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get unread count for each tab
  const getUnreadCount = (notifications) => {
    return notifications.filter(n => n.status !== 'read' && !n.isRead).length;
  };

  useEffect(() => {
    fetchJobPostNotifications();
    fetchApplicationNotifications();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-2 sm:mb-4">
            Notification Center
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">Stay updated with your latest job posts and applications</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center">
                <XCircle className="text-red-500 w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-red-700 font-medium text-sm sm:text-base">{error}</span>
              </div>
              <button 
                onClick={() => activeTab === 'jobpost' ? fetchJobPostNotifications() : fetchApplicationNotifications()} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base self-start sm:ml-auto"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Main Container */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-white">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('jobpost')}
                className={`flex-1 py-4 sm:py-6 px-4 sm:px-8 text-center font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 relative ${
                  activeTab === 'jobpost'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm md:text-base">Job Vacancies</span>
                  {getUnreadCount(jobPostNotifications) > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {getUnreadCount(jobPostNotifications)}
                    </span>
                  )}
                </div>
                {activeTab === 'jobpost' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('applications')}
                className={`flex-1 py-4 sm:py-6 px-4 sm:px-8 text-center font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 relative ${
                  activeTab === 'applications'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm md:text-base">Applications</span>
                  {getUnreadCount(applicationNotifications) > 0 && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {getUnreadCount(applicationNotifications)}
                    </span>
                  )}
                </div>
                {activeTab === 'applications' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
                )}
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="p-4 sm:p-6 bg-blue-50 border-b border-gray-200">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'jobpost' ? 'job vacancy' : 'application'} notifications...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white border border-gray-300 rounded-lg shadow-sm 
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    {activeTab === 'jobpost' ? (
                      <FileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                    ) : (
                      <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                    No {activeTab === 'jobpost' ? 'job vacancy' : 'application'} notifications found
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {searchTerm 
                      ? 'Try adjusting your search terms' 
                      : `You'll see ${activeTab === 'jobpost' ? 'job vacancy updates' : 'application updates'} here when they arrive`
                    }
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const isUnread = notification.status !== 'read' && !notification.isRead;
                  
                  // Get styling based on notification type and status
                  let styling = { bg: '', border: '', text: '' };
                  
                  if (activeTab === 'applications' && notification.status) {
                    styling = getStatusStyling(notification.status);
                  } else if (activeTab === 'jobpost') {
                    styling = {
                      bg: 'bg-blue-50',
                      border: 'border-blue-200 hover:border-blue-300',
                      text: 'text-blue-700'
                    };
                  } else {
                    styling = {
                      bg: isUnread ? 'bg-blue-50' : 'bg-gray-50',
                      border: isUnread ? 'border-blue-200 hover:border-blue-300' : 'border-gray-200 hover:border-gray-300',
                      text: 'text-gray-700'
                    };
                  }

                  return (
                    <div 
                      key={notification._id} 
                      className={`flex flex-col sm:flex-row sm:items-start p-4 sm:p-6 rounded-lg border ${styling.bg} ${styling.border} 
                                 transition-all duration-300 hover:shadow-md
                                 ${isUnread ? 'shadow-sm' : ''}`}
                    >
                      <div className="flex items-start w-full">
                        {/* Unread Indicator - only for applications */}
                        {isUnread && activeTab === 'applications' && (
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-3 sm:mr-4 mt-2 flex-shrink-0"></div>
                        )}

                        {/* Notification Icon */}
                        <div className="mr-3 sm:mr-4 p-2 rounded-lg bg-white shadow-sm flex-shrink-0">
                          {renderNotificationIcon(notification.type, notification.status)}
                        </div>

                        {/* Image - thumbnail for job posts, company image for applications */}
                        <div className="mr-3 sm:mr-4 flex-shrink-0">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                            {activeTab === 'jobpost' && notification.thumbnail ? (
                              <img 
                                src={notification.thumbnail.startsWith('http') ? notification.thumbnail : `http://localhost:3000/${notification.thumbnail}`} 
                                alt="Job thumbnail"
                                className="h-full w-full object-cover"
                              />
                            ) : activeTab === 'applications' && notification.companyImage ? (
                              <img 
                                src={notification.companyImage.startsWith('http') ? notification.companyImage : `http://localhost:3000/${notification.companyImage}`} 
                                alt={`${notification.companyName || 'company'} profile`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Briefcase className="text-gray-400" size={16} />
                            )}
                          </div>
                        </div>

                        {/* Notification Content */}
                        <div className="flex-grow min-w-0">
                          <h3 className={`font-bold text-gray-800 text-base sm:text-lg mb-1 ${isUnread ? 'text-gray-900' : ''}`}>
                            {notification.jobTitle || 'Untitled Notification'}
                          </h3>
                          
                          <p className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
                            Company: {notification.companyName}
                          </p>

                          {/* Show job type for job vacancy notifications */}
                          {activeTab === 'jobpost' && notification.jobtype && (
                            <p className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
                              Job Type: {notification.jobtype}
                            </p>
                          )}
                          
                          <p className="text-gray-600 mb-3 leading-relaxed text-sm sm:text-base break-words">
                            {notification.message || 'No additional details'}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                            {activeTab === 'applications' && notification.status ? (
                              <span className={`px-2 sm:px-3 py-1 rounded-full font-medium ${styling.text} bg-white shadow-sm inline-block w-fit`}>
                                {notification.status.toUpperCase()}
                              </span>
                            ) : (
                              <span className={`px-2 sm:px-3 py-1 rounded-full font-medium ${styling.text} bg-white shadow-sm inline-block w-fit`}>
                                {notification.type?.replace('_', ' ').toUpperCase() || 'NOTIFICATION'}
                              </span>
                            )}
                            <span className="text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - only for application notifications */}
                      {activeTab === 'applications' && (
                        <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                          {isUnread && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium
                                       transition-colors duration-200 text-xs sm:text-sm"
                            >
                              Mark as Read
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            disabled={deleteLoading[notification._id]}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium
                                     bg-red-500 hover:bg-red-600 text-white transition-colors duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                          >
                            {deleteLoading[notification._id] ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                                <span className="hidden sm:inline">Deleting...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
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

export default Notifications;