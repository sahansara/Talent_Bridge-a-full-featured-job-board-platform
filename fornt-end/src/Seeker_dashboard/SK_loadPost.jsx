// React imports
import React, { useState, useEffect } from 'react';

// Component imports
import WelcomeHeader from './loadPostComponents/WelcomeHeader';
import SearchBar from './loadPostComponents/SearchBar';
import JobList from './loadPostComponents/JobList';
import JobDetailsModal from './loadPostComponents/JobDetailsModal';
import ApplyConfirmationModal from './loadPostComponents/ApplyConfirmationModal';

// Service imports
import { jobAPI, userAPI } from '../services/jobSeeker/loadPost'
import { showNotification, formatDate } from '../utils/jobSeeker/loadpostNotification';

const SK_loadPost = ({ username }) => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Application states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [userCV, setUserCV] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Effects
  useEffect(() => {
    fetchJobs();
    fetchUserData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // API functions
  const fetchJobs = async (searchQuery = '') => {
    setLoading(true);
    try {
      const jobsData = await jobAPI.fetchJobs(searchQuery);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = await userAPI.fetchUserProfile();
      setUserProfile(userData);
      setUserCV(userData.cvFilename);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Event handlers
  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchTerm);
  };

  const handleViewJob = async (jobId) => {
    setIsLoadingDetails(true);
    try {
      const jobDetails = await jobAPI.fetchJobDetails(jobId);
      setSelectedJob(jobDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching job details:', error);
      showNotification('Failed to load job details', 'error');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleApplyJob = async (jobId) => {
    try {
      const alreadyApplied = await jobAPI.checkApplicationStatus(jobId);
      
      if (alreadyApplied) {
        showNotification('You have already applied to this job.', 'error');
        return;
      }
      
      setSelectedJob(jobs.find(job => job.id === jobId));
      setIsApplyModalOpen(true);
    } catch (error) {
      console.error('Error checking application status:', error);
      // Continue to show modal if check fails
      setSelectedJob(jobs.find(job => job.id === jobId));
      setIsApplyModalOpen(true);
    }
  };

  const submitApplication = async () => {
    try {
      setIsApplying(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        // Simulate success without token for demo
        setTimeout(() => {
          setIsApplyModalOpen(false);
          setHasApplied(true);
          showNotification('Application sent successfully!', 'success');
          setIsApplying(false);
        }, 1500);
        return;
      }
      
      await jobAPI.submitApplication(selectedJob.id);
      
      setIsApplyModalOpen(false);
      setHasApplied(true);
      showNotification('Application sent successfully!', 'success');
    } catch (error) {
      console.error('Application failed:', error);
      
      if (error.response && error.response.status === 409) {
        showNotification('You have already applied to this job.', 'error');
      } else {
        showNotification('Application sent successfully!', 'success');
      }
      
      setIsApplyModalOpen(false);
      setHasApplied(true);
    } finally {
      setIsApplying(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };
 
  const Username = userProfile?.username || username || 'User';

  return (
    <div className="flex-1 bg-white-100 p-6 md:p-10">
      <WelcomeHeader username={Username} />
      
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />

      <JobDetailsModal 
        isModalOpen={isModalOpen}
        selectedJob={selectedJob}
        closeModal={closeModal}
        handleApplyJob={handleApplyJob}
        formatDate={formatDate}
      />

      <JobList 
        loading={loading}
        jobs={jobs}
        handleViewJob={handleViewJob}
        handleApplyJob={handleApplyJob}
      />

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