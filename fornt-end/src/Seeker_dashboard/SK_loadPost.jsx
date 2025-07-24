import React, { useState, useEffect } from 'react';
import axios from 'axios';


const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1113.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ApplyConfirmationModal = ({ isOpen, onClose, selectedJob, userProfile, userCV, onApply, isApplying }) => {
  
  
  useEffect(() => {
  if (isOpen) {
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
  } else {
    // Restore scrolling
    document.body.style.overflow = 'unset';
  }

  // Cleanup function to restore scrolling when component unmounts
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [isOpen]);
  if (!isOpen || !selectedJob) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-8 py-6">
          <h3 className="text-3xl font-bold text-gray-800">Confirm Application</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transform hover:scale-110 transition-transform"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="px-8 py-6">
          {/* Job Information Section */}
          <div className="mb-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h4 className="text-xl font-bold text-blue-800 mb-3">Job Details</h4>
            <p className="text-lg text-gray-700 mb-4">
              You are applying for: <span className="font-semibold text-blue-700">{selectedJob.title}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Company:</p>
                <p className="font-medium text-gray-800">{selectedJob.company}</p>
              </div>
              {selectedJob.location && (
                <div>
                  <p className="text-gray-600 mb-1">Location:</p>
                  <p className="font-medium text-gray-800">{selectedJob.location}</p>
                </div>
              )}
              {selectedJob.salary && (
                <div>
                  <p className="text-gray-600 mb-1">Salary Range:</p>
                  <p className="font-medium text-gray-800">{selectedJob.salary}</p>
                </div>
              )}
              {selectedJob.jobType && (
                <div>
                  <p className="text-gray-600 mb-1">Job Type:</p>
                  <p className="font-medium text-gray-800">{selectedJob.jobType}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* User Profile Summary */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Your Profile Summary</h4>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {userProfile?.profileImage ? (
                <img 
                  src={userProfile.profileImage.startsWith('/profile-images/') ?
                      `/api/placeholder/96/96` : 
                      (userProfile.profileImage.startsWith('http') ? 
                        userProfile.profileImage : 
                        `http://localhost:3000/${userProfile.profileImage}`)} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                  <span className="text-3xl font-bold text-blue-500">
                    {(userProfile?.username || "U").charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-xl font-semibold">{userProfile?.username || "User"}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">{userProfile?.email || "No email provided"}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="text-gray-600">{userProfile?.phone || "No phone provided"}</p>
                  </div>
                </div>
                {userProfile?.skills && userProfile.skills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* CV Preview Section */}
          <div className="mb-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Your CV</h4>
            {userCV ? (
              <div className="border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center md:justify-between space-y-4 md:space-y-0 bg-gray-50">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-lg">{userCV.split('/').pop() || "Your CV"}</p>
                    <p className="text-sm text-gray-500">PDF Document</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (userCV.startsWith('/documents/')) {
                      alert('CV Preview: This is a dummy CV file for UI testing');
                    } else {
                      window.open(userCV.startsWith('http') ? userCV : `http://localhost:3000/${userCV}`, '_blank');
                    }
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview CV
                </button>
              </div>
            ) : (
              <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50 text-yellow-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-lg">No CV uploaded</p>
                  <p className="text-sm">Please upload your CV in your profile before applying.</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Privacy Note Section */}
          <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Privacy Notice</h4>
            <p className="text-gray-600">
              By clicking "Yes, Apply", your CV and profile information will be sent to {selectedJob.company}. 
              The company will use your information for the hiring process according to their privacy policy.
            </p>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-8 py-6 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onApply}
            disabled={isApplying || !userCV}
            className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center ${
              !userCV ? 
              'bg-gray-300 text-gray-500 cursor-not-allowed' : 
              'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 hover:shadow-md'
            }`}
          >
            {isApplying ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Applying...</span>
              </>
            ) : (
              <>
                <span>Yes, Apply</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Change the function declaration to use proper React props
const SK_loadPost = ({fullName}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);
  
  

  // application state open model
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [userCV, setUserCV] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);


  useEffect(() => {
    // Fetch all jobs initially
    fetchJobs();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const fetchJobs = async (searchQuery = '') => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`http://localhost:3000/api/job-seeker/jobs${searchQuery ? `?search=${searchQuery}` : ''}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    setJobs(response.data);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Fallback data for demonstration
    setJobs([
      {
        id: '1',
        title: 'Software Engineer',
        company: 'Tech Solutions',
        location: 'Colombo',
        salary: '$100,000 per year',
        logo: '/images/tech-solutions.jpg'
      },
      {
        id: '2',
        title: 'Marketing Coordinator',
        company: 'Creative Agency',
        location: 'Kandy',
        salary: '$55,000 per year',
        logo: '/images/creative-agency.jpg'
      },
      {
        id: '3',
        title: 'Sales Representative',
        company: 'Innovate Inc.',
        location: 'Galle',
        salary: '$75,000 per year',
        logo: '/images/innovate-inc.jpg'
      },
      {
        id: '4',
        title: 'Product Designer',
        company: 'Design Studio',
        location: 'Colombo',
        salary: '$85,000 per year',
        logo: '/images/design-studio.jpg'
      }
    ]);
  } finally {
    setLoading(false);
  }
};

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchTerm);
  };


const dummyUserProfile = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+94 77 123 4567",
  profileImage: "/images/profile-dummy.jpg"
};

const dummyCV = "/documents/john-doe-cv.pdf";


  const handleViewJob = async (jobId) => {
  setIsLoadingDetails(true);
  try {
    const response = await axios.get(`http://localhost:3000/api/job-seeker/job/${jobId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    setSelectedJob(response.data);
    setIsModalOpen(true);
  } catch (err) {
    console.error('Error fetching job details:', err);
    showNotification('Failed to load job details', 'error');
  } finally {
    setIsLoadingDetails(false);
  }
};

  // Add a function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleApplyJob = async (jobId) => {
  // First check if already applied
  const alreadyApplied = await checkApplicationStatus(jobId);
  
  if (alreadyApplied) {
    // Show message that user already applied
    showNotification('You have already applied to this job.', 'error');
    return;
  }
  
  // If not applied, show the confirmation modal
  setSelectedJob(jobs.find(job => job.id === jobId));
  setIsApplyModalOpen(true);
};

// Function to submit application after confirmation
const submitApplication = async () => {
  try {
    setIsApplying(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      // Simulate success with dummy data
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setHasApplied(true);
        showNotification('Application sent successfully!', 'success');
        setIsApplying(false);
      }, 1500);
      return;
    }
    
   await axios.post('http://localhost:3000/api/job-seeker/applications', 
      { jobId: selectedJob.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    setIsApplyModalOpen(false);
    setHasApplied(true);
    showNotification('Application sent successfully!', 'success');
  } catch (error) {
    console.error('Application failed:', error);
     // Check if it's a duplicate application error
    if (error.response && error.response.status === 409) {
      showNotification('You have already applied to this job.', 'error');
    } else {
      // Simulate success even on error for UI testing
      showNotification('Application sent successfully! (Using dummy data)', 'success');
    }
    setIsApplyModalOpen(false);
    setHasApplied(true);
  } finally {
    setIsApplying(false);
  }
};


  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUserProfile(dummyUserProfile);
        setUserCV(dummyCV);
        return;
      }
      
      const response = await axios.get('http://localhost:3000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      
      setUserProfile({
        username: response.data.username,
        email: response.data.email || dummyUserProfile.email,
        profileImage: response.data.profileImage
      });
      setUserCV(response.data.cvFilename || dummyCV);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Use dummy data on error
      setUserProfile(dummyUserProfile);
      setUserCV(dummyCV);
    }
  };
  
  fetchUserData();
}, []);

// Function to check if user already applied
const checkApplicationStatus = async (jobId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const response = await axios.get(`http://localhost:3000/api/job-seeker/applications?jobId=${jobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
   // Backend returns array, check if it has items
    return response.data && response.data.length > 0;
  } catch (error) {
    console.error('Error checking application status:', error);
    return false; // Always return false so modal shows
  }
};


  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show notification function
  const showNotification = (message, type = 'info') => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white transition-opacity duration-300`;
    
    toast.style.opacity = '0';
    toast.textContent = message;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Fade in
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };


  return (
   <div className="flex-1 bg-white-100 p-6 md:p-10">
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">Welcome, {fullName || 'User'}</h1>
    </div>
    
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Jobs</h1>
    
    {/* Search Bar */}
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 hover:shadow-lg hover:shadow-blue-200 transition-shadow duration-300">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for jobs..."
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 shadow-sm hover:shadow-blue-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md hover:shadow-blue-300 flex items-center justify-center"
        >
          <span>Search</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
   
    {/* Job Details Modal */}
    {isModalOpen && selectedJob && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
            <h3 className="text-2xl font-bold text-gray-800">Job Details</h3>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="px-6 py-4">
            {/* Job Header */}
            <div className="flex items-center mb-6">
              {selectedJob.logo ? (
                <div className="h-20 w-20 rounded-lg overflow-hidden mr-4 bg-gray-100">
                  <img 
                    src={
                      selectedJob.logo.startsWith('http') ? selectedJob.logo : `http://localhost:3000/${selectedJob.logo}`
                    } 
                    alt="Company logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-3xl font-bold text-blue-500">
                    {(selectedJob.company || selectedJob.title || "J").charAt(0)}
                  </span>
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h1>
                <p className="text-lg text-gray-600">{selectedJob.company || "Company not specified"}</p>
              </div>
            </div>
            
            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Location</h4>
                <p className="text-gray-800">{selectedJob.location || "Not specified"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Job Type</h4>
                <p className="text-gray-800">{selectedJob.jobType || "Not specified"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Salary</h4>
                <p className="text-gray-800">{selectedJob.salary || "Not specified"}</p>
              </div>
            </div>
            
            {/* Posted Date */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Posted Date</h4>
              <p className="text-gray-800">{selectedJob.approvedAt ? formatDate(selectedJob.approvedAt) : "Not available"}</p>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h4>
              <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                {selectedJob.description ? (
                  <p>{selectedJob.description}</p>
                ) : (
                  <p className="italic text-gray-500">No description provided</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-4">
            <button
              onClick={() => handleApplyJob(selectedJob.id)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md font-medium flex items-center justify-center"
            >
              <span>Apply</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
            
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Job Listings */}
    {loading ? (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : (
      <div className="space-y-6">
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-blue-100">
            <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-start md:items-center space-x-4 mb-4 md:mb-0">
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                  {job.logo ? (
                    <img 
                      src={job.logo.startsWith('http') ? job.logo : `http://localhost:3000/${job.logo}`} 
                      alt={`${job.company} logo`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200">{job.title}</h2>
                  <p className="text-gray-600 hover:text-gray-800 transition-colors duration-200">{job.company}</p>
                  <div className="flex items-center mt-1 text-gray-500">
                    <LocationIcon />
                    <span className="ml-1 text-sm">{job.location}</span>
                  </div>
                  <div className="mt-2 inline-block px-3 py-1 bg-green-50 text-green-600 font-medium rounded-full">{job.salary}</div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  onClick={() => handleViewJob(job.id)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center justify-center"
                >
                  <span>View</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleApplyJob(job.id)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md font-medium flex items-center justify-center"
                >
                  <span>Apply</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {jobs.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
          </div>
        )}
      </div>
    )}

    {/*apply model*/}

   


      <ApplyConfirmationModal 
      isOpen={isApplyModalOpen}
      onClose={() => setIsApplyModalOpen(false)}
      selectedJob={selectedJob}
      userProfile={userProfile}
      userCV={userCV}
      onApply={submitApplication}
      isApplying={isApplying}
    />
  
    </div>
  );
};


export default SK_loadPost;