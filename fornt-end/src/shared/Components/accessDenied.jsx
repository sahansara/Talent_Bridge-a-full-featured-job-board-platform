import React from 'react';
import { useAuth } from '../../contexts/authContexts';

const AccessDenied = ({ requiredRole = null }) => {
  const { user } = useAuth();

  const handleGoBack = () => {
    // Force refresh when going back
    if (window.history.length > 1) {
      window.history.back();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      window.location.href = `/?t=${Date.now()}`;
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>
        <div className="text-sm text-gray-500 mb-6">
          <p>Your role: <span className="font-semibold">{user?.role}</span></p>
          <p>Required role: <span className="font-semibold">{requiredRole}</span></p>
        </div>
        <div className="space-y-2">
          <button
            onClick={handleGoBack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors w-full"
          >
            Go Back
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;