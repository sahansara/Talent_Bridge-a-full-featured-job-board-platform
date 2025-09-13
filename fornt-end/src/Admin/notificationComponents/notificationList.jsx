import React from 'react';
import NotificationCard from './notificationCard';
import EmptyState from './emptyState';

const NotificationsList = ({ 
  filteredNotifications, 
  searchTerm, 
  markAsRead,  
}) => {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <EmptyState  searchTerm={searchTerm} />
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              markAsRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsList;