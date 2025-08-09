import React from 'react';

const NotificationAlert = ({ notification }) => {
  if (!notification.show) return null;

  return (
    <div 
      className={`mb-4 p-4 rounded ${
        notification.type === 'success' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'
      }`}
    >
      {notification.message}
    </div>
  );
};

export default NotificationAlert;