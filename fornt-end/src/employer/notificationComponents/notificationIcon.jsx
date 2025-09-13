import React from 'react';
import { CheckCircle, XCircle, FileText, Users } from 'lucide-react';

const NotificationIcon = ({ type }) => {
  const renderIcon = () => {
    switch(type) {
      case 'job_approved':
        return <CheckCircle className="text-blue-500 w-6 h-6" />;
      case 'job_rejected':
        return <XCircle className="text-red-500 w-6 h-6" />;
      case 'new_application':
        return <Users className="text-blue-500 w-6 h-6" />;
      case 'notification_withdrawn':
        return <XCircle className="text-orange-500 w-6 h-6" />;
      default:
        return <FileText className="text-gray-500 w-6 h-6" />;
    }
  };

  return (
    <div className="mr-4 p-2 rounded-lg bg-white shadow-sm">
      {renderIcon()}
    </div>
  );
};

export default NotificationIcon;