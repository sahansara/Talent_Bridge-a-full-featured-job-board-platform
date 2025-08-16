// components/auth/LoginRedirect.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './authContexts';

const LoginRedirect = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we're on login page or home page and user is authenticated
    if (!loading && isAuthenticated && (location.pathname === '/User_login' || location.pathname === '/')) {
      redirectToDashboard();
    }
  }, [isAuthenticated, loading, location.pathname, user]);

  const redirectToDashboard = () => {
    try {
      // Redirect based on user role
      if (user?.role === 'Admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user?.role === 'employer') {
        navigate('/employer/dashboard', { replace: true });
      } else if (user?.role === 'jobseeker') {
        navigate('/jobseeker/dashboard', { replace: true });
      } else {
        // Default dashboard if role is not specified
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Redirect error:', error);
      // Fallback to default dashboard
      navigate('/dashboard', { replace: true });
    }
  };

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated and on login page or home page, don't render content
  if (isAuthenticated && (location.pathname === '/User_login' || location.pathname === '/')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Render the content if user is not authenticated or on other pages
  return children;
};

export default LoginRedirect;