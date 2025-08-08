import React, { useState, useEffect } from 'react';

// Import components
import PostHeader from './PostComponents/PostHeader';
import PostList from './PostComponents/postList';
import PostDetailsModal from './PostComponents/PostDetailsModal';
import NotificationAlert from './PostComponents/notificationAlert';

// Import services and utils
import postApiService from '../services/Admin/Manage_Post';
import postValidationUtils from '../utils/Admin/PostValidation';

const Manage_post = () => {
  // State for job posts with different statuses
  const [jobPosts, setJobPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // States for filtering and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  
  // State for displaying success/error messages
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch job posts on component mount and when filter status changes
  useEffect(() => {
    fetchJobPosts();
  }, [filterStatus]);

  // Filter jobs whenever search term changes
  useEffect(() => {
    const filtered = postValidationUtils.filterJobsBySearch(jobPosts, searchTerm);
    setFilteredPosts(filtered);
  }, [searchTerm, jobPosts]);

  // Function to fetch job posts from API
  const fetchJobPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const posts = await postApiService.fetchJobPosts(filterStatus);
      setJobPosts(posts);
    } catch (err) {
      console.error('Error fetching job posts:', err);
      setError('Failed to load job posts. Please try again later.');
      
      
    } finally {
      setIsLoading(false);
    }
  };

  // Function to approve a job post
  const handleApprove = async (jobId) => {
    try {
      // Find the job post to get the MongoDB _id
      const jobToApprove = postValidationUtils.findJobById(jobPosts, jobId);
      
      if (!jobToApprove) {
        showNotification('Job post not found', 'error');
        return;
      }
      
      // Use the MongoDB _id for the API call
      const mongoId = postValidationUtils.getMongoId(jobToApprove);

      await postApiService.approveJobPost(mongoId);
      
      // Update local state after successful API call
      const updatedPosts = postValidationUtils.removeJobById(jobPosts, jobId);
      setJobPosts(updatedPosts);
      
      // Show success notification
      showNotification('Job post approved successfully', 'success');
      
    } catch (err) {
      console.error('Error approving job post:', err);
      showNotification('Failed to approve job post', 'error');
      
      // For demo purposes - remove in production
      const updatedPosts = postValidationUtils.removeJobById(jobPosts, jobId);
      setJobPosts(updatedPosts);
    }
  };

  // Function to reject a job post
  const handleReject = async (jobId) => {
    try {
      // Find the job post to get the MongoDB _id
      const jobToReject = postValidationUtils.findJobById(jobPosts, jobId);
      
      if (!jobToReject) {
        showNotification('Job post not found', 'error');
        return;
      }
      
      // Use the MongoDB _id for the API call
      const mongoId = postValidationUtils.getMongoId(jobToReject);
      
      await postApiService.rejectJobPost(mongoId);
      
      // Update local state after successful API call
      const updatedPosts = postValidationUtils.removeJobById(jobPosts, jobId);
      setJobPosts(updatedPosts);
      
      // Show success notification
      showNotification('Job post rejected', 'success');
      
    } catch (err) {
      console.error('Error rejecting job post:', err);
      showNotification('Failed to reject job post', 'error');
      
      
    }
  };

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

  // Function to view job details
  const handleViewDetails = async (jobId) => {
    setIsLoadingDetails(true);
    try {
      const jobDetails = await postApiService.getJobDetails(jobId);
      setSelectedJob(jobDetails);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching job details:', err);
      showNotification('Failed to load job details', 'error');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  // Handler functions for child components
  const handleFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };



  return (
    <div className="w-full p-6 bg-gray-50 ">
      {/* Page Header with filters and search */}
      <PostHeader
        filterStatus={filterStatus}
        onFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        totalPost={filteredPosts.length} 

      />

      {/* Job Details Modal */}
      <PostDetailsModal
        isOpen={isModalOpen}
        job={selectedJob}
        onClose={closeModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    
      {/* Notification */}
      <NotificationAlert notification={notification} />

      {/* Job Posts List */}
      <PostList
        posts={filteredPosts}
        isLoading={isLoading}
        error={error}
        onViewDetails={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default Manage_post;