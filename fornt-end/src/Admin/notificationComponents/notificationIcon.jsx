import React from 'react';
import { AlertCircle, CheckCircle2, FileText, Clock } from 'lucide-react';

const NotificationIcon = ({ isRead }) => {
  const renderIcon = () => {
    if (isRead === false) {
      
      return <AlertCircle className="text-orange-500 w-5 h-5" />;
    } else if (isRead === true) {
      
      return <CheckCircle2 className="text-green-500 w-5 h-5" />;
    } else {
      
      return <FileText className="text-gray-500 w-5 h-5" />;
    }
  };

  const getBackgroundColor = () => {
    if (isRead === false) {
      return 'bg-orange-50 border border-orange-200';
    } else if (isRead === true) {
      return 'bg-green-50 border border-green-200';
    } else {
      return 'bg-gray-50 border border-gray-200';
    }
  };

  return (
    <div className={`mr-4 p-2 rounded-lg shadow-sm ${getBackgroundColor()}`}>
      {renderIcon()}
    </div>
  );
};

export default NotificationIcon;