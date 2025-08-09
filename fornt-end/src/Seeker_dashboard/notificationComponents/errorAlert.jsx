
// src/components/ErrorAlert.js
import React from 'react';
import { XCircle } from 'lucide-react';

const ErrorAlert = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 p-3 sm:p-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center">
          <XCircle className="text-red-500 w-5 h-5 mr-3 flex-shrink-0" />
          <span className="text-red-700 font-medium text-sm sm:text-base">{error}</span>
        </div>
        <button 
          onClick={onRetry} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base self-start sm:ml-auto"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;