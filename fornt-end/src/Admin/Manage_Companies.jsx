// src/Manage_Companies_Optimized.js
import React, { useState, useEffect } from 'react';
import EmployerHeader from './employerComponents/employerHeader';
import SearchBar from './shared/searchBar';
import EmployerGrid from './employerComponents/employerGrid';
import DeleteConfirmationModal from './shared/DeleteConModal';
import NotificationAlert from './shared/notificationAlert';
import LoadingSpinner from './shared/loadingSpinner';
import { employerApiService } from '../services/Admin/employer';
import { notificationUtils } from '../utils/Admin/employer';

const Manage_Companies= () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await employerApiService.getAllCompanies();
      setCompanies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      showNotification('Error fetching companies', 'error');
      // Fallback to sample data in case of error
      setCompanies(employerApiService.getSampleCompanies());
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await employerApiService.deleteemployer(userId);
      setCompanies(companies.filter(employer => employer._id !== userId));
      setDeleteConfirm(null);
      showNotification('employer deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting employer:', error);
      showNotification('Error deleting employer', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredCompanies = notificationUtils.filterCompanies(companies, searchTerm);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-red to-blue-50">
      <EmployerHeader totalCompanies={filteredCompanies.length} />
      
      <NotificationAlert notification={notification} />
      
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <EmployerGrid 
        companies={filteredCompanies}
        onDeleteClick={setDeleteConfirm}
      />
      
      <DeleteConfirmationModal 
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        onConfirmDelete={handleDeleteUser}
         itemType="employer"
        deleteMessage="Are you sure you want to delete this employer All their data will be permanently removed."
      />
    </div>
  );
};

export default Manage_Companies;