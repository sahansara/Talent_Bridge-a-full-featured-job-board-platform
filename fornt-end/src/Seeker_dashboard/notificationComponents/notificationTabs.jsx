// src/components/NotificationTabs.js
import React from 'react';
import { FileText, Users } from 'lucide-react';
import { notificationUtils } from '../../utils/jobSeeker/mainNotification';

const NotificationTabs = ({ 
  activeTab, 
  setActiveTab, 
  jobPostNotifications, 
  applicationNotifications 
}) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <nav className="flex">
        <button
          onClick={() => setActiveTab('jobpost')}
          className={`flex-1 py-4 sm:py-6 px-4 sm:px-8 text-center font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 relative ${
            activeTab === 'jobpost'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm md:text-base">Job Vacancies</span>
            {notificationUtils.getUnreadCount(jobPostNotifications) > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {notificationUtils.getUnreadCount(jobPostNotifications)}
              </span>
            )}
          </div>
          {activeTab === 'jobpost' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-4 sm:py-6 px-4 sm:px-8 text-center font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 relative ${
            activeTab === 'applications'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs sm:text-sm md:text-base">Applications</span>
            {notificationUtils.getUnreadCount(applicationNotifications) > 0 && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {notificationUtils.getUnreadCount(applicationNotifications)}
              </span>
            )}
          </div>
          {activeTab === 'applications' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
          )}
        </button>
      </nav>
    </div>
  );
};

export default NotificationTabs;