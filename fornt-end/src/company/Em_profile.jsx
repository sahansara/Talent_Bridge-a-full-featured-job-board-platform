import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';

// Components
import ProfilePhotoSection from './profileComponets/ProfilePhotoSection';
import NavigationTabs from './profileComponets/navigationTabs';
import PersonalInfoTab from './profileComponets/persionalInfo';
import SecurityTab from './profileComponets/SecurityTab';
import NotificationAlert from './profileComponets/notificationAlert';

// Services
import { profileApiService } from '../services/Company/ComProfile';

// Utils
import { 
  profileValidationUtils, 
  INITIAL_FORM_STATE, 
  INITIAL_PASSWORD_VISIBILITY 
} from '../utils/Company/Profile';

const Em_profile = () => {
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [passwordVisibility, setPasswordVisibility] = useState(INITIAL_PASSWORD_VISIBILITY);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsSaving(true);
        const profileData = await profileApiService.fetchProfile();
        
        setFormData({
          ...formData,
          ...profileData
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

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field]
    });
  };

  const handleProfilePhotoUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log("Selected file:", file);

    // Validate file
    const validation = profileValidationUtils.validateImageFile(file);
    if (!validation.isValid) {
      setNotification({
        type: 'error',
        message: validation.error
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
    try {
      setIsSaving(true);
      const updatedImageUrl = await profileApiService.uploadProfileImage(file);
      
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
      const errorMessage = profileValidationUtils.getErrorMessage(err);
      setNotification({
        type: 'error',
        message: `Failed to upload image: ${errorMessage}`
      });
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });
    
    // Validate form
    const validation = profileValidationUtils.validateForm(formData);
    if (!validation.isValid) {
      setNotification({
        type: 'error',
        message: validation.error
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update profile info
      await profileApiService.updateProfile(formData);
      
      // Update password if provided
      if (formData.currentPassword && formData.newPassword) {
        await profileApiService.changePassword({
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

        // Reset password visibility
        setPasswordVisibility(INITIAL_PASSWORD_VISIBILITY);
      }
      
      setNotification({
        type: 'success',
        message: 'Profile updated successfully'
      });
      setIsSaving(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      
      const errorMessage = profileValidationUtils.getErrorMessage(err);
      setNotification({
        type: 'error',
        message: `Failed to update profile: ${errorMessage}`
      });
      
      setIsSaving(false);
    }
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return (
          <PersonalInfoTab
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 'security':
        return (
          <SecurityTab
            formData={formData}
            handleInputChange={handleInputChange}
            passwordVisibility={passwordVisibility}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        );
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'company':
        return (
          <>
            <i className="bx bx-user mr-2 text-blue-600"></i>
            Company Information
          </>
        );
      case 'security':
        return (
          <>
            <i className="bx bx-lock-alt mr-2 text-blue-600"></i>
            Security Settings
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 w-full">
      <div className="max-w-7xl mx-auto w-full">
        
      <div className="mb-6 bg-white rounded-2xl p-8 shadow-xl border-l-8 border-blue-600 border border-gray-100">
  <div className="flex items-center mb-4">
    <div className="w-3 h-12 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full mr-4"></div>
    <div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2 py-1">
        My Profile</h1>

        </div>
        </div>
</div>
        {/* Notification */}
        <NotificationAlert notification={notification} />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar with profile photo */}
          <div className="w-full lg:w-1/4">
            <ProfilePhotoSection
              formData={formData}
              onProfilePhotoUpdate={handleProfilePhotoUpdate}
              isSaving={isSaving}
            />

            <NavigationTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Right content area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                {getTabTitle()}
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