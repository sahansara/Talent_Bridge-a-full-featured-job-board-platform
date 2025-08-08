// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-600 font-medium text-sm sm:text-base">Loading notifications...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;