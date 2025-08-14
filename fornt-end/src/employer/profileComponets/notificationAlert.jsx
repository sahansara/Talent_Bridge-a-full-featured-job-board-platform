import React from 'react';

const NotificationAlert = ({ notification }) => {
  if (!notification.message) return null;

  const isError = notification.type === 'error';
  
  const alertClasses = isError 
    ? 'bg-red-50 text-red-700 border border-red-200'
    : 'bg-green-50 text-green-700 border border-green-200';
    
  const iconClass = isError 
    ? 'bx bx-error-circle'
    : 'bx bx-check-circle';

  return (
    <div className={`mb-6 p-4 rounded-md ${alertClasses}`}>
      <div className="flex items-center">
        <i className={`mr-2 text-lg ${iconClass}`}></i>
        <span>{notification.message}</span>
      </div>
    </div>
  );
};

export default NotificationAlert;