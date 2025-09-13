// src/AdminJobSeekerManagement_Optimized.js
import React, { useState, useEffect } from 'react';
import JobSeekerHeader from './jobSeekersComponents/Header';
import SearchBar from './shared/searchBar';
import JobSeekerGrid from './jobSeekersComponents/Grid';
import DeleteConfirmationModal from './shared/DeleteConModal';
import NotificationAlert from './shared/notificationAlert';
import LoadingSpinner from './shared/loadingSpinner';
import { jobSeekerApiService } from '../services/Admin/jobSeeker';
import { jobSeekerUtils } from '../utils/Admin/jobSeeker';

const AdminJobSeekerManagement_Optimized = () => {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchJobSeekers();
  }, []);

  const fetchJobSeekers = async () => {
    try {
      setLoading(true);
      const data = await jobSeekerApiService.getAllJobSeekers();
      setJobSeekers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job seekers:', error);
      showNotification('Error fetching job seekers', 'error');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await jobSeekerApiService.deleteJobSeeker(userId);
      setJobSeekers(jobSeekers.filter(user => user._id !== userId));
      setDeleteConfirm(null);
      showNotification('Job seeker deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting job seeker:', error);
      showNotification('Error deleting job seeker', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredJobSeekers = jobSeekerUtils.filterJobSeekers(jobSeekers, searchTerm);

  if (loading) {
    return <LoadingSpinner message="Loading job seekers..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red to-white">
      <JobSeekerHeader totalUsers={filteredJobSeekers.length} />
      
      <NotificationAlert notification={notification} />
      
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search by name or email..."
      />
      
      <JobSeekerGrid 
        jobSeekers={filteredJobSeekers}
        onDeleteClick={setDeleteConfirm}
      />
      
      <DeleteConfirmationModal 
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        onConfirmDelete={handleDeleteUser}
        itemType="job seeker"
        deleteMessage="Are you sure you want to delete this job seeker? All their data will be permanently removed."
      />
    </div>
  );
};

export default AdminJobSeekerManagement_Optimized;