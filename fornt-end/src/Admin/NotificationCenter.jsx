import React, { useState, useEffect } from 'react';

// Components
import LoadingSpinner from './notificationComponents/loadingSpinner';
import ErrorAlert from './notificationComponents/errorAlert';
import NotificationHeader from './notificationComponents/notificationHeader';
import NavigationTabs from './notificationComponents/notificationTabs';
import SearchBar from './notificationComponents/SearchBar';
import NotificationsList from './notificationComponents/notificationList';

// Services
import AdminNotificationApiService from '../services/Admin/notification'; 

// Utils
import { filterNotifications } from '../utils/Admin/notification';

const AdminNotificationCenter = () => {
  const [activeTab, setActiveTab] = useState('jobpost');
  const [jobPostNotifications, setJobPostNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch admin job post notifications
  const fetchJobPostNotifications = async () => {
    try {
      setLoading(true);
      const data = await AdminNotificationApiService.fetchJobPostNotifications();
      setJobPostNotifications(data);
      setError(null);
    } catch (err) {
      console.error('Admin notification fetch error:', err);
      setError(err.message || 'Failed to fetch admin notifications. Please try again.');
      setJobPostNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Mark admin notification as read
  const markAsRead = async (notificationId) => {
    try {
      await AdminNotificationApiService.markAsRead(notificationId);
      
      // Update local state - change isRead to true and set readAt
      setJobPostNotifications(prev => 
        (prev || []).map(notification => 
          notification._id === notificationId 
            ? {
                ...notification, 
                isRead: true,
                readAt: new Date().toISOString()
              } 
            : notification
        )
      );
      
    } catch (err) {
      console.error('Mark as read error:', err);
      setError('Failed to mark notification as read.');
    }
  };

  // Get current notifications based on active tab
  const getCurrentNotifications = () => {
    switch (activeTab) {
      case 'jobpost':
        return jobPostNotifications || [];
      default:
        return [];
    }
  };

  // Filter notifications based on search term
  const filteredNotifications = filterNotifications(getCurrentNotifications(), searchTerm);

  // Handle retry for error state
  const handleRetry = () => {
    if (activeTab === 'jobpost') {
      fetchJobPostNotifications();
    }
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    await fetchJobPostNotifications();
  };

  useEffect(() => {
    fetchJobPostNotifications();
  }, []);

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <NotificationHeader 
          title="Admin Notification Center"
          subtitle="Manage job post approvals and reviews"
          onRefresh={refreshNotifications}
        />

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
          />

          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTab={activeTab}
            placeholder="Search by job title, company name, or message..."
          />

          {/* Notifications List */}
          <NotificationsList
            filteredNotifications={filteredNotifications}
            activeTab={activeTab}
            searchTerm={searchTerm}
            markAsRead={markAsRead}
            notificationType="admin"
            emptyMessage="No job post notifications to review"
            emptySubMessage="New job posts requiring approval will appear here"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationCenter;