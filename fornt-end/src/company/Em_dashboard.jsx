import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Outlet } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';








// Icons
const JobListings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17H7a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v2m4.5 11a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM20 20l-1.5-1.5" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A6 6 0 0112 14a6 6 0 016.879 3.804M12 12a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);

const NotificationIcon = () => ( 
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m4-13H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2zM4 7v11a2 2 0 002 2h12a2 2 0 002-2V7H4z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// dashboard component
// This component is responsible for rendering the employer dashboard, including the job posting form and job listings.

const Em_dashboard = () => {
  const [userData, setUserData] = useState({
    companyName: '',
    comDescription: '',
    companyImage: null,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  // Get the current path
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Fetch user data from API profile endpoint
  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // You would replace this with your actual API endpoint
      const response = await axios.get('http://localhost:3000/api/Company/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUserData({
        companyName: response.data.companyName || 'User',
        comDescription: response.data.comDescription || 'No description available',
        companyImage: response.data.companyImage || null,
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
      
      // For demo purposes, set default values if API fails
      setUserData({
        companyName: 'Nadun',
        comDescription: 'Default description',
        companyImage: null,
      });
      
      setIsLoading(false);
      
      // If the error is due to authentication, redirect to login
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/User_login');
      }
    }
  };

  // Call fetchUserData when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      await axios.post('http://localhost:3000/api/Company/Employer/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Clear local storage
      localStorage.removeItem('token');
      
      // Redirect to login page
      navigate('/User_login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API fails, clear token and redirect
      localStorage.removeItem('token');
      navigate('/User_login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#172A3D] text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <DashboardIcon />
          <span className="text-xl font-bold">Employer</span>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`
          bg-[#172A3D] text-white w-full md:w-64 flex-shrink-0 flex flex-col
          ${isMobileMenuOpen ? 'block' : 'hidden'} md:block
          transition-all duration-300 ease-in-out h-screen sticky top-0
        `}
      >
        <div className="p-6 flex items-center justify-center space-x-2 text-white">
          {/* Briefcase Icon for Employer */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M6 21V5a1 1 0 011-1h2a1 1 0 011 1v16M14 21V10a1 1 0 011-1h2a1 1 0 011 1v11M9 10h.01M9 14h.01M15 14h.01" />
          </svg>
          <span className="text-2xl font-bold">Employer</span>
        </div>

        <nav className="mt-8 border-t border-white-700">
          <div className="px-6 py-5">
            
           <a href="/Employer_dashboard/Employer_jobpost" className={`flex items-center mt-4 py-3 px-4 rounded-lg hover:bg-[#21384D] transition-colors duration-200 ${isActive("/Employer_dashboard/Employer_jobpost") ? "bg-[#1e92ffcf]" : ""}`}>              
           <JobListings />
              <span className="ml-4">Job Listings</span>
            </a>

            

            
            <a href="/Employer_dashboard/View_appications" className={`flex items-center mt-4 py-3 px-4 rounded-lg hover:bg-[#21384D] transition-colors duration-200 ${isActive("/Employer_dashboard/View_appications") ? "bg-[#1e92ffcf]" : ""}`}>
              <ApplicationsIcon />
              <span className="ml-4">Applications</span>
            </a>

             <a href="/Employer_dashboard/Notifications" className={`flex items-center mt-4 py-3 px-4 rounded-lg hover:bg-[#21384D] transition-colors duration-200 ${isActive("/Employer_dashboard/Notifications") ? "bg-[#1e92ffcf]" : ""}`}>
              <NotificationIcon />
              <span className="ml-4">Notifications</span>
            </a>
            
            <a href="/Employer_dashboard/Employer_profile" className={`flex items-center mt-4 py-3 px-4 rounded-lg hover:bg-[#21384D] transition-colors duration-200 ${isActive("/Employer_dashboard/Employer_profile") ? "bg-[#1e92ffcf]" : ""}`}>
              <ProfileIcon />
              <span className="ml-4">Profile</span>
            </a>



            
          </div>
        </nav>

        <div className="absolute bottom-0 w-full md:w-64 p-6 border-t border-white-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-300">
              {userData.companyImage ? (
                <img 
                  src={userData.companyImage.startsWith('http') ? userData.companyImage : `http://localhost:3000/${userData.companyImage}`} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-500 text-white text-xl">
                  {userData.companyName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Employer</p>
              <p className="text-base font-semibold truncate">{userData.companyName}</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg hover:bg-red-700 bg-red-600 transition-colors duration-200"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">

        <Outlet />
       
    </div>
    </div>
  );
};

export default Em_dashboard;