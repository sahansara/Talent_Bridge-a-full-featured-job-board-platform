import React from 'react';
import NotificationIcon from './notificationIcon';
import JobSeekerAvatar from './JobSeekerAvatar';
import NotificationActions from './notificationActions';
import { formatDate, getNotificationStyles } from '../../utils/employer/mainNotification';

const NotificationCard = ({ 
  notification, 
  activeTab, 
  markAsRead, 
  deleteNotification, 
  deleteLoading 
}) => {
  const isUnread = notification.status !== 'read';
  const { bgClass, borderClass, typeTextColor } = getNotificationStyles(notification.type, isUnread);

  return (
    <div 
      className={`flex items-start p-6 rounded-xl border-2 ${bgClass} ${borderClass} 
                 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1
                 ${isUnread ? 'shadow-md' : 'shadow-sm'}`}
    >
      {/* Unread Indicator */}
      {isUnread && (
        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 mt-2 animate-pulse"></div>
      )}

      {/* Notification Icon */}
      <NotificationIcon type={notification.type} />

      {/* Job Seeker Avatar */}
      <JobSeekerAvatar 
        jobSeekerImage={notification.jobSeekerImage}
        jobSeekerName={notification.jobSeekerName}
      />

      {/* Notification Content */}
      <div className="flex-grow">
        <h3 className={`font-bold text-gray-800 text-lg mb-1 ${isUnread ? 'text-gray-900' : ''}`}>
          {notification.jobTitle || 'Untitled Notification'}
        </h3>
        
        {(notification.applicantName || notification.jobSeekerName) && (
          <p className="text-gray-700 font-medium mb-1">
            Applicant: {notification.applicantName || notification.jobSeekerName}
          </p>
        )}
        
        <p className="text-gray-600 mb-3 leading-relaxed">
          {notification.message || 'No additional details'}
        </p>
        
        <div className="flex items-center gap-4 text-sm">
          <span className={`px-3 py-1 rounded-full font-medium ${typeTextColor} bg-white shadow-sm`}>
            {notification.type?.replace('_', ' ').toUpperCase() || 'NOTIFICATION'}
          </span>
          <span className="text-gray-500">
            {formatDate(notification.createdAt)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <NotificationActions
        isUnread={isUnread}
        notificationId={notification._id}
        activeTab={activeTab}
        markAsRead={markAsRead}
        deleteNotification={deleteNotification}
        deleteLoading={deleteLoading}
      />
    </div>
  );
};

export default NotificationCard;