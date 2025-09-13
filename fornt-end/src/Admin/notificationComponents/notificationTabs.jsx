import React from 'react';
import { FileText, Shield } from 'lucide-react';
import { getUnreadCount } from '../../utils/employer/mainNotification';

const NavigationTabs = ({ 
  activeTab, 
  setActiveTab, 
  jobPostNotifications, 
}) => {
 
  const getAdminUnreadCount = (notifications) => {
    return notifications.filter(notification => !notification.isRead).length;
  };

  return (
    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
      <nav className="flex space-x-0">
        <button
          onClick={() => setActiveTab('jobpost')}
          className={`flex-1 py-4 sm:py-6 px-4 sm:px-8 text-center font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 relative ${
            activeTab === 'jobpost'
              ? 'text-blue-600 bg-white shadow-lg'
              : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center justify-center space-x-3">
            <Shield className="w-6 h-6" />
            <span>Job Approvals</span>
            {getAdminUnreadCount(jobPostNotifications) > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse shadow-lg">
                {getAdminUnreadCount(jobPostNotifications)}
              </span>
            )}
          </div>
        </button>
      </nav>
    </div>
  );
};

export default NavigationTabs;