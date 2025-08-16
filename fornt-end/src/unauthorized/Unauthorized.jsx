// pages/Unauthorized.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContexts.jsx';

const Unauthorized = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'employer') {
      navigate('/Employer_dashboard');
    } else if (user?.role === 'jobseeker') {
      navigate('/job-seeker/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-6xl font-bold text-red-500">403</h2>
          <h3 className="text-2xl font-semibold text-gray-900 mt-4">
            Access Denied
          </h3>
          <p className="mt-2 text-gray-600">
            You don't have permission to access this page.
          </p>
          {user && (
            <p className="mt-1 text-sm text-gray-500">
              Current role: <span className="font-medium">{user.role}</span>
            </p>
          )}
        </div>
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoHome}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => {
              logout();
              navigate('/User_login');
            }}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Login as Different User
          </button>
          
          <Link
            to="/"
            className="text-blue-500 hover:text-blue-600 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;