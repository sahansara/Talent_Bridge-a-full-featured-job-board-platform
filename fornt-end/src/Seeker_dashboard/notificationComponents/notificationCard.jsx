
// src/components/NotificationCard.js
import React from 'react';
import { Briefcase, Trash2 } from 'lucide-react';
import NotificationIcon from './notificationIcon';
import { notificationUtils } from '../../utils/jobSeeker/mainNotification';

const NotificationCard = ({ 
  notification, 
  activeTab, 
  deleteLoading, 
  onMarkAsRead, 
  onDelete 
}) => {
  const isUnread = notification.status !== 'read' && !notification.isRead;
  
  // Get styling based on notification type and status
  let styling = { bg: '', border: '', text: '' };
  
  if (activeTab === 'applications' && notification.status) {
    styling = notificationUtils.getStatusStyling(notification.status);
  } else if (activeTab === 'jobpost') {
    styling = {
      bg: 'bg-blue-50',
      border: 'border-blue-200 hover:border-blue-300',
      text: 'text-blue-700'
    };
  } else {
    styling = {
      bg: isUnread ? 'bg-blue-50' : 'bg-gray-50',
      border: isUnread ? 'border-blue-200 hover:border-blue-300' : 'border-gray-200 hover:border-gray-300',
      text: 'text-gray-700'
    };
  }

  return (
    <div 
      className={`flex flex-col sm:flex-row sm:items-start p-4 sm:p-6 rounded-lg border ${styling.bg} ${styling.border} 
                 transition-all duration-300 hover:shadow-md
                 ${isUnread ? 'shadow-sm' : ''}`}
    >
      <div className="flex items-start w-full">
        {/* Unread Indicator - only for applications */}
        {isUnread && activeTab === 'applications' && (
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-3 sm:mr-4 mt-2 flex-shrink-0"></div>
        )}

        {/* Notification Icon */}
        <div className="mr-3 sm:mr-4 p-2 rounded-lg bg-white shadow-sm flex-shrink-0">
          <NotificationIcon 
            type={notification.type} 
            status={notification.status} 
            activeTab={activeTab} 
          />
        </div>

        {/* Image - thumbnail for job posts, company image for applications */}
        <div className="mr-3 sm:mr-4 flex-shrink-0">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
            {activeTab === 'jobpost' && notification.thumbnail ? (
              <img 
                src={notification.thumbnail.startsWith('http') ? notification.thumbnail : `http://localhost:3000/${notification.thumbnail}`} 
                alt="Job thumbnail"
                className="h-full w-full object-cover"
              />
            ) : activeTab === 'applications' && notification.companyImage ? (
              <img 
                src={notification.companyImage.startsWith('http') ? notification.companyImage : `http://localhost:3000/${notification.companyImage}`} 
                alt={`${notification.companyName || 'company'} profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Briefcase className="text-gray-400" size={16} />
            )}
          </div>
        </div>

        {/* Notification Content */}
        <div className="flex-grow min-w-0">
          <h3 className={`font-bold text-gray-800 text-base sm:text-lg mb-1 ${isUnread ? 'text-gray-900' : ''}`}>
            {notification.jobTitle || 'Untitled Notification'}
          </h3>
          
          <p className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
            Company: {notification.companyName}
          </p>

          {/* Show job type for job vacancy notifications */}
          {activeTab === 'jobpost' && notification.jobtype && (
            <p className="text-gray-700 font-medium mb-1 text-sm sm:text-base">
              Job Type: {notification.jobtype}
            </p>
          )}
          
          <p className="text-gray-600 mb-3 leading-relaxed text-sm sm:text-base break-words">
            {notification.message || 'No additional details'}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            {activeTab === 'applications' && notification.status ? (
              <span className={`px-2 sm:px-3 py-1 rounded-full font-medium ${styling.text} bg-white shadow-sm inline-block w-fit`}>
                {notification.status.toUpperCase()}
              </span>
            ) : (
              <span className={`px-2 sm:px-3 py-1 rounded-full font-medium ${styling.text} bg-white shadow-sm inline-block w-fit`}>
                {notification.type?.replace('_', ' ').toUpperCase() || 'NOTIFICATION'}
              </span>
            )}
            <span className="text-gray-500">
              {notificationUtils.formatDate(notification.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons - only for application notifications */}
      {activeTab === 'applications' && (
        <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
          {isUnread && (
            <button
              onClick={() => onMarkAsRead(notification._id)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium
                       transition-colors duration-200 text-xs sm:text-sm"
            >
              Mark as Read
            </button>
          )}
          
          <button
            onClick={() => onDelete(notification._id)}
            disabled={deleteLoading[notification._id]}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium
                     bg-red-500 hover:bg-red-600 text-white transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            {deleteLoading[notification._id] ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                <span className="hidden sm:inline">Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Delete</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;