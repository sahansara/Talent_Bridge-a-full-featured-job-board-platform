import React, { useState, useEffect } from 'react';

// Components
import StatusMessage from './jobPostComponets/statusMessage';
import WelcomeCard from './jobPostComponets/welcomeCard';
import JobSectionHeader from './jobPostComponets/jobsectionHeader';
import JobPostingForm from './jobPostComponets/jobPostingForm';
import JobListings from './jobPostComponets/JobListings';

// Services
import JobPostApiService from '../services/employer/jobPost';

// Utils
import { 
  defaultFormData, 
  defaultUserData, 
  mockJobs, 
  validateFileForUpdate, 
  hasFileChanged,
  generateRandomId, 
  getThumbnailUrl  
} from '../utils/employer/jobPost';

function Em_jobpost() {
  // State for job listings
  const [jobs, setJobs] = useState([]);
  
  // State for form visibility
  const [showJobForm, setShowJobForm] = useState(false);
  
  // State for user data
  const [userData, setUserData] = useState(defaultUserData);

  // State for form data
  const [formData, setFormData] = useState(defaultFormData);

  // State to track if we're editing an existing job
  const [isEditing, setIsEditing] = useState(false);

  // State for thumbnail preview
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // State to track original thumbnail for comparison
  const [originalThumbnail, setOriginalThumbnail] = useState(null);

  // State for status messages
  const [statusMessage, setStatusMessage] = useState({
    show: false,
    type: '',
    message: ''
  });

  // Show status message function
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

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const data = await JobPostApiService.fetchUserData();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(defaultUserData);
    }
  };

  // Fetch job listings from API
  const fetchJobs = async () => {
    try {
      const data = await JobPostApiService.fetchJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs(mockJobs);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchJobs();
  }, []);

  // Toggle job form visibility
  const toggleJobForm = () => {
    setShowJobForm(!showJobForm);
    if (!showJobForm) {
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
      // Enhanced validation - only check if file has changed
      const validation = validateFileForUpdate(
        formData.thumbnail, 
        isEditing, 
        originalThumbnail, 
        2
      );
      
      if (!validation.isValid) {
        showMessage('error', validation.message);
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
        response = await JobPostApiService.updateJob(formData._id, jobData);
        
        // Update local state
        setJobs(jobs.map(job => 
          job._id === formData._id ? response : job
        ));

        showMessage('success', 'Job updated successfully!');
      } else {
        // Add new job
        response = await JobPostApiService.createJob(jobData);
        
        // Add to local state
        setJobs([...jobs, response]);

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
        const newId = generateRandomId();
        setJobs([...jobs, { ...formData, _id: newId }]);
      }
      
      resetForm();
      setShowJobForm(false);
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setFormData(defaultFormData);
    setThumbnailPreview(null);
    setOriginalThumbnail(null);
    setIsEditing(false);
  };

  // Function to handle form cancellation
  const handleCancel = () => {
    resetForm();
    setShowJobForm(false);
  };

  // Function to edit a job
  const editJob = (jobId) => {
    const jobToEdit = jobs.find(job => job._id === jobId);
    if (jobToEdit) {
      setFormData(jobToEdit);
      setIsEditing(true);

      // Set thumbnail preview and original thumbnail if exists
      if (jobToEdit.thumbnail) {
        const thumbnailUrl = getThumbnailUrl(jobToEdit.thumbnail);
        setThumbnailPreview(thumbnailUrl);
        setOriginalThumbnail(jobToEdit.thumbnail); // Store original for comparison
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
        await JobPostApiService.deleteJob(jobId);

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
      <StatusMessage statusMessage={statusMessage} />

      {/* Welcome Card */}
      <WelcomeCard userData={userData} />

      {/* Job Post Section */}
      <div className="mb-8">
        {/* Job Section Header */}
        <JobSectionHeader toggleJobForm={toggleJobForm} />
        
        {/* Job Posting Form */}
        {showJobForm && (
          <JobPostingForm
            formData={formData}
            handleInputChange={handleInputChange}
            thumbnailPreview={thumbnailPreview}
            handleThumbnailChange={handleThumbnailChange}
            removeThumbnail={removeThumbnail}
            isEditing={isEditing}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        )}
        
        {/* Job Listings */}
        <JobListings
          jobs={jobs}
          onEdit={editJob}
          onDelete={deleteJob}
        />
      </div>
    </div>
  );
}

export default Em_jobpost;