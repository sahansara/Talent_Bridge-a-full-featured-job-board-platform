import React from 'react';

const NotificationHeader = () => {
  return (
    
  <div className="mb-6 bg-white rounded-2xl p-8 shadow-xl border-l-8 ">
  <div className="flex items-center mb-4">
    <div className="text-center w-3 h-12 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full mr-4"></div>
    <div>
      <h1 className=" text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2 py-1">
            Notification Center
          </h1>
      <p className="text-gray-600 text-lg font-medium">
            Stay updated with your latest job posts and applications
          </p>
        </div>
        </div>
        </div>
  );
};

export default NotificationHeader;