import React, { useState, useEffect } from 'react';
import { Trash2, Users, Search, Calendar, Mail, User, Shield, AlertTriangle, CheckCircle, Phone, Globe } from 'lucide-react';
import axios from 'axios';
const Manage_Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  // Sample data for demonstration - replace with actual API call
  const sampleCompanies = [
    {
      _id: '67fe9eb3c58d1f5a2b2381e2',
      companyName: 'Tech Solutions Ltd',
      email: 'contact@techsolutions.com',
      contactNumber: '+94771234567',
      companyWebsite: 'https://techsolutions.com',
      role: 'Company',
      createdAt: '2025-04-15T18:00:19.498+00:00'
    },
    {
      _id: '67fe9eb3c58d1f5a2b2381e3',
      companyName: 'Digital Innovations',
      email: 'info@digitalinnovations.lk',
      contactNumber: '+94777654321',
      companyWebsite: 'https://digitalinnovations.lk',
      role: 'Company',
      createdAt: '2025-04-12T10:30:15.123+00:00'
    },
    {
      _id: '67fe9eb3c58d1f5a2b2381e4',
      companyName: 'Creative Agency',
      email: 'hello@creativeagency.com',
      contactNumber: '+94712345678',
      companyWebsite: 'https://creativeagency.com',
      role: 'Company',
      createdAt: '2025-04-10T14:45:22.789+00:00'
    }
  ];

  // Fetch companies from backend
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
  try {
    setLoading(true);
    
    const token = localStorage.getItem('token');
   
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `http://localhost:3000/api/admin/Employers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    setCompanies(response.data);
    setLoading(false);
    
  } catch (error) {
    console.error('Error fetching companies:', error);
    showNotification('Error fetching companies', 'error');
    // Fallback to sample data in case of error
    setCompanies(sampleCompanies);
    setLoading(false);
  }
};

  const handleDeleteUser = async (userId) => {
    try {
      
      
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.delete(
        `http://localhost:3000/api/admin/Company/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredCompanies = companies.filter(company =>
    company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 text-lg font-medium">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
                <p className="text-gray-600">Manage and monitor company accounts</p>
              </div>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-blue-600 font-semibold">{filteredCompanies.length} Total Companies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by company name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <div 
                key={company._id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white truncate">{company.companyName}</h3>
                        <div className="flex items-center space-x-1">
                          <Shield className="h-4 w-4 text-blue-200" />
                          <span className="text-blue-200 text-sm capitalize">{company.role}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(company._id)}
                      className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Delete company"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Email */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600 truncate" title={company.email}>{company.email}</p>
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Phone className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Contact Number</p>
                      <p className="text-sm text-gray-600">{company.contactNumber || 'Not available'}</p>
                    </div>
                  </div>

                  {/* Company Website */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Globe className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Website</p>
                      {company.companyWebsite ? (
                        <a 
                          href={company.companyWebsite} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 truncate block"
                          title={company.companyWebsite}
                        >
                          {company.companyWebsite}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-600">Not available</p>
                      )}
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Joined</p>
                      <p className="text-sm text-gray-600">{formatDate(company.createdAt)}</p>
                    </div>
                  </div>

                  {/* Company ID */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-medium text-gray-900 mb-1">Company ID</p>
                    <p className="text-xs text-gray-600 font-mono break-all">{company._id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                  <p className="text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this company? All their data will be permanently removed.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Manage_Companies;