import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

// Import or define your Plus icon component
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

function Em_jobpost() {
  // State for job listings
  const [jobs, setJobs] = useState([]);
  
  // State for form visibility
  const [showJobForm, setShowJobForm] = useState(false);
  
  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for user data
  const [userData, setUserData] = useState({
    companyName: '',
    comDescription: ''
  });

  // State for form data
  const [formData, setFormData] = useState({
    _id: null,
    title: '',
    description: '',
    location: '',
    jobType: '',
    salary: '',
    thumbnail: null
  });

  // State to track if we're editing an existing job
  const [isEditing, setIsEditing] = useState(false);

  // State for thumbnail preview
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // Location options for dropdown
  const locationOptions = [
    "Western Province",
    "Central Province",
    "Southern Province",
    "Northern Province",
    "Eastern Province",
    "North Western Province",
    "North Central Province",
    "Uva Province",
    "Sabaragamuwa Province"
  ];

  // Job type options for dropdown
  const jobTypeOptions = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Remote'
  ];

  const [statusMessage, setStatusMessage] = useState({
    show: false,
    type: '', // 'success', 'error'
    message: ''
  });

  const showMessage = (type, message) => {
    setStatusMessage({
      show: true,
      type,
      message
    });

    // Auto hide after 3 seconds
    setTimeout(() => {
      setStatusMessage({
        show: false,
        type: '',
        message: ''
      });
    }, 3000);
  };

  // Define the fetchUserData function
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/Company/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUserData(response.data || { companyName: 'Company', comDescription: 'Your company description' });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set default user data
      setUserData({ 
        companyName: 'Your Company', 
        comDescription: 'Your company description appears here' 
      });
    }
  };

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUserData();
    // Fetch job listings
    fetchJobs();
  }, []);

  // Fetch job listings from API
  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/Company/jobs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Set some default jobs for demonstration
      setJobs([
        {
          _id: '507f1f77bcf86cd799439011', // Mock MongoDB ID format
          title: 'Software Engineer',
          description: 'A brief description of the Software Engineer job position.',
          location: 'Chicago, IL',
          jobType: 'Full-time',
          salary: '$100,000 - $130,000',
          thumbnail: null
        },
        {
          _id: '507f1f77bcf86cd799459011', // Mock MongoDB ID format
          title: 'Marketing Coordinator',
          description: 'A brief description of the Marketing Coordinator job position.',
          location: 'Chicago, IL',
          jobType: 'Full-time',
          salary: '$60,000 - $75,000',
          thumbnail: null
        },
        {
          _id: '507f1f77bcf86cd799839011', // Mock MongoDB ID format
          title: 'Product Manager',
          description: 'A brief description of the Product Manager job position.',
          location: 'Chicago, IL',
          jobType: 'Full-time',
          salary: '$110,000 - $140,000',
          thumbnail: null
        }
      ]);
    }
  };

  const toggleJobForm = () => {
    setShowJobForm(!showJobForm);
    if (!showJobForm) {
      // Reset form when opening
      resetForm();
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle thumbnail upload
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove thumbnail
  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: null }));
    setThumbnailPreview(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Check file size before submitting
      if (formData.thumbnail && formData.thumbnail.size > 2 * 1024 * 1024) {
        showMessage('error', 'Image file is too large! Maximum size is 2MB.');
        return;
      }
      // Prepare form data for API
      const jobData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== '_id' && formData[key] !== null) {
          jobData.append(key, formData[key]);
        }
      });

      let response;
      
      if (isEditing) {
        // Update existing job
        response = await axios.put(`http://localhost:3000/api/Company/jobs/${formData._id}`, jobData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        
        // Update local state
        setJobs(jobs.map(job => 
          job._id === formData._id ? response.data : job
        ));

        showMessage('success', 'Job updated successfully!');

      } else {
        // Add new job
        response = await axios.post('http://localhost:3000/api/Company/jobs', jobData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        
        // Add to local state
        setJobs([...jobs, response.data]);

        showMessage('success', 'Job posted successfully!');
      }
      
      // Reset form and hide it
      resetForm();
      setShowJobForm(false);
      
    } catch (error) {
      console.error('Error saving job:', error);
      showMessage('error', 'There was an error saving the job. Please try again.');
      
      // For demo purposes, update the UI even if the API fails
      if (isEditing) {
        setJobs(jobs.map(job => 
          job._id === formData._id ? { ...formData } : job
        ));
      } else {
        const newId = Math.random().toString(36).substring(7); // Generate a random ID for demo
        setJobs([...jobs, { ...formData, _id: newId }]);
      }
      
      resetForm();
      setShowJobForm(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to reset the form
  const resetForm = () => {
    setFormData({
      _id: null,
      title: '',
      description: '',
      location: '',
      jobType: '',
      salary: '',
      thumbnail: null
    });
    setThumbnailPreview(null);
    setIsEditing(false);
  };

  // Function to edit a job
  const editJob = (jobId) => {
    const jobToEdit = jobs.find(job => job._id === jobId);
    if (jobToEdit) {
      setFormData(jobToEdit);
      setIsEditing(true);

      // Set thumbnail preview if exists
      if (jobToEdit.thumbnail) {
        // Check if it's a URL or a path
        setThumbnailPreview(jobToEdit.thumbnail.startsWith('http') ? 
        jobToEdit.thumbnail : 
        `http://localhost:3000/${jobToEdit.thumbnail}`);
      }
      
      // Open form
      setShowJobForm(true);
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Function to delete a job
  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        // Call API to delete job
        await axios.delete(`http://localhost:3000/api/Company/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Update local state
        setJobs(jobs.filter(job => job._id !== jobId));

        showMessage('success', 'Job deleted successfully!');
        
        // If we're currently editing this job, reset the form
        if (isEditing && formData._id === jobId) {
          resetForm();
          setShowJobForm(false);
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        showMessage('error', 'There was an error deleting the job. Please try again.');
        
        // For demo purposes, update the UI even if the API fails
        setJobs(jobs.filter(job => job._id !== jobId));
        
        if (isEditing && formData._id === jobId) {
          resetForm();
          setShowJobForm(false);
        }
      }
    }
  };

  return (
    <div className="flex-1 bg-[#ffffff] p-6 md:p-10">
      {/* Status Message */}
      {statusMessage.show && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-md shadow-md ${
          statusMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            {statusMessage.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span>{statusMessage.message}</span>
          </div>
        </div>
      )}

      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome, {userData.companyName}</h1>
        <p className="mt-4 text-gray-600">{userData.comDescription}</p>
      </div>

      {/* Job Post Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Job Post</h2>
          <button 
            onClick={toggleJobForm}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusIcon />
            <span className="ml-2">post new job</span>
          </button>
        </div>
        
        {/* Job Posting Form (hidden by default) */}
        {showJobForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Job Title */}
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>
                  
                  {/* Job Description */}
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Describe the job responsibilities, requirements, and benefits..."
                    ></textarea>
                  </div>
                  
                  {/* Location and Job Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Location</option>
                        {locationOptions.map((location, index) => (
                          <option key={index} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Type
                      </label>
                      <select
                        id="jobType"
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Job Type</option>
                        {jobTypeOptions.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Salary */}
                  <div className="mb-4">
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                      Salary
                    </label>
                    <input
                      type="text"
                      id="salary"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. $50,000 - $70,000"
                    />
                  </div>
                </div>
                
                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Thumbnail
                  </label>
                  <div className="bg-gray-50 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    {thumbnailPreview ? (
                      <div className="relative">
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={removeThumbnail}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                        >
                          <X size={16} className="text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 space-y-2">
                        <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center">
                          <img 
                            src="/api/placeholder/64/64" 
                            alt="Placeholder" 
                            className="w-12 h-12"
                          />
                        </div>
                        <div className="text-center">
                          <label className="cursor-pointer text-blue-600 hover:text-blue-800 block mb-1">
                            <span>Upload Thumbnail</span>
                            <input
                              type="file"
                              onChange={handleThumbnailChange}
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                          <span className="text-xs text-gray-500">JPG, PNG or GIF (max. 2MB)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowJobForm(false);
                    }}
                    className="mr-4 px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? 'Update Job' : 'Post Job'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Job Listings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {jobs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No job listings found. Create your first job posting using the "post new job" button.
            </div>
          ) : (
            jobs.map((job, index) => (
              <div 
              key={job._id} 
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-blue-100 p-6 ${index !== jobs.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-blue-50 hover:shadow-md`}
            >

                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center">
                      {job.thumbnail ? (
                        <img 
                          src={job.thumbnail.startsWith('http') ? job.thumbnail : `http://localhost:3000/${job.thumbnail}`}
                          alt={`${job.title} thumbnail`} 
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <img 
                          src="/api/placeholder/64/64" 
                          alt="Default thumbnail" 
                          className="w-12 h-12"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => editJob(job._id)}
                    >
                      {job.title}
                    </h3>
                   <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
                      {job.description.length > 150 
                        ? `${job.description.substring(0, 150)}...` 
                        : job.description}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">{job.location}</p>
                    {job.jobType && job.salary && (
                      <p className="mt-1 text-sm text-gray-500">
                        {job.jobType} • {job.salary}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => editJob(job._id)}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Em_jobpost;