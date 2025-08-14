// src/components/StatusIcon.js
import React from 'react';
import { Clock, Calendar, CheckCircle, X, AlertCircle } from 'lucide-react';

const StatusIcon = ({ status, size = 18 }) => {
  switch (status.toLowerCase()) {
    case 'under review':
      return <Clock className="text-yellow-500" size={size} />;
    case 'applied':
      return <Calendar className="text-blue-500" size={size} />;
    case 'accepted':
      return <CheckCircle className="text-green-500" size={size} />;
    case 'rejected':
      return <X className="text-red-500" size={size} />;
    default:
      return <AlertCircle className="text-gray-500" size={size} />;
  }
};

export default StatusIcon;