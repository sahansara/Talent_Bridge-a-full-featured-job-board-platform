import React from 'react';
import { Trash2 } from 'lucide-react';

const NotificationActions = ({ 
  isUnread, 
  notificationId, 
  markAsRead, 
  
}) => {
  return (
    <div className="flex flex-col gap-3 ml-4 flex-shrink-0">
      {isUnread && (
        <button
          onClick={() => markAsRead(notificationId)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium
                   hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 
                   focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Mark as Read
        </button>
      )}
      
      
    </div>
  );
};

export default NotificationActions;