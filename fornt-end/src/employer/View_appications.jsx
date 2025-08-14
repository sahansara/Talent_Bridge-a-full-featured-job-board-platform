import React, { useState, useEffect } from 'react';

// Components
import HeaderSection from './appicationComponets/headerSection';
import FilterSection from './appicationComponets/filterSection';
import JobPostCard from './appicationComponets/jobPostCard';
import ApplicationDetailsModal from './appicationComponets/appicationDetailsModel';
import CVViewerModal from './appicationComponets/cvviewerModal';
import { LoadingErrorDisplay, EmptyState } from './appicationComponets/loadingErrorDisplay';

// Services
import { applicationApiService } from '../services/employer/viewAppication';
// Utils
import { applicationUtils, MOCK_JOB_POSTS } from '../utils/employer/viewAppication';

const View_applications = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobPosts, setJobPosts] = useState(MOCK_JOB_POSTS);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  // Modal states
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [expandedJobs, setExpandedJobs] = useState(new Set([1, 2, 3]));
  const [cvLoadError, setCvLoadError] = useState(false);

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // API Functions
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedJobPosts = await applicationApiService.fetchApplications();
      setJobPosts(fetchedJobPosts);
    } catch (error) {
      console.error('Error fetching applications:', error);
      console.error('Error response:', error.response);
      
      // Check if it's a network error or API not found
      if (error.message.includes('API endpoint not found')) {
        setError('API endpoint not found. Please check the backend URL and endpoint.');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server. Please check if backend is running.');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch applications';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Status update handler
  const handleUpdateApplicationStatus = async (jobId, applicationId, newStatus) => {
    try {
      await applicationApiService.updateApplicationStatus(applicationId, newStatus);

      // Update local state
      setJobPosts(prev => prev.map(job => 
        job.id === jobId 
          ? {
              ...job,
              applications: job.applications.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
              )
            }
          : job
      ));

      // Update selected application if it's currently selected
      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication({...selectedApplication, status: newStatus});
      }
      
      console.log(`Successfully updated application ${applicationId} status to ${newStatus}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      
      // Better error handling with user feedback
      if (error.response?.status === 404) {
        alert('API endpoint not found. Please check if the backend server is running and the endpoint exists.');
      } else if (error.code === 'ERR_NETWORK') {
        alert('Cannot connect to backend server. Please check if backend is running on port 3000.');
      } else {
        alert(`Failed to update application status: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Notes update handler
  const handleUpdateApplicationNotes = async (jobId, applicationId, notes) => {
    try {
      await applicationApiService.updateApplicationNotes(applicationId, notes);

      // Update local state
      setJobPosts(prev => prev.map(job => 
        job.id === jobId 
          ? {
              ...job,
              applications: job.applications.map(app =>
                app.id === applicationId ? { ...app, notes } : app
              )
            }
          : job
      ));

      // Update selected application if it's currently selected
      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication({...selectedApplication, notes});
      }
    } catch (error) {
      console.error('Error updating application notes:', error);
      alert('Failed to update notes. Please try again.');
    }
  };

  // CV handlers
  const handleCVDownload = async (cvUrl) => {
    try {
      await applicationUtils.handleCVDownload(cvUrl, applicationApiService.downloadCV);
    } catch (error) {
      alert('Failed to download CV. Please try again.');
    }
  };

  const openCVPreview = (cvUrl) => {
    if (!cvUrl) {
      alert('No CV available');
      return;
    }
    
    const previewUrl = applicationApiService.getCVPreviewUrl(cvUrl);
    console.log('Opening CV Preview:');
    console.log('Original CV URL:', cvUrl);
    console.log('Preview URL:', previewUrl);
    
    setSelectedCV(previewUrl);
    setCvLoadError(false);
    setShowCVModal(true);
  };

  // UI Handlers
  const toggleJobExpansion = (jobId) => {
    setExpandedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const closeCVModal = () => {
    setShowCVModal(false);
    setSelectedCV(null);
    setCvLoadError(false);
  };

  const closeApplicationModal = () => {
    setSelectedApplication(null);
  };

  // Filter data
  const filters = {
    categoryFilter,
    jobFilter,
    searchTerm,
    statusFilter,
    dateFilter
  };

  const filteredJobPosts = applicationUtils.filterJobPosts(jobPosts, filters);
  const totalApplications = applicationUtils.getTotalApplications(filteredJobPosts);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <HeaderSection 
          filteredJobPosts={filteredJobPosts}
          totalApplications={totalApplications}
        />

        {/* Filters */}
        <FilterSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          jobFilter={jobFilter}
          setJobFilter={setJobFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        {/* Loading/Error Display */}
        <LoadingErrorDisplay loading={loading} error={error} />

        {/* Job Posts and Applications */}
        {!loading && !error && (
          <div className="space-y-6">
            {filteredJobPosts.length > 0 ? (
              filteredJobPosts.map(job => (
                <JobPostCard
                  key={job.id}
                  job={job}
                  expandedJobs={expandedJobs}
                  toggleJobExpansion={toggleJobExpansion}
                  onViewDetails={setSelectedApplication}
                  onCVPreview={openCVPreview}
                  onCVDownload={handleCVDownload}
                  onUpdateStatus={handleUpdateApplicationStatus}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        )}

        {/* Application Details Modal */}
        <ApplicationDetailsModal
          selectedApplication={selectedApplication}
          onClose={closeApplicationModal}
          onUpdateStatus={handleUpdateApplicationStatus}
          onUpdateNotes={handleUpdateApplicationNotes}
          onCVPreview={openCVPreview}
          onCVDownload={handleCVDownload}
          jobPosts={jobPosts}
        />

        {/* CV Viewer Modal */}
        <CVViewerModal
          showCVModal={showCVModal}
          selectedCV={selectedCV}
          selectedApplication={selectedApplication}
          cvLoadError={cvLoadError}
          setCvLoadError={setCvLoadError}
          onClose={closeCVModal}
          onCVDownload={handleCVDownload}
        />
      </div>
    </div>
  );
};

export default View_applications;