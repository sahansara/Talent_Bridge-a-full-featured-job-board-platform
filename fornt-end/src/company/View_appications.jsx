import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Calendar, User, MapPin, Clock, FileText, X, ChevronDown, Plus } from 'lucide-react';
import axios from 'axios';
import { Document, Page } from 'react-pdf';






const View_appications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  
  // Mock data - replace with actual API calls
  const [jobPosts, setJobPosts] = useState([
    {
      id: 1,
      title: "Senior Frontend Developer",
      category: "IT",
      location: "New York",
      postDate: "2024-01-15",
      applications: [
        {
          id: 1,
          jobSeekerId: 1,
          name: "John Smith",
          email: "john@email.com",
          phone: "+1234567890",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          appliedDate: "2024-01-20",
          status: "Applied",
          cvUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          experience: "5 years",
          location: "New York",
          skills: ["React", "JavaScript", "TypeScript", "Node.js"],
          notes: ""
        },
        {
          id: 2,
          jobSeekerId: 2,
          name: "Sarah Johnson",
          email: "sarah@email.com",
          phone: "+1234567891",
          image: "https://images.unsplash.com/photo-1494790108755-2616b332c9ae?w=150&h=150&fit=crop&crop=face",
          appliedDate: "2024-01-22",
          status: "Under Review",
          cvUrl: "/cv/sarah-johnson-cv.pdf",
          experience: "3 years",
          location: "Boston",
          skills: ["Vue.js", "React", "CSS", "HTML"],
          notes: "Strong portfolio, good communication skills"
        }
      ]
    },
    {
      id: 2,
      title: "Marketing Manager",
      category: "Marketing",
      location: "Los Angeles",
      postDate: "2024-01-10",
      applications: [
        {
          id: 3,
          jobSeekerId: 3,
          name: "Mike Wilson",
          email: "mike@email.com",
          phone: "+1234567892",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          appliedDate: "2024-01-18",
          status: "Accepted",
          cvUrl: "/cv/mike-wilson-cv.pdf",
          experience: "7 years",
          location: "Los Angeles",
          skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
          notes: "Excellent track record, scheduled for final interview"
        }
      ]
    },
    {
      id: 3,
      title: "UX Designer",
      category: "Design",
      location: "San Francisco",
      postDate: "2024-01-12",
      applications: [
        {
          id: 4,
          jobSeekerId: 4,
          name: "Emma Davis",
          email: "emma@email.com",
          phone: "+1234567893",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          appliedDate: "2024-01-25",
          status: "Rejected",
          cvUrl: "/cv/emma-davis-cv.pdf",
          experience: "2 years",
          location: "San Francisco",
          skills: ["Figma", "Sketch", "Adobe XD", "Prototyping"],
          notes: "Portfolio doesn't match our requirements"
        },
        {
          id: 5,
          jobSeekerId: 5,
          name: "Alex Chen",
          email: "alex@email.com",
          phone: "+1234567894",
          image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
          appliedDate: "2024-01-23",
          status: "Applied",
          cvUrl: "/cv/alex-chen-cv.pdf",
          experience: "4 years",
          location: "Seattle",
          skills: ["UI/UX", "Wireframing", "User Research", "Prototyping"],
          notes: ""
        }
      ]
    }
  ]);

  // Function to get token safely
  const getAuthToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.warn('localStorage not available:', error);
      return null;
    }
  };

// Function to fetch applications from API
const fetchApplications = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Updated API URL - change port to match your backend
    const response = await axios.get(
      'http://localhost:3000/api/Company/All-applications', // Changed to port 3000 based on your image URLs
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    

    // Check if response is HTML (error case)
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      throw new Error('API endpoint not found - received HTML instead of JSON');
    }

    // Handle your specific API response format
    if (response.data && response.data.jobPosts) {
      setJobPosts(response.data.jobPosts);
      
    } else {
      throw new Error('Invalid response format - jobPosts not found');
    }
    
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

  // Fetch data when component mounts
  useEffect(() => {
    fetchApplications();
  }, []);


  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [expandedJobs, setExpandedJobs] = useState(new Set([1, 2, 3])); // Default to all expanded
  const [cvLoadError, setCvLoadError] = useState(false);

  const categories = ['All', 'IT', 'Marketing', 'Design', 'Healthcare', 'Finance'];
  const statuses = ['All', 'Applied', 'Under Review', 'Accepted', 'Rejected'];
  const dateRanges = ['All', 'Last 7 days', 'Last 30 days', 'This month'];

  // Filter functions
  const getFilteredJobPosts = () => {
    return jobPosts.filter(job => {
      if (categoryFilter !== 'All' && job.category !== categoryFilter) return false;
      if (jobFilter !== 'All' && job.id.toString() !== jobFilter) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return job.title.toLowerCase().includes(searchLower) ||
               job.applications.some(app => app.name.toLowerCase().includes(searchLower));
      }
      return true;
    }).map(job => ({
      ...job,
      applications: job.applications.filter(app => {
        if (statusFilter !== 'All' && app.status !== statusFilter) return false;
        if (dateFilter !== 'All') {
          const appDate = new Date(app.appliedDate);
          const now = new Date();
          const diffTime = Math.abs(now - appDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (dateFilter === 'Last 7 days' && diffDays > 7) return false;
          if (dateFilter === 'Last 30 days' && diffDays > 30) return false;
          if (dateFilter === 'This month' && appDate.getMonth() !== now.getMonth()) return false;
        }
        return true;
      })
    }));
  };

const debugCV = (cvUrl) => {
  console.log('CV URL:', cvUrl);
  const fullUrl = cvUrl.startsWith('http') ? cvUrl : `http://localhost:3000${cvUrl}`;
  console.log('Full URL:', fullUrl);
  
  // Don't test fetch here as it will cause CORS errors
  // Just log the URL for debugging
};
// const handleCVDownload = (cvUrl) => {
//   const fullUrl = cvUrl.startsWith('http') ? cvUrl : `http://localhost:3000${cvUrl}`;
  
//   // Create a temporary link element for download
//   const link = document.createElement('a');
//   link.href = fullUrl;
//   link.download = cvUrl.split('/').pop() || 'cv.pdf';
//   link.target = '_blank';
  
//   // Append to body, click, and remove
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };
 // Replace the existing updateApplicationStatus function with this fixed version
const updateApplicationStatus = async (jobId, applicationId, newStatus) => {
  try {
    const token = getAuthToken(); // Use the existing getAuthToken function
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Fixed: Added the complete base URL
    await axios.put(
      `http://localhost:3000/api/Company/applications/${applicationId}/status`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update the local state as before
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


 const updateApplicationNotes = async (jobId, applicationId, notes) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Call your backend API for updating notes (not status)
    await axios.put(
      `http://localhost:3000/api/Company/applications/${applicationId}/notes`, // Updated port
      { notes: notes }, // Fixed payload
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

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
  } catch (error) {
    console.error('Error updating application notes:', error);
    // Optionally show an error to the user
  }
};

  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
// Updated function to get CV URL for preview
const getCVPreviewUrl = (cvUrl) => {
  if (!cvUrl) return null;
  
  // Extract filename from the CV URL - handle both formats
  let filename;
  if (cvUrl.includes('uploads/cvs/') || cvUrl.includes('uploads\\cvs\\')) {
    // Format: "http://localhost:3000/uploads/cvs/cv-67ff4ba8b99adc7d6606e267-1744909600417.pdf"
    // or "uploads\cvs\cv-67fe9eb3c58d1f5a2b2381e2-1746475839657.pdf"
    filename = cvUrl.split(/[/\\]/).pop(); // Handle both / and \ separators
  } else {
    // Format: "/cv/filename.pdf" or just "filename.pdf"
    filename = cvUrl.split('/').pop();
  }
  
  console.log('Original CV URL:', cvUrl);
  console.log('Extracted filename:', filename);
  
  // Use the Company API endpoint
  const previewUrl = `http://localhost:3000/api/Company/cv/${filename}`;
  console.log('Generated Preview URL:', previewUrl);
  
  return previewUrl;
};

// 2. Fixed handleCVDownload function
const handleCVDownload = async (cvUrl) => {
  if (!cvUrl) {
    alert('No CV available');
    return;
  }
  
  try {
    const token = getAuthToken();
    if (!token) {
      alert('Authentication required');
      return;
    }
    
    const previewUrl = getCVPreviewUrl(cvUrl);
    
    // Create a temporary link element for download
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = cvUrl.split(/[/\\]/).pop() || 'cv.pdf'; // Handle both separators
    link.target = '_blank';
    
    // Add authorization header by creating a fetch request
    const response = await fetch(previewUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Create blob and download
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    link.href = blobUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(blobUrl);
    
  } catch (error) {
    console.error('Error downloading CV:', error);
    alert('Failed to download CV. Please try again.');
  }
};

// 3. Fixed openCVPreview function
// Fixed openCVPreview function
const openCVPreview = (cvUrl) => {
  if (!cvUrl) {
    alert('No CV available');
    return;
  }
  
  const previewUrl = getCVPreviewUrl(cvUrl);
  console.log('Opening CV Preview:');
  console.log('Original CV URL:', cvUrl);
  console.log('Preview URL:', previewUrl);
  
  setSelectedCV(previewUrl);
  setCvLoadError(false);
  setShowCVModal(true);
};
  const filteredJobPosts = getFilteredJobPosts();
  const totalApplications = filteredJobPosts.reduce((sum, job) => sum + job.applications.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Management</h1>
          <p className="text-gray-600">Review and manage job applications from candidates</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <Calendar className="w-4 h-4 font-bold text-red-500 " />
              <span className="font-normal">
                {new Date().toLocaleDateString()}
              </span>
            <span className="flex items-center gap-1 font-bold text-gray-800">
              <FileText className="w-4 h-4" />
              {filteredJobPosts.length} Job Posts
            </span>
            <span className="flex items-center gap-1 font-bold text-gray-800">
              
              <User className="w-4 h-4" />
              {totalApplications} Total Applications
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search jobs or candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>Status: {status}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>Category: {category}</option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {dateRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Posts and Applications */}
        <div className="space-y-6">
          {filteredJobPosts.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Job Header */}
              <div 
                className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
                onClick={() => toggleJobExpansion(job.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {job.category}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        {job.applications.length} Applications
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Posted: {new Date(job.postDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedJobs.has(job.id) ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Applications */}
              {expandedJobs.has(job.id) && (
                <div className="p-6">
                  {job.applications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No applications found for this job</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {job.applications.map(application => (
                        <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          {/* Applicant Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={application.image}
                              alt={application.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{application.name}</h4>
                              <p className="text-sm text-gray-600">{application.experience} experience</p>
                            </div>
                          </div>

                          {/* Status */}
                          <div className="mb-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                              {application.status}
                            </span>
                          </div>

                          {/* Applied Date */}
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                            <Clock className="w-4 h-4" />
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                          </div>

                          {/* Skills Preview */}
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {application.skills.slice(0, 2).map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                              {application.skills.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  +{application.skills.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          
                          <div className="flex gap-2 mb-3">
                            <button
                              onClick={() => setSelectedApplication(application)}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Eye className="w-4 h-4 inline mr-1" />
                              View Details
                            </button>


                            <button
                                onClick={() => openCVPreview(application.cvUrl)}
                                className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                                title="Preview CV"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                                                    
                          <button
                            onClick={() => handleCVDownload(application.cvUrl)}
                            className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                            title="Download CV"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                        </div>

                          {/* Status Actions */}
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateApplicationStatus(job.id, application.id, 'Accepted')}
                              className="flex-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded hover:bg-green-200 transition-colors"
                              disabled={application.status === 'Accepted'}
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(job.id, application.id, 'Under Review')}
                              className="flex-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded hover:bg-yellow-200 transition-colors"
                              disabled={application.status === 'Under Review'}
                            >
                              Review
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(job.id, application.id, 'Rejected')}
                              className="flex-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded hover:bg-red-200 transition-colors"
                              disabled={application.status === 'Rejected'}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredJobPosts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No job posts found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Application Details</h3>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Applicant Info */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={selectedApplication.image}
                    alt={selectedApplication.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-medium">{selectedApplication.name}</h4>
                    <p className="text-gray-600">{selectedApplication.email}</p>
                    <p className="text-gray-600">{selectedApplication.phone}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Experience</label>
                    <p className="text-gray-900">{selectedApplication.experience}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900">{selectedApplication.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Applied Date</label>
                    <p className="text-gray-900">{new Date(selectedApplication.appliedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Current Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Notes</label>
                  <textarea
                    value={selectedApplication.notes}
                    onChange={(e) => {
                      const jobId = jobPosts.find(job => 
                        job.applications.some(app => app.id === selectedApplication.id)
                      )?.id;
                      if (jobId) {
                        updateApplicationNotes(jobId, selectedApplication.id, e.target.value);
                        setSelectedApplication({...selectedApplication, notes: e.target.value});
                      }
                    }}
                    placeholder="Add private notes about this candidate..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* CV Download */}
                                <div className="mb-6">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">CV Document</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => openCVPreview(selectedApplication.cvUrl)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Preview CV
                      </button>
                      <button
                        onClick={() => handleCVDownload(selectedApplication.cvUrl)}
                        className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download CV
                      </button>
                    </div>
                  </div>

                {/* Status Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const jobId = jobPosts.find(job => 
                        job.applications.some(app => app.id === selectedApplication.id)
                      )?.id;
                      if (jobId) {
                        updateApplicationStatus(jobId, selectedApplication.id, 'Accepted');
                        setSelectedApplication({...selectedApplication, status: 'Accepted'});
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    disabled={selectedApplication.status === 'Accepted'}
                  >
                    Accept / Schedule Interview
                  </button>
                  <button
                    onClick={() => {
                      const jobId = jobPosts.find(job => 
                        job.applications.some(app => app.id === selectedApplication.id)
                      )?.id;
                      if (jobId) {
                        updateApplicationStatus(jobId, selectedApplication.id, 'Under Review');
                        setSelectedApplication({...selectedApplication, status: 'Under Review'});
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                    disabled={selectedApplication.status === 'Under Review'}
                  >
                    Under Review
                  </button>
                  <button
                    onClick={() => {
                      const jobId = jobPosts.find(job => 
                        job.applications.some(app => app.id === selectedApplication.id)
                      )?.id;
                      if (jobId) {
                        updateApplicationStatus(jobId, selectedApplication.id, 'Rejected');
                        setSelectedApplication({...selectedApplication, status: 'Rejected'});
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                    disabled={selectedApplication.status === 'Rejected'}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

         


{/* CV Viewer Modal */}
{showCVModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-5xl w-full h-[90vh] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
        <h3 className="text-lg font-semibold">CV Preview</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleCVDownload(selectedApplication?.cvUrl || selectedCV)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download CV
          </button>
          <button
            onClick={() => {
              setShowCVModal(false);
              setSelectedCV(null);
              setCvLoadError(false);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
          {selectedCV && !cvLoadError ? (
            <div className="w-full h-full relative">
              {/* Try iframe first */}
              <iframe
                src={`${selectedCV}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full border-0"
                title="CV Preview"
                onLoad={() => setCvLoadError(false)}
                onError={(e) => {
                  console.error('PDF iframe load error:', e);
                  setCvLoadError(true);
                }}
                style={{ backgroundColor: 'white' }}
              />

              {/* Fallback: Try object embed */}
              {cvLoadError && (
                <object
                  data={selectedCV}
                  type="application/pdf"
                  className="w-full h-full"
                  onError={() => {
                    console.error('PDF object embed failed');
                    setCvLoadError(true);
                  }}
                >
                  <embed
                    src={selectedCV}
                    type="application/pdf"
                    className="w-full h-full"
                    onError={() => {
                      console.error('PDF embed failed');
                      setCvLoadError(true);
                    }}
                  />
                </object>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-2">
                {cvLoadError ? 'Cannot preview PDF in browser' : 'No CV selected'}
              </p>
              <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
                {cvLoadError
                  ? 'Your browser may not support PDF preview. Try downloading or opening in a new tab.'
                  : 'Select a CV to preview'}
              </p>

              {selectedCV && (
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      const token = getAuthToken();
                      if (token) {
                        try {
                          const response = await fetch(selectedCV, {
                            method: 'HEAD',
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          });

                          if (response.ok) {
                            window.open(selectedCV, '_blank');
                          } else {
                            console.error('URL not accessible:', response.status);
                            alert(`Cannot access CV: ${response.status} ${response.statusText}`);
                          }
                        } catch (error) {
                          console.error('Error testing URL:', error);
                          alert('Cannot access CV. Please try downloading instead.');
                        }
                      } else {
                        alert('Authentication required');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Open in New Tab
                  </button>
                  <button
                    onClick={() => handleCVDownload(selectedApplication?.cvUrl || selectedCV)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download CV
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
        )}

      </div>
    </div>
  )};
         


export default View_appications;