import axios from 'axios';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, ExternalLink, Calendar, MapPin, DollarSign, Briefcase, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';

export default function Applied_job() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`http://localhost:3000/api/job-seeker/my-applications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data; // Replace mockData with actual API data

      setApplications(data);
      setFilteredApplications(data);
      console.log('Applications fetched successfully:', data);
    } catch (err) {
      setError('Failed to load applications. Please try again later.');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchApplications();
}, []);


  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredApplications(applications);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = applications.filter(app => 
        app.jobTitle.toLowerCase().includes(lowercasedSearch) || 
        app.company.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredApplications(filtered);
    }
  }, [searchTerm, applications]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return <Clock className="text-yellow-500" size={18} />;
      case 'read':
        return <Calendar className="text-blue-500" size={18} />;
      case 'offered':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'rejected':
        return <X className="text-red-500" size={18} />;
      default:
        return <AlertCircle className="text-gray-500" size={18} />;
    }
  };

  const getStatusClass = (status) => {
    
    switch (status.toLowerCase()) {
      case 'applied':
        
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        
      case 'read':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'offered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  const sortApplications = () => {
    const newOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
    setSortOrder(newOrder);
    
    const sorted = [...filteredApplications].sort((a, b) => {
      if (newOrder === 'newest') {
        return new Date(b.appliedAt) - new Date(a.appliedAt);
      } else {
        return new Date(a.appliedAt) - new Date(b.appliedAt);
      }
    });
    
    setFilteredApplications(sorted);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg text-red-600">
        <AlertCircle className="mx-auto mb-2" size={32} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    
     <div className="flex-1 bg-white-100 p-6 md:p-10">
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">My Job Applications</h1>
        <p className="text-gray-600">Track and manage your job applications in one place</p>
      </div>

      
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-6 w-full max-w-7xl">
            {/* Search Bar */}
            <div className="relative flex-1">
                <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-200 transition-shadow duration-300">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full bg-white border border-gray-300 hover:border-blue-400 pl-4 pr-10 py-2 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="absolute right-7 top-1/2 transform -translate-y-1/2 text-blue-500">
                    <svg
                    className="w-5 h-5"
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

            {/* Sort Button */}
            <button 
                onClick={sortApplications}
                className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 hover:bg-gray-50 shadow"
            >
                Sort by date 
                {sortOrder === 'newest' ? 
                <ChevronDown size={16} /> : 
                <ChevronUp size={16} />
                }
            </button>
            </div>


      {filteredApplications.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <Briefcase className="mx-auto mb-3 text-gray-400" size={36} />
          <h3 className="text-lg font-medium text-gray-800 mb-1">No applications found</h3>
          <p className="text-gray-600">
            {searchTerm ? "Try different search terms" : "You haven't applied to any jobs yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {application.logo ? (
                      <img 
                       src={application.logo.startsWith('http') ? application.logo : `http://localhost:3000/${application.logo}`} 
                      alt={`${application.company} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Briefcase className="text-gray-400" size={24} />
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(application.status)}`}>
                    {getStatusIcon(application.status)}
                    {application.status}
                  </span>
                </div>

                <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">{application.jobTitle}</h3>
                <p className="text-gray-700 mb-3">{application.company}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2 flex-shrink-0" />
                    <span className="text-sm truncate">{application.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={16} className="mr-2 flex-shrink-0" />
                    <span className="text-sm">{application.salary || 'Salary not specified'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2 flex-shrink-0" />
                    <span className="text-sm">Applied on {formatDate(application.appliedAt)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(application)}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                >
                  View Details
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

  {/* Job Details Modal */}
{modalOpen && selectedApplication && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 bg-white z-10">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Job Details</h3>
        <button
          onClick={closeModal}
          className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Modal Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {/* Job Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          {selectedApplication.logo ? (
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img 
                src={
                  selectedApplication.logo.startsWith('http') ? selectedApplication.logo : `http://localhost:3000/${selectedApplication.logo}`
                } 
                alt="Company logo" 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl sm:text-3xl font-bold text-blue-500">
                {(selectedApplication.company || selectedApplication.title || "J").charAt(0)}
              </span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {selectedApplication.title}
              </h1>
              <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium w-fit ${getStatusClass(selectedApplication.status)}`}>
                {getStatusIcon(selectedApplication.status)}
                {selectedApplication.status}
              </div>
            </div>
            <p className="text-base sm:text-lg text-gray-600 truncate">
              {selectedApplication.company || "Company not specified"}
            </p>
          </div>
        </div>
        
        {/* Job Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Location
            </h4>
            <p className="text-gray-800 font-medium">{selectedApplication.location || "Not specified"}</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"/>
              </svg>
              Job Type
            </h4>
            <p className="text-gray-800 font-medium">{selectedApplication.jobType || "Not specified"}</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:col-span-2 lg:col-span-1">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
              Salary
            </h4>
            <p className="text-gray-800 font-medium">{selectedApplication.salary || "Not specified"}</p>
          </div>
        </div>
        
        {/* Posted Date */}
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Posted Date
          </h4>
          <p className="text-gray-800 font-medium">
            {selectedApplication.approvedAt ? formatDate(selectedApplication.approvedAt) : "Not available"}
          </p>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Description
          </h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            {selectedApplication.description ? (
              <div className="prose max-w-none text-gray-700 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                {selectedApplication.description}
              </div>
            ) : (
              <p className="italic text-gray-500 text-sm sm:text-base">No description provided</p>
            )}
          </div>
        </div>

        {/* Application Timeline */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Application Timeline
          </h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle size={16} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm sm:text-base">Application submitted</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">{formatDate(selectedApplication.appliedAt)}</p>
              </div>
            </div>
            
            {selectedApplication.status !== 'Pending' && (
              <div className="flex items-start gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  selectedApplication.status === 'Approved' ? 'bg-green-100' : 
                  selectedApplication.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <CheckCircle size={16} className={`${
                    selectedApplication.status === 'Approved' ? 'text-green-600' : 
                    selectedApplication.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm sm:text-base">
                    Application {selectedApplication.status.toLowerCase()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {formatDate(selectedApplication.updatedAt || selectedApplication.appliedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal Footer - Sticky */}
      <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50 sticky bottom-0">
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={closeModal}
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
  )}