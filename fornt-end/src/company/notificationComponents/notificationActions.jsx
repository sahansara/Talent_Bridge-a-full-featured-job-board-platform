import React from 'react';
import { Trash2 } from 'lucide-react';

const NotificationActions = ({ 
  isUnread, 
  notificationId, 
  activeTab, 
  markAsRead, 
  deleteNotification, 
  deleteLoading 
}) => {
  return (
    <div className="flex flex-col gap-3 ml-4 flex-shrink-0">
      {isUnread && (
        <button
          onClick={() => markAsRead(notificationId, activeTab)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium
                   hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 
                   focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Mark as Read
        </button>
      )}
      
      <button
        onClick={() => deleteNotification(notificationId, activeTab)}
        disabled={deleteLoading[notificationId]}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium
                 bg-gradient-to-r from-red-500 to-red-600 text-white
                 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 
                 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200
                 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed 
                 disabled:hover:transform-none disabled:hover:shadow-md"
      >
        {deleteLoading[notificationId] ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Deleting...</span>
          </>
        ) : (
          <>
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </>
        )}
      </button>
    </div>
  );
};

export default NotificationActions;