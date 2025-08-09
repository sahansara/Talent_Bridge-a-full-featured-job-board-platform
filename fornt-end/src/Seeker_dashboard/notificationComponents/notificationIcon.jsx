
// src/components/NotificationIcon.js
import React from 'react';
import { CheckCircle, XCircle, FileText, Clock, UserCheck } from 'lucide-react';

const NotificationIcon = ({ type, status, activeTab }) => {
  if (activeTab === 'applications') {
    switch(status) {
      case 'Accepted':
        return <CheckCircle className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Rejected':
        return <XCircle className="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Under Review':
        return <Clock className="text-orange-600 w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Applied':
        return <UserCheck className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />;
      default:
        return <FileText className="text-gray-600 w-5 h-5 sm:w-6 sm:h-6" />;
    }
  }
  
  // Job post notifications
  switch(type) {
    case 'job_approved':
      return <CheckCircle className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />;
    case 'job_rejected':
      return <XCircle className="text-red-600 w-5 h-5 sm:w-6 sm:h-6" />;
    default:
      return <FileText className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />;
  }
};

export default NotificationIcon;