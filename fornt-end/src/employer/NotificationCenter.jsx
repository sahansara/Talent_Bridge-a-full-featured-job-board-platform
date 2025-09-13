import React, { useState, useEffect } from 'react';

// Components
import LoadingSpinner from './notificationComponents/loadingSpinner';
import ErrorAlert from './notificationComponents/errorAlert';
import NotificationHeader from './notificationComponents/notificationHeader';
import NavigationTabs from './notificationComponents/notificationTabs';
import SearchBar from './notificationComponents/SearchBar';
import NotificationsList from './notificationComponents/notificationList';

// Services
import NotificationApiService from '../services/employer/notifications';

// Utils
import { filterNotifications } from '../utils/employer/mainNotification';

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('jobpost');
  const [jobPostNotifications, setJobPostNotifications] = useState([]);
  const [applicationNotifications, setApplicationNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState({});

  // Fetch job post notifications
  const fetchJobPostNotifications = async () => {
    try {
      setLoading(true);
      const data = await NotificationApiService.fetchJobPostNotifications();
      setJobPostNotifications(data);
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
      const data = await NotificationApiService.fetchApplicationNotifications();
      setApplicationNotifications(data);
    } catch (err) {
      console.error('Application notification fetch error:', err);
      setApplicationNotifications([]);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId, type) => {
    try {
      await NotificationApiService.markAsRead(notificationId, type);
      
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
      
      await NotificationApiService.deleteNotification(notificationId, type);
      
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
    } catch (err) {
      console.error('Delete notification error:', err);
      const errorMessage = err.message || 'Failed to delete notification. Please try again.';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [notificationId]: false }));
    }
  };

  // Get current notifications based on active tab
  const getCurrentNotifications = () => {
    return activeTab === 'jobpost' ? jobPostNotifications : applicationNotifications;
  };

  // Filter notifications based on search term
  const filteredNotifications = filterNotifications(getCurrentNotifications(), searchTerm);

  // Handle retry for error state
  const handleRetry = () => {
    if (activeTab === 'jobpost') {
      fetchJobPostNotifications();
    } else {
      fetchApplicationNotifications();
    }
  };

  useEffect(() => {
    fetchJobPostNotifications();
    fetchApplicationNotifications();
  }, []);

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <NotificationHeader />

        {/* Error Banner */}
        {error && (
          <ErrorAlert error={error} onRetry={handleRetry} />
        )}

        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        
        

          {/* Tab Navigation */}
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            jobPostNotifications={jobPostNotifications}
            applicationNotifications={applicationNotifications}
          />

          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTab={activeTab}
          />

          {/* Notifications List */}
          <NotificationsList
            filteredNotifications={filteredNotifications}
            activeTab={activeTab}
            searchTerm={searchTerm}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
            deleteLoading={deleteLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;