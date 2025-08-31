import React from 'react';
import NotificationIcon from './notificationIcon';
import EmployerAvatar from './EmployerAvatar';
import NotificationActions from './notificationActions';
import { formatDate, getNotificationStyles } from '../../utils/Admin/notification'; 

const NotificationCard = ({
  notification,
  markAsRead,
}) => {
  const isUnread = !notification.isRead;
  const { bgClass, borderClass, typeTextColor } = getNotificationStyles('jobpost', isUnread);

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
      <NotificationIcon isRead={notification.isRead} />

      {/* Company Avatar - Enhanced */}
      <div className="mr-4 flex-shrink-0 relative">
        <div className="relative group">
          {/* Glowing background effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full opacity-30 group-hover:opacity-50 blur-sm transition-all duration-300"></div>
          
          {/* Avatar container */}
          <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-3 border-white shadow-lg ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all duration-300 group-hover:scale-110">
            <EmployerAvatar 
              employerImage={notification.employerInfo?.companyImage}
              employerName={notification.employerInfo?.companyName}
            />
          </div>
          
          {/* Sparkle effect for unread */}
          {isUnread && (
            <div className="absolute -top-1 -right-1">
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce shadow-lg">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-300 animate-ping"></div>
              </div>
            </div>
          )}
        </div>
      </div>
     
      {/* Job Thumbnail - Enhanced */}
      {notification.jobInfo?.thumbnail && (
        <div className="mr-4 flex-shrink-0 relative">
          <div className="relative group">
            {/* Animated border gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 rounded-xl opacity-40 group-hover:opacity-70 transition-all duration-300 animate-pulse"></div>
            
            {/* Thumbnail container */}
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50 border-2 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
              <img
                src={notification.jobInfo.thumbnail.startsWith('http')
                  ? notification.jobInfo.thumbnail
                  : `http://localhost:3000/${notification.jobInfo.thumbnail}`}
                alt={`${notification.jobInfo?.title || 'Job'} thumbnail`}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Corner accent */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-br from-white to-blue-200 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Floating particles effect for unread */}
            {isUnread && (
              <>
                <div className="absolute -top-2 -left-2 w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="absolute -top-1 -right-2 w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute -bottom-2 -left-1 w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Notification Content */}
      <div className="flex-grow">
        <h3 className={`font-bold text-gray-800 text-lg mb-1 ${isUnread ? 'text-gray-900' : ''}`}>
          {notification.jobInfo?.title || 'Untitled Job Post'}
        </h3>
       
        <p className="text-gray-700 font-medium mb-1">
        {notification.employerInfo?.companyName || 'Unknown Company'}
        </p>
       
        <p className="text-gray-600 mb-3 leading-relaxed">
          {notification.messages || 'No additional details'}
        </p>
       
        <div className="flex items-center gap-4 text-sm">
          <span className={`px-3 py-1 rounded-full font-medium ${typeTextColor} bg-white shadow-sm`}>
            {isUnread ? 'PENDING APPROVAL' : 'REVIEWED'}
          </span>
          <span className="text-gray-500">
            {formatDate(notification.createdAt)}
          </span>
          {notification.readAt && (
            <span className="text-green-600 text-xs">
              ✓ Reviewed {formatDate(notification.readAt)}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <NotificationActions
        isUnread={isUnread}
        notificationId={notification._id}
        markAsRead={markAsRead}
      />
    </div>
  );
};


export default NotificationCard;