// Admin_dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Outlet } from 'react-router-dom';

// Icons
const JobSeeker = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
  </svg>
);

const Employers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 21V8a1 1 0 011-1h5V3h6v4h5a1 1 0 011 1v13h-4v-5h-4v5h-2v-5H7v5H3zM8 9H5v2h3V9zm0 4H5v2h3v-2zm0 4H5v2h3v-2zm6-8h-2v2h2V9zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2zm5-8h-3v2h3V9zm0 4h-3v2h3v-2zm0 4h-3v2h3v-2z" />
  </svg>
);

const JobPost = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 3H4a1 1 0 00-1 1v14a3 3 0 006 0h6a3 3 0 006 0V4a1 1 0 00-1-1zm-9 12H7v-2h4v2zm6-4H7V9h10v2zm0-4H7V5h10v2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm-7 8v-1c0-2.2 3.6-4 7-4s7 1.8 7 4v1H5zm15.94-5.34l.33-1.93-1.82-.96a6.98 6.98 0 00-.98-1.7l.54-1.91-1.71-.99-1.3 1.49a6.8 6.8 0 00-1.95 0L12.7 8.07l-1.71.99.54 1.91c-.39.53-.72 1.11-.98 1.7l-1.82.96.33 1.93 1.9.33c.19.64.48 1.25.84 1.8l-1.2 1.68 1.41 1.41 1.68-1.2c.55.36 1.16.65 1.8.84l.33 1.9 1.93-.33.96-1.82c.59-.26 1.17-.59 1.7-.98l1.91.54.99-1.71-1.49-1.3a6.8 6.8 0 000-1.95l1.49-1.3z" />
  </svg>
);

const Admin_dashboard = () => {
  const [userData, setUserData] = useState({
    Adminfullname: '',
    adminDescription: '',
    adminImage: null,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch counts data
  const fetchCountsData = useCallback(async () => {
    try {
      const [jobSeekersResponse, employersResponse, jobPostsResponse] = 
        await Promise.allSettled([
          axios.get('http://localhost:3000/api/admin/job-seekers', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://localhost:3000/api/admin/employers', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://localhost:3000/api/admin/job-posts', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

      if (jobSeekersResponse.status === 'fulfilled') 
        setJobSeekers(jobSeekersResponse.value.data || []);
      
      if (employersResponse.status === 'fulfilled')
        setEmployers(employersResponse.value.data || []);
      
      if (jobPostsResponse.status === 'fulfilled')
        setJobPosts(jobPostsResponse.value.data || []);
      
    } catch (error) {
      setError('Error fetching counts data');
      console.error('Error fetching counts data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUserData();
    // Fetch counts data
    fetchCountsData();
  }, [fetchCountsData]);

  const fetchUserData = async () => {
    try {
      // You would replace this with your actual API endpoint
      const response = await axios.get('http://localhost:3000/api/admin/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUserData({
        Adminfullname: response.data.Adminfullname || 'User',
        adminDescription: response.data.adminDescription || 'No description available',
        adminImage: response.data.adminImage || null,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // For demo purposes, set default values if API fails
      setUserData({
        Adminfullname: 'Nadun',
        adminImage: null,
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
        <div className="p-6 flex items-center justify-center space-x-2 text-white">
          {/* Briefcase Icon for Employer */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM2 20a8 8 0 0 1 16 0v1H2v-1zm18.4-4.2l1.2-.7-1-1.7-1.4.3a5.2 5.2 0 0 0-1.1-.6l-.2-1.5h-2l-.2 1.5a5.2 5.2 0 0 0-1.1.6l-1.4-.3-1 1.7 1.2.7c-.1.3-.1.6-.1.9s0 .6.1.9l-1.2.7 1 1.7 1.4-.3c.3.3.7.5 1.1.6l.2 1.5h2l.2-1.5c.4-.1.8-.3 1.1-.6l1.4.3 1-1.7-1.2-.7c.1-.3.1-.6.1-.9s0-.6-.1-.9zM19 18a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
          <span className="text-2xl font-bold">Admin Dashboard</span>
        </div>

        <nav className="mt-8 border-t border-white-700">
          <div className="px-6 py-5">
            {loading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">{error}</div>
            ) : (
              <>
                <a href="#" className="flex items-center py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 relative">
                  <JobSeeker />
                  <span className="ml-4">Job Seekers</span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-blue-700 rounded-full px-2 py-1 text-xs min-w-[30px] text-center">
                    {jobSeekers.length}
                  </span>
                </a>
                <a href="#" className="flex items-center mt-4 py-3 px-4 rounded-lg hover:bg-[#21384D] transition-colors duration-200 relative">
                  <Employers />
                  <span className="ml-4">Employers</span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-blue-700 rounded-full px-2 py-1 text-xs min-w-[30px] text-center">
                    {employers.length}
                  </span>
                </a>
                <a href="/admin/admin_dashboard/manage_post" className="flex items-center mt-4 py-3 px-4 rounded-lg hover:bg-[#21384D] transition-colors duration-200 relative">
                  <JobPost />
                  <span className="ml-4">Manage Job Post</span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-blue-700 rounded-full px-2 py-1 text-xs min-w-[30px] text-center">
                    {jobPosts.length}
                  </span>
                </a>
              </>
            )}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full md:w-64 p-6 border-t border-white-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-300">
              {userData.adminImage ? (
                <img 
                  src={userData.adminImage.startsWith('http') ? userData.adminImage : `http://localhost:3000/${userData.adminImage}`} 
                  alt="Profile" 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-500 text-white text-xl">
                  {userData.Adminfullname.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Admin</p>
              <p className="text-base font-semibold truncate">{userData.Adminfullname}</p>
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

      {/* Main Content - This will be replaced by the child routes */}
      <div className="flex-1 bg-[#ffffff] p-6 md:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin_dashboard;