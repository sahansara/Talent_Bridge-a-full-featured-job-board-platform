import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Manage_post = () => {
  // State for job posts with different statuses
  const [jobPosts, setJobPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add these new state variables at the top of your component
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  

  // States for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending'); // pending, approved, rejected
  
  // State for displaying success/error messages
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch job posts on component mount
  useEffect(() => {
    fetchJobPosts();
  }, [filterStatus]);

  // Filter jobs whenever search term changes
  useEffect(() => {
    filterJobs();
  }, [searchTerm, jobPosts]);

  // Function to fetch job posts from API
  const fetchJobPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/admin/job-posts?status=${filterStatus}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Ensure each job post has a consistent identifier property
      const formattedJobs = (response.data.jobPosts || []).map(job => ({
        ...job,
        // Ensure we have a consistent id property that refers to the MongoDB _id
        id: job._id || job.id
      }));
      
      setJobPosts(formattedJobs);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching job posts:', err);
      setError('Failed to load job posts. Please try again later.');
      setIsLoading(false);
      
      // For demo purposes - remove in production
      setJobPosts([
        {
          _id: '1', // Adding _id field to match MongoDB format
          id: '1',
          title: 'Software Engineer',
          company: 'Tech Solutions',
          location: 'San Francisco, CA',
          salary: '$150,000 / year',
          logo: '/images/tech-logo.png',
          description: 'Looking for a skilled Software Engineer with 3+ years of experience in React and Node.js.',
          status: 'pending',
          createdAt: '2025-05-01T10:30:00',
          employerId: 'emp123',
          companyId: 'comp123' // Add companyId for consistency
        },
        {
          _id: '2', // Adding _id field to match MongoDB format
          id: '2',
          title: 'Marketing Coordinator',
          company: 'Creative Agency',
          location: 'New York, NY',
          salary: 'Negotiable',
          logo: '/images/creative-logo.png',
          description: 'Creative Agency seeking a dynamic Marketing Coordinator to lead our digital campaigns.',
          status: 'pending',
          createdAt: '2025-05-02T14:15:00',
          employerId: 'emp456',
          companyId: 'comp456' // Add companyId for consistency
        },
        {
          _id: '3', // Adding _id field to match MongoDB format
          id: '3',
          title: 'Sales Representative',
          company: 'Innovate Inc.',
          location: 'Toronto, ON',
          salary: '$60,000 / year',
          logo: '/images/innovate-logo.png',
          description: 'Looking for enthusiastic Sales Representatives to join our growing team.',
          status: 'pending',
          createdAt: '2025-05-03T09:45:00',
          employerId: 'emp789',
          companyId: 'comp789' // Add companyId for consistency
        }
      ]);
    }
  };

  // Function to filter jobs based on search term
  const filterJobs = () => {
    if (!searchTerm.trim()) {
      setFilteredPosts(jobPosts);
      return;
    }
  
    const filtered = jobPosts.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.companyName || job.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.province || job.location || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredPosts(filtered);
  };

  // Function to approve a job post
  const handleApprove = async (jobId) => {
    try {
      // Find the job post to get the MongoDB _id
      const jobToApprove = jobPosts.find(job => job.id === jobId || job._id === jobId);
      
      if (!jobToApprove) {
        showNotification('Job post not found', 'error');
        return;
      }
      
      // Use the MongoDB _id for the API call
      const mongoId = jobToApprove._id || jobToApprove.id;

      await axios.put(`http://localhost:3000/api/admin/job-posts/${mongoId}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state after successful API call
      const updatedPosts = jobPosts.filter(job => (job.id !== jobId && job._id !== jobId));
      setJobPosts(updatedPosts);
      
      // Show success notification
      showNotification('Job post approved successfully', 'success');
      
      // No longer needed as the backend handles notifications
      // We'll remove this call to fix the 404 error
      // notifyEmployer(mongoId, 'approved');
      
    } catch (err) {
      console.error('Error approving job post:', err);
      showNotification('Failed to approve job post', 'error');
      
      // For demo purposes - remove in production
      const updatedPosts = jobPosts.filter(job => (job.id !== jobId && job._id !== jobId));
      setJobPosts(updatedPosts);
    }
  };

  // Function to reject a job post
  const handleReject = async (jobId) => {
    try {
      // Find the job post to get the MongoDB _id
      const jobToReject = jobPosts.find(job => job.id === jobId || job._id === jobId);
      
      if (!jobToReject) {
        showNotification('Job post not found', 'error');
        return;
      }
      
      // Use the MongoDB _id for the API call
      const mongoId = jobToReject._id || jobToReject.id;
      
      await axios.put(`http://localhost:3000/api/admin/job-posts/${mongoId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state after successful API call
      const updatedPosts = jobPosts.filter(job => (job.id !== jobId && job._id !== jobId));
      setJobPosts(updatedPosts);
      
      // Show success notification
      showNotification('Job post rejected', 'success');
      
      // No longer needed as the backend handles notifications
      // We'll remove this call to fix the 404 error
      // notifyEmployer(mongoId, 'rejected');
      
    } catch (err) {
      console.error('Error rejecting job post:', err);
      showNotification('Failed to reject job post', 'error');
      
      // For demo purposes - remove in production
      const updatedPosts = jobPosts.filter(job => (job.id !== jobId && job._id !== jobId));
      setJobPosts(updatedPosts);
    }
  };

  // Removed notifyEmployer function since the backend is already handling notifications
  // This was causing the 404 error

  // Function to show notification
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Function to view job details (would typically navigate to detail page or open modal)
  const handleViewDetails = async (jobId) => {
  setIsLoadingDetails(true);
  try {
    const response = await axios.get(`http://localhost:3000/api/admin/job-posts/${jobId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    setSelectedJob(response.data.jobPost);
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

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full p-6 bg-gray-50">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Manage Job Posts</h1>
        
        {/* Filters moved down 2 lines and centered */}
        <div className="mt-6 flex flex-col items-center">
          {/* Status Filter */}
          <div className="relative mb-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-blue-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="all">All</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
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
          {selectedJob.companyLogo || selectedJob.thumbnail ? (
            <div className="h-20 w-20 rounded-lg overflow-hidden mr-4 bg-gray-100">
              <img 
                src={
                  selectedJob.companyLogo 
                    ? `http://localhost:3000/${selectedJob.companyLogo}`
                    : selectedJob.thumbnail 
                      ? `http://localhost:3000/${selectedJob.thumbnail}` 
                      : '/placeholder-logo.png'
                } 
                alt="Company logo" 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
              <span className="text-3xl font-bold text-blue-500">
                {(selectedJob.companyName || selectedJob.title || "J").charAt(0)}
              </span>
            </div>
          )}
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h1>
            <p className="text-lg text-gray-600">{selectedJob.companyName || "Company not specified"}</p>
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
          
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Status</h4>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedJob.status === 'approved' ? 'bg-green-100 text-green-800' :
              selectedJob.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
            </span>
          </div>
        </div>
        
        {/* Posted Date */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Posted Date</h4>
          <p className="text-gray-800">{formatDate(selectedJob.createdAt)}</p>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h4>
          <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
            {selectedJob.description ? (
              <p>{selectedJob.description}</p>
            ) : (
              <p className="italic text-gray-500">No description provided</p>
            )}
          </div>
        </div>
        
        {/* Status Timeline */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Status Timeline</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500"></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Created</p>
                <p className="text-sm text-gray-500">{formatDate(selectedJob.createdAt)}</p>
              </div>
            </div>
            
            {selectedJob.approvedAt && (
              <div className="flex items-center">
                <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-500"></div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Approved</p>
                  <p className="text-sm text-gray-500">{formatDate(selectedJob.approvedAt)}</p>
                </div>
              </div>
            )}
            
            {selectedJob.rejectedAt && (
              <div className="flex items-center">
                <div className="flex-shrink-0 h-4 w-4 rounded-full bg-red-500"></div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Rejected</p>
                  <p className="text-sm text-gray-500">{formatDate(selectedJob.rejectedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal Footer */}
      <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-4">
        {selectedJob.status === 'pending' && (
          <>
            <button
              onClick={() => {
                handleApprove(selectedJob._id || selectedJob.id);
                closeModal();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Approve
            </button>
            
            <button
              onClick={() => {
                handleReject(selectedJob._id || selectedJob.id);
                closeModal();
              }}
              className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
            >
              Reject
            </button>
          </>
        )}
        
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
          {/* Search Bar with increased width */}
          <div className="relative mb-6 w-full max-w-2xl">
  <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-200 transition-shadow duration-300">
    <input
      type="text"
      placeholder="Search jobs..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="block w-full bg-white border border-gray-300 hover:border-blue-400 pl-4 pr-10 py-2 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <div className="absolute inset-y-0 right-6 flex items-center cursor-pointer">
      <svg
        className="w-5 h-5 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  </div>
</div>
        </div>
      </div>

    
      {/* Notification */}
      {notification.show && (
        <div className={`mb-4 p-4 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {notification.message}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && filteredPosts.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No job posts found with the current filters.</p>
        </div>
      )}

      {/* Job Posts List */}
{isLoading && (
  <div className="flex justify-center items-center h-40">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)}

{!isLoading && !error && filteredPosts.length > 0 && (
  <div className="grid grid-cols-1 gap-6">
    {filteredPosts.map(job => (
      <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-blue-100">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              {/* Job Title & Company */}
              <div className="flex items-start space-x-4">



                {/* Company Logo/Thumbnail */}
                <div className="h-16 w-16 flex-shrink-0 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                  {job.thumbnail ? (
                    <img
                      src={`http://localhost:3000/${job.thumbnail}`}
                      alt={`${job.title} thumbnail`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-3xl font-bold text-gray-500">
                      {job.title ? job.title.charAt(0) : "J"}
                    </div>
                  )}
                </div>

                {/* Job Info */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                  <p className="text-gray-600">{job.companyName || "Company info not available"}</p>
                  <div className="mt-2 flex flex-wrap gap-y-1">
                    <span className="mr-4 text-gray-700">
                      <i className="fas fa-map-marker-alt mr-1"></i> {job.location || ""}
                    </span>
                    <span className="text-gray-700">
                      <i className="fas fa-money-bill-wave mr-1"></i> {job.salary || ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mt-4">
                <p className="text-gray-600 line-clamp-2">{job.description}</p>
              </div>
              

               


              {/* Meta Info */}
              <div className="mt-4 text-sm text-gray-500">
                <p>Posted: {formatDate(job.createdAt)}</p>
              </div>
            </div>


            {/* Status Badge */}
              <div className="relative top-4 right-4 ">
                {job.status === 'pending' && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                )}
                {job.status === 'approved' && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Approved
                  </span>
                )}
                {job.status === 'rejected' && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Rejected
                  </span>
                )}
              </div>

            {/* Actions */}
            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col justify-between">
               <button
                onClick={() => handleViewDetails(job.id)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center justify-center"
              >
                <span>View</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

              <div className="flex flex-col space-y-2">
                <button
                onClick={() => handleApprove(job.id)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md font-medium flex items-center justify-center"
              >
                <span>Approve</span>
              </button>
                <button
                onClick={() => handleReject(job.id)}
                className="px-5 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <span>Reject</span>
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}

    </div>
  );
};

export default Manage_post;