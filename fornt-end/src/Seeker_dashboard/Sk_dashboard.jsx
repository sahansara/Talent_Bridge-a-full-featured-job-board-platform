import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate ,Outlet,useLocation } from 'react-router-dom';

// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const NotificationIcon = () => ( 
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Sk_dashboard = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    profileImage: null,
  });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
    // Get the current path
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  
  useEffect(() => {
    // Fetch user data when component mounts
    fetchUserData();
    
    
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUserData({
        fullName: response.data.fullName || 'User',
        profileImage: response.data.image || null,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // For demo purposes, set default values if API fails
      setUserData({
        fullName: 'nimak',
        profileImage: null,
      });
    }
  };

 
  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      await axios.post('http://localhost:3000/jobseeker/logout', {}, {
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#172A3D] text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <DashboardIcon />
          <span className="text-xl font-bold">Dashboard</span>
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
        <div className="p-6 flex items-center space-x-3">
          <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-2xl font-bold">Dashboard</span>
        </div>

        <nav className="mt-8  border-t  border-white-700">
          <div className="px-6 py-5">
            <a href="/job-seeker/dashboard/job-posts" className={`flex items-center mt-4 py-3 px-4 rounded-lg hover:bg-[#0c51ff] transition-colors duration-200 ${isActive("/job-seeker/dashboard/job-posts") ? "bg-[#0c51ffcf]" : ""}`}>
              <SearchIcon />
              <span className="ml-4">Search Jobs</span>
            </a>
            <a href="/job-seeker/dashboard/applied-jobs"className={`flex items-center mt-4 py-3 px-4 rounded-lg hover:bg-[#0c51ff] transition-colors duration-200 ${isActive("/job-seeker/dashboard/applied-jobs") ? "bg-[#0c51ffcf]" : ""}`}>
              <ApplicationsIcon />
              <span className="ml-4">Applications</span>
            </a>

              <a href="#" className={`flex items-center mt-4 py-3 px-4 rounded-lg hover:bg-[#0c51ff] transition-colors duration-200 ${isActive("#") ? "bg-[#0c51ffcf]" : ""}`}>
              <NotificationIcon />
              <span className="ml-4">Notifications</span>
            </a>


            <a href="/job-seeker/dashboard/profile" className={`flex items-center mt-4 py-3 px-4 rounded-lg hover:bg-[#0c51ff] transition-colors duration-200 ${isActive("/job-seeker/dashboard/profile") ? "bg-[#0c51ffcf] " : ""}`}>
              <ProfileIcon />
              <span className="ml-4">Profile</span>
            </a>


          </div>
        </nav>

        <div className="absolute bottom-0 w-full md:w-64 p-6  border-t border-white-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-300">
              {userData.profileImage ? (
                <img 
                  src={userData.profileImage.startsWith('http') ? userData.profileImage : `http://localhost:3000/${userData.profileImage}`} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-500 text-white text-xl">
                  {userData.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Job Seeker</p>
              <p className="text-base font-semibold truncate">{userData.fullName}</p>
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

     <Outlet context={{ userData: userData }} />
</div>

      
    
   
   </div>
  );
};

export default Sk_dashboard;