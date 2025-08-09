// src/shared/components/Dashboard.js
import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import MobileHeader from './sideBar/MobileHeader';
import Sidebar from './sideBar/sideBar';
import useMobileMenu from '../hooks/useMobileMenu';
import useUserData from '../hooks/useUserData';
import { logout } from '../services/authService';

const Dashboard = ({ config }) => {
  const navigate = useNavigate();
  const { userData, isLoading, error } = useUserData(config);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  const handleLogout = () => logout(config, navigate);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <MobileHeader 
        config={config}
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />

      {/* Sidebar Overlay on Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <Sidebar 
        config={config}
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={closeMobileMenu}
        userData={userData}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:ml-72 mt-16 lg:mt-0 min-w-0">
        <Outlet context={{ userData: userData }} />
      </div>
    </div>
  );
};

export default Dashboard;