import React from 'react';

const NotificationAlert = ({ notification }) => {
  if (!notification.message) return null;

  const isError = notification.type === 'error';
  
  return (
    <div className={`mb-6 p-4 rounded-md ${
      isError 
        ? 'bg-red-50 text-red-700 border border-red-200' 
        : 'bg-green-50 text-green-700 border border-green-200'
    }`}>
      <div className="flex items-center">
        <i className={`mr-2 text-lg ${
          isError ? 'bx bx-error-circle' : 'bx bx-check-circle'
        }`}></i>
        <span>{notification.message}</span>
      </div>
    </div>
  );
};

export default NotificationAlert;