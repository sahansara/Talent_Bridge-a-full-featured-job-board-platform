// src/AppliedJobs_Optimized.js
import React, { useState, useEffect } from 'react';

// Import components
import SearchAndSort from './appliedJobComponents.jsx/searchAndSort';
import ApplicationCard from './appliedJobComponents.jsx/applicationCard';
import EmptyApplicationsState from './appliedJobComponents.jsx/emptyApplicationsState';
import ApplicationModal from './appliedJobComponents.jsx/applicationModal';
import LoadingSpinner from './appliedJobComponents.jsx/loadingSpinner';
import ErrorMessage from './appliedJobComponents.jsx/ErrorMessage';

// Import services and utils
import { appliedJobsAPI } from '../services/jobSeeker/appliedJobs';
import { appliedJobsUtils } from '../utils/jobSeeker/appliedJobs';

const AppliedJobs = () => {
  // State management
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  // Fetch applications data
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await appliedJobsAPI.fetchApplications();
      setApplications(data);
      setFilteredApplications(data);
    } catch (err) {
      setError(err.message || 'Failed to load applications. Please try again later.');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = appliedJobsUtils.filterApplications(applications, term);
    const sorted = appliedJobsUtils.sortApplicationsByDate(filtered, sortOrder);
    setFilteredApplications(sorted);
  };

  // Handle sorting
  const handleSort = () => {
    const newOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    setSortOrder(newOrder);
    
    const sorted = appliedJobsUtils.sortApplicationsByDate(filteredApplications, newOrder);
    setFilteredApplications(sorted);
  };

  // Handle view details
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setModalOpen(true);
  };

  // Handle close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedApplication(null);
  };

  // Handle application withdrawal
  const handleWithdrawApplication = async (applicationId) => {
    try {
      await appliedJobsAPI.withdrawApplication(applicationId);
      
      // Update local state
      const updatedApplications = applications.filter(app => app.id !== applicationId);
      setApplications(updatedApplications);
      
      // Update filtered applications
      const filteredUpdated = appliedJobsUtils.filterApplications(updatedApplications, searchTerm);
      const sortedUpdated = appliedJobsUtils.sortApplicationsByDate(filteredUpdated, sortOrder);
      setFilteredApplications(sortedUpdated);
      
      // Close modal if the withdrawn application was selected
      if (selectedApplication?.id === applicationId) {
        closeModal();
      }
    } catch (err) {
      setError(err.message || 'Failed to withdraw application');
      console.error('Error withdrawing application:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchApplications();
  }, []);

  // Update filtered applications when search term changes
  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, applications, sortOrder]);

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render error state
   if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="flex-1 bg-white-100 p-6 md:p-10">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">My Job Applications</h1>
        <p className="text-gray-600">Track and manage your job applications in one place</p>
      </div>

      {/* Search and Sort Section */}
      <SearchAndSort
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <EmptyApplicationsState searchTerm={searchTerm} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Application Details Modal */}
      <ApplicationModal
        isOpen={modalOpen}
        application={selectedApplication}
        onClose={closeModal}
        onWithdraw={handleWithdrawApplication}
      />
    </div>
  );
};

export default AppliedJobs;
  