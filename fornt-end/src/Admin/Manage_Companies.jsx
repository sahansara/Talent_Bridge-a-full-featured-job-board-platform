// src/Manage_Companies_Optimized.js
import React, { useState, useEffect } from 'react';
import CompanyHeader from './companyComponents/companyHeader';
import SearchBar from './shared/searchBar';
import CompanyGrid from './companyComponents/companyGrid';
import DeleteConfirmationModal from './shared/DeleteConModal';
import NotificationAlert from './shared/notificationAlert';
import LoadingSpinner from './shared/loadingSpinner';
import { companyApiService } from '../services/Admin/Company';
import { notificationUtils } from '../utils/Admin/Company';

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
      const data = await companyApiService.getAllCompanies();
      setCompanies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      showNotification('Error fetching companies', 'error');
      // Fallback to sample data in case of error
      setCompanies(companyApiService.getSampleCompanies());
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await companyApiService.deleteCompany(userId);
      setCompanies(companies.filter(company => company._id !== userId));
      setDeleteConfirm(null);
      showNotification('Company deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting company:', error);
      showNotification('Error deleting company', 'error');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <CompanyHeader totalCompanies={filteredCompanies.length} />
      
      <NotificationAlert notification={notification} />
      
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <CompanyGrid 
        companies={filteredCompanies}
        onDeleteClick={setDeleteConfirm}
      />
      
      <DeleteConfirmationModal 
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        onConfirmDelete={handleDeleteUser}
      />
    </div>
  );
};

export default Manage_Companies;