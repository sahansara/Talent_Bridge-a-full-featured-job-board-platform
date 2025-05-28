import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';

// Create an axios instance with base URL and token
// API ENDPOINT: Base URL configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // API endpoint base URL
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const SK_profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cvInputRef = useRef(null);
  
  // State management
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  
  // Add state for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    currentCV: '',
    profileImage: '/api/placeholder/400/400'
  });
  
  // Fetch user profile on component mount
  // API ENDPOINT: GET /api/users/profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsSaving(true);
        const response = await api.get('/users/profile');
        console.log("Profile response:", response.data); // Debug log

         // Handle the profile image URL
      let imageUrl = '/api/placeholder/400/400';
      if (response.data.profileImage && response.data.profileImage !== '') {
        // Check if the URL already includes http or https
        if (response.data.profileImage.startsWith('http')) {
          imageUrl = `${response.data.profileImage}?t=${new Date().getTime()}`;
        } else {
          // Add the base URL if needed
          const cleanPath = response.data.profileImage.replace(/\\/g, '/').replace(/^\/uploads/, '');
          imageUrl = `${api.defaults.baseURL}/uploads/${response.data.profileImage}?t=${new Date().getTime()}`;
        }
      }
      
      console.log("Image URL set to:", imageUrl); // Debug log
        setFormData({
          ...formData,
          username: response.data.username || '',
          email: response.data.email || '',
          currentCV: response.data.cvFilename || '',
          profileImage: imageUrl
        });
        
        setIsSaving(false);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setNotification({
          type: 'error',
          message: 'Failed to load profile data. Please try again.'
        });
        setIsSaving(false);
        
        // Redirect to login if unauthorized
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    
    fetchProfile();
  }, [navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleProfilePhotoUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log("Selected file:", file); // Debug log
  
    // Only allow image files
    if (!file.type.match('image.*')) {
      setNotification({
        type: 'error',
        message: 'Please select an image file'
      });
      return;
    }
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        profileImage: reader.result
      });
    };
    reader.readAsDataURL(file);
    
    // Upload the image to the server
    // API ENDPOINT: POST /api/users/profile/upload-image
    try {
      setIsSaving(true);
      const imageFormData = new FormData();
      imageFormData.append('profileImage', file);
      
      const response = await api.post('/users/profile/upload-image', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
       // Update the profile image URL with a timestamp to prevent caching
    const updatedImageUrl = response.data.profileImage ? 
    `${response.data.profileImage}?t=${new Date().getTime()}` : 
    formData.profileImage;
  
  setFormData({
    ...formData,
    profileImage: updatedImageUrl
  });
  

      setNotification({
        type: 'success',
        message: 'Profile image updated successfully'
      });
      setIsSaving(false);
    } catch (err) {
      console.error('Failed to upload image:', err);
      setNotification({
        type: 'error',
        message: 'Failed to upload image. Please try again.'
      });
      setIsSaving(false);
    }
  };
  
  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Only allow PDF files
    if (file.type !== 'application/pdf') {
      setNotification({
        type: 'error',
        message: 'Please select a PDF file'
      });
      return;
    }
    
    setFormData({
      ...formData,
      currentCV: file.name
    });
    
    // Upload the CV to the server
    // API ENDPOINT: POST /api/users/profile/upload-cv
    try {
      setIsSaving(true);
      const cvFormData = new FormData();
      cvFormData.append('cv', file);
      
      await api.post('/users/profile/upload-cv', cvFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setNotification({
        type: 'success',
        message: 'CV uploaded successfully'
      });
      setIsSaving(false);
    } catch (err) {
      console.error('Failed to upload CV:', err);
      setNotification({
        type: 'error',
        message: 'Failed to upload CV. Please try again.'
      });
      setIsSaving(false);
    }
  };
  
  const validateForm = () => {
    // Validate passwords if the user is trying to change them
    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setNotification({
          type: 'error',
          message: 'Current password is required to set a new password'
        });
        return false;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setNotification({
          type: 'error',
          message: "New passwords don't match!"
        });
        return false;
      }
      
      if (formData.newPassword && formData.newPassword.length < 6) {
        setNotification({
          type: 'error',
          message: "Password must be at least 6 characters long"
        });
        return false;
      }
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });
    
    // Validate form
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      // Update profile info
      // API ENDPOINT: PUT /api/users/profile
      await api.put('/users/profile', {
        username: formData.username,
        email: formData.email
      });
      
      // Update password if provided
      // API ENDPOINT: PUT /api/users/profile/change-password
      if (formData.currentPassword && formData.newPassword) {
        await api.put('/users/profile/change-password', {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
        
        // Clear password fields after successful update
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
      
      setNotification({
        type: 'success',
        message: 'Profile updated successfully'
      });
      setIsSaving(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      
      if (err.response && err.response.status === 401) {
        setNotification({
          type: 'error',
          message: 'Current password is incorrect'
        });
      } else {
        setNotification({
          type: 'error',
          message: 'Failed to update profile. Please try again.'
        });
      }
      
      setIsSaving(false);
    }
  };
  

   // Handle back navigation
   const handleGoBack = () => {
    navigate(-1);
  };


  // Tab switching
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div className="mb-4 relative">
              
              <label className="block text-gray-700 text-sm font-medium mb-2">Current Password</label>
              <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button 
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i className={`bx ${showCurrentPassword ? 'bx-hide' : 'bx-show'} text-gray-500`}></i>
                </button>
                </div>   </div>
            
            <div className="mb-4">
              
              <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
              <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
              />
              <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i className={`bx ${showNewPassword ? 'bx-hide' : 'bx-show'} text-gray-500`}></i>
                </button>
            </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Confirm New Password</label>
              <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
               <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i className={`bx ${showConfirmPassword ? 'bx-hide' : 'bx-show'} text-gray-500`}></i>
                </button>
            </div>
          </div>
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Resume/CV</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button 
                  type="button"
                  onClick={() => cvInputRef.current.click()}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                >
                  <i className="bx bx-upload mr-2"></i> Upload PDF
                </button>
                <span className="text-gray-600 break-all text-sm">
                  {formData.currentCV ? (
                    <span className="flex items-center">
                      <i className="bx bxs-file-pdf text-red-500 mr-2"></i>
                      {formData.currentCV}
                    </span>
                  ) : (
                    'No CV uploaded'
                  )}
                </span>
                <input 
                  type="file" 
                  ref={cvInputRef}
                  onChange={handleCVUpload}
                  className="hidden" 
                  accept=".pdf"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Upload your latest resume/CV in PDF format</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 w-full">
      <div className="max-w-7xl mx-auto w-full">
        {/* Back button */}
        <div className="mb-6">
          <button 
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <i className="bx bx-arrow-back mr-2"></i> Back
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

        {/* Notification */}
        {notification.message && (
          <div className={`mb-6 p-4 rounded-md ${notification.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            <div className="flex items-center">
              <i className={`mr-2 text-lg ${notification.type === 'error' ? 'bx bx-error-circle' : 'bx bx-check-circle'}`}></i>
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar with profile photo */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col items-center">
              
                    <div className="relative w-32 h-32 mb-4">
                      {formData.profileImage ? (
                        <img 
                          src={formData.profileImage}
                          alt="Profile" 
                          className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/api/placeholder/400/400';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                          <i className="bx bx-user text-blue-500 text-4xl"></i>
                        </div>
                      )}
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                      >
                        <i className="bx bxs-camera"></i>
                      </button>
                    </div>
                   <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleProfilePhotoUpdate}
                  className="hidden" 
                  accept="image/*"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{formData.username}</h2>
                <p className="text-gray-500 text-sm">{formData.email}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('personal')}
                  className={`flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors ${activeTab === 'personal' ? 'border-l-4 border-blue-600 bg-blue-50' : 'border-l-4 border-transparent'}`}
                >
                  <i className={`bx bx-user mr-3 ${activeTab === 'personal' ? 'text-blue-600' : 'text-gray-500'}`}></i>
                  <span className={activeTab === 'personal' ? 'font-semibold text-blue-600' : 'text-gray-700'}>Personal Info</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors ${activeTab === 'security' ? 'border-l-4 border-blue-600 bg-blue-50' : 'border-l-4 border-transparent'}`}
                >
                  <i className={`bx bx-lock-alt mr-3 ${activeTab === 'security' ? 'text-blue-600' : 'text-gray-500'}`}></i>
                  <span className={activeTab === 'security' ? 'font-semibold text-blue-600' : 'text-gray-700'}>Security</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('documents')}
                  className={`flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors ${activeTab === 'documents' ? 'border-l-4 border-blue-600 bg-blue-50' : 'border-l-4 border-transparent'}`}
                >
                  <i className={`bx bx-file mr-3 ${activeTab === 'documents' ? 'text-blue-600' : 'text-gray-500'}`}></i>
                  <span className={activeTab === 'documents' ? 'font-semibold text-blue-600' : 'text-gray-700'}>Documents</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Right content area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                {activeTab === 'personal' && (
                  <>
                    <i className="bx bx-user mr-2 text-blue-600"></i>
                    Personal Information
                  </>
                )}
                {activeTab === 'security' && (
                  <>
                    <i className="bx bx-lock-alt mr-2 text-blue-600"></i>
                    Security Settings
                  </>
                )}
                {activeTab === 'documents' && (
                  <>
                    <i className="bx bx-file mr-2 text-blue-600"></i>
                    Document Management
                  </>
                )}
              </h2>

              <form onSubmit={handleSubmit}>
                {renderTabContent()}
                
                <div className="mt-8 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <i className="bx bx-loader-alt bx-spin mr-2"></i>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-save mr-2"></i>
                        Save All Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SK_profile;