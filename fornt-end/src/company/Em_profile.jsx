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

const Em_profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
 
  
  // State management
  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  
  // Add state for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    comDescription: '',
    contactNumber: '',
    companyWebsite: '',
    companyImage: '/api/placeholder/400/400'
  });
  
  // Fetch user profile on component mount
  // API ENDPOINT: GET /apiCompany/Employer/profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsSaving(true);
        const response = await api.get('/company/Employer/profile');
        console.log("Profile response:", response.data); // Debug log
        
        // Handle the profile image URL
        let imageUrl = '/api/placeholder/400/400';
        if (response.data.companyImage && response.data.companyImage !== '') {
          // Check if the URL already includes http or https
          if (response.data.companyImage.startsWith('http')) {
            imageUrl = `${response.data.companyImage}?t=${new Date().getTime()}`;
          } else {
            // Add the base URL if needed
            const cleanPath = response.data.companyImage.replace(/\\/g, '/').replace(/^\/uploads/, '');
            imageUrl = `${api.defaults.baseURL}/uploads/${cleanPath}?t=${new Date().getTime()}`;
          }
        }
        
        console.log("Image URL set to:", imageUrl); // Debug log
        setFormData({
          ...formData,
          companyName: response.data.companyName || '', // Using companyName from response
          email: response.data.email || '',
          comDescription: response.data.comDescription || '',
          contactNumber: response.data.contactNumber || '',
          companyWebsite: response.data.companyWebsite || '',
          companyImage: imageUrl
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
        companyImage: reader.result
      });
    };
    reader.readAsDataURL(file);
    
    // Upload the image to the server
    // API ENDPOINT: POST /apiCompany/Employer/profile/upload-image
    try {
      setIsSaving(true);
      const imageFormData = new FormData();
      imageFormData.append('companyImage', file);
      
      const response = await api.post('Company/Employer/profile/upload-image', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Update the profile image URL with a timestamp to prevent caching
      const updatedImageUrl = response.data.companyImage ? 
        `${response.data.companyImage}?t=${new Date().getTime()}` : 
        formData.companyImage;
      
      setFormData({
        ...formData,
        companyImage: updatedImageUrl
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
      // API ENDPOINT: PUT /apiCompany/Employer/profile
      await api.put('Company/Employer/profile', {
        companyName: formData.companyName, // Use companyName not username
        email: formData.email,
        comDescription: formData.comDescription,
        contactNumber: formData.contactNumber,
        companyWebsite: formData.companyWebsite
      });
      
      // Update password if provided
      // API ENDPOINT: PUT /apiCompany/Employer/profile/change-password
      if (formData.currentPassword && formData.newPassword) {
        await api.put('Company/Employer/profile/change-password', {
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
  



  // Tab switching
  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your company name"
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
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Company Description</label>
              <textarea
                name="comDescription"
                value={formData.comDescription}
                rows="4"
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your company description"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 10-digit contact number"
              />
              <p className="text-xs text-gray-500 mt-1">Format: 10 digits without spaces or special characters</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Company Website</label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
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
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 w-full">
      <div className="max-w-7xl mx-auto w-full">
      
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
                      {formData.companyImage ? (
                        <img 
                          src={formData.companyImage}
                          alt="company logo" 
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
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{formData.companyName}</h2>
                <p className="text-gray-500 text-sm">{formData.email}</p>
                {formData.companyWebsite && (
                  <a href={formData.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm mt-1 hover:underline flex items-center">
                    <i className="bx bx-link-external mr-1"></i> Website
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('company')}
                  className={`flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors ${activeTab === 'company' ? 'border-l-4 border-blue-600 bg-blue-50' : 'border-l-4 border-transparent'}`}
                >
                  <i className={`bx bx-user mr-3 ${activeTab === 'company' ? 'text-blue-600' : 'text-gray-500'}`}></i>
                  <span className={activeTab === 'company' ? 'font-semibold text-blue-600' : 'text-gray-700'}>Company Info</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors ${activeTab === 'security' ? 'border-l-4 border-blue-600 bg-blue-50' : 'border-l-4 border-transparent'}`}
                >
                  <i className={`bx bx-lock-alt mr-3 ${activeTab === 'security' ? 'text-blue-600' : 'text-gray-500'}`}></i>
                  <span className={activeTab === 'security' ? 'font-semibold text-blue-600' : 'text-gray-700'}>Security</span>
                </button>
                
                
              </nav>
            </div>
          </div>

          {/* Right content area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                {activeTab === 'company' && (
                  <>
                    <i className="bx bx-user mr-2 text-blue-600"></i>
                    Company Information
                  </>
                )}
                {activeTab === 'security' && (
                  <>
                    <i className="bx bx-lock-alt mr-2 text-blue-600"></i>
                    Security Settings
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

export default Em_profile;