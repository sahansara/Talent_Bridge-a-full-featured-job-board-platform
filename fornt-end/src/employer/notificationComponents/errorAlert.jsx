import React from 'react';
import { XCircle } from 'lucide-react';

const ErrorAlert = ({ error, onRetry }) => {
  return (
    <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-md">
      <div className="flex items-center">
        <XCircle className="text-red-400 w-5 h-5 mr-3" />
        <span className="text-red-700 font-medium">{error}</span>
        <button 
          onClick={onRetry} 
          className="ml-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;