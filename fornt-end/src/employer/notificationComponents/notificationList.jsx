import React from 'react';
import NotificationCard from './notificationCard';
import EmptyState from './emptyState';

const NotificationsList = ({ 
  filteredNotifications, 
  activeTab, 
  searchTerm, 
  markAsRead, 
  deleteNotification, 
  deleteLoading 
}) => {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <EmptyState activeTab={activeTab} searchTerm={searchTerm} />
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              activeTab={activeTab}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
              deleteLoading={deleteLoading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsList;