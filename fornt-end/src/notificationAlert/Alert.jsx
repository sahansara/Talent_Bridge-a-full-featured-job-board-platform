import React, { useEffect, useState } from 'react';

const Alert = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const isError = notification.type === 'error';
  
  useEffect(() => {
    if (!notification.message) return;
    
    setIsVisible(true); 
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 300);
    }, 4000); 
    return () => clearTimeout(timer);
  }, [notification.message, onClose]);
  
  if (!notification.message) return null;
  
  if (!isVisible) return null;
  
  return (
    <div className={`mb-6 p-4 rounded-lg shadow-sm border-l-4 transition-all duration-300 ${
      isError 
        ? 'bg-red-50 text-red-800 border-red-400' 
        : 'bg-blue-50 text-blue-800 border-blue-400'
    }`}>
      <div className="flex items-center">
        <div className={`mr-3 p-1 rounded-full ${
          isError ? 'bg-red-200' : 'bg-blue-200'
        }`}>
          <i className={`text-lg ${
            isError ? 'bx bx-error-circle text-red-600' : 'bx bx-check-circle text-blue-600'
          }`}></i>
        </div>
        <span className="font-medium">{notification.message}</span>
      </div>
    </div>
  );
};

export default Alert;