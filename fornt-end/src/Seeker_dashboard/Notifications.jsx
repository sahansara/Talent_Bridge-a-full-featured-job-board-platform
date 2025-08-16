// src/Notifications_Optimized.js
import React, { useState, useEffect } from 'react';

// Import components
import NotificationTabs from './notificationComponents/notificationTabs';
import SearchBar from './notificationComponents/SearchBar';
import NotificationCard from './notificationComponents/notificationCard';
import EmptyState from './notificationComponents/emptyState';
import ErrorAlert from './notificationComponents/errorAlert';
import LoadingSpinner from './notificationComponents/loadingSpinner';
import NotificationHeader from './notificationComponents/notificationHeader';

// Import services and utils
import { notificationApiService } from '../services/jobSeeker/notifications';
import { notificationUtils } from '../utils/jobSeeker/mainNotification';

const Notifications = () => {
  // State management
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
      const notifications = await notificationApiService.fetchJobPostNotifications();
      setJobPostNotifications(notifications);
      setError(null);
    } catch (err) {
      setError(err.message);
      setJobPostNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch application notifications
  const fetchApplicationNotifications = async () => {
    try {
      setLoading(true);
      const notifications = await notificationApiService.fetchApplicationNotifications();
      setApplicationNotifications(notifications);
    } catch (err) {
      setApplicationNotifications([]);
    }
  };

  // Mark application notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationApiService.markAsRead(notificationId);
      
      // Update local state for application notifications
      setApplicationNotifications(prev => 
        (prev || []).map(notification => 
          notification._id === notificationId 
            ? {...notification, status: 'read', isRead: true} 
            : notification
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete application notification
  const deleteNotification = async (notificationId) => {
    try {
      setDeleteLoading(prev => ({ ...prev, [notificationId]: true }));
      
      await notificationApiService.deleteNotification(notificationId);
      
      // Update local state for application notifications
      setApplicationNotifications(prev => 
        (prev || []).filter(notification => notification._id !== notificationId)
      );
    } catch (err) {
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
  const filteredNotifications = notificationUtils.filterNotifications(
    getCurrentNotifications(), 
    searchTerm
  );

  // Handle retry functionality
  const handleRetry = () => {
    if (activeTab === 'jobpost') {
      fetchJobPostNotifications();
    } else {
      fetchApplicationNotifications();
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchJobPostNotifications();
    fetchApplicationNotifications();
  }, []);

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
       <NotificationHeader/>

        {/* Error Banner */}
        <ErrorAlert error={error} onRetry={handleRetry} />

        {/* Main Container */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Tab Navigation */}
          <NotificationTabs
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
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {filteredNotifications.length === 0 ? (
                <EmptyState activeTab={activeTab} searchTerm={searchTerm} />
              ) : (
                filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification._id}
                    notification={notification}
                    activeTab={activeTab}
                    deleteLoading={deleteLoading}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;