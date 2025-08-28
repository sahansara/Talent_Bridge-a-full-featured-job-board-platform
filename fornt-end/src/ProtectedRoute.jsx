// ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../src/contexts/authContexts.jsx';
import AccessDenied from './shared/Components/accessDenied.jsx';

const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated - with refresh
  if (!isAuthenticated) {
    console.log('User is not authenticated, redirecting to login');
    // Force page refresh and redirect to login
    window.location.href = `/User_login?redirect=${encodeURIComponent(location.pathname)}&t=${Date.now()}`;
    return null;
  }

  // Check for specific role requirement
  if (requiredRole && user?.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    console.log(`User role ${user?.role} does not match required role ${requiredRole}`);
    console.log(user.role);
    
    return <AccessDenied requiredRole={requiredRole} />;
  }

  // Check for multiple allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log(`User role ${user?.role} is not in allowed roles: ${allowedRoles.join(', ')}`);
    
    window.location.href = `/unauthorized?t=${Date.now()}`;
    return null;
  }

  return children;
};

export default ProtectedRoute;