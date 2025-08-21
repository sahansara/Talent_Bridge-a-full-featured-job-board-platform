// React imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// External libraries
import 'boxicons/css/boxicons.min.css';

// Component imports
import ProfilePhotoSection from './profileComponets/ProfilePhotoSection';
import NavigationTabs from './profileComponets/navigationTabs';
import PersonalInfoTab from './profileComponets/personalInfoTab';
import SecurityTab from './profileComponets/securityTab';
import DocumentsTab from './profileComponets/documentsTab';
import NotificationAlert from './profileComponets/notificationAlert';
import ProfileHeader from './profileComponets/profileHeader';

// Service imports
import { profileAPI } from '../services/jobSeeker/mainprofile';
import { validateProfileForm, validateFile } from "../utils/jobSeeker/profileValidations";


const SK_profile = () => {
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });
  
  // Password visibility states
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
    profileImage: null
  });

  // Effects
  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  // API functions
  const fetchProfile = async () => {
    try {
      setIsSaving(true);
      const profileData = await profileAPI.fetchProfile();
      setFormData({
        ...formData,
        ...profileData
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Failed to load profile data. Please try again.'
      });
      
      // Redirect to login if unauthorized
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Event handlers
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

  const validation = validateFile.image(file);
  if (!validation.isValid) {
    setNotification({
      type: 'error',
      message: validation.error
    });
    return;
  }
  
  // Create preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setFormData({
      ...formData,
      profileImage: reader.result
    });
  };
  reader.readAsDataURL(file);
  
  // Upload to server
  try {
    setIsSaving(true);
    const updatedImageUrl = await profileAPI.uploadProfileImage(file);
    
    setFormData({
      ...formData,
      profileImage: updatedImageUrl || formData.profileImage
    });

    setNotification({
      type: 'success',
      message: 'Profile image updated successfully'
    });

    
    setTimeout(() => {
      window.location.reload();
    }, 500); 

  } catch (err) {
  
    setNotification({
      type: 'error',
      message: 'Failed to upload image. Please try again.'
    });
  } finally {
    setIsSaving(false);
  }
};
  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validation = validateFile.pdf(file);
    if (!validation.isValid) {
      setNotification({
        type: 'error',
        message: validation.error
      });
      return;
    }
    
    setFormData({
      ...formData,
      currentCV: file.name
    });
    
    try {
      setIsSaving(true);
      await profileAPI.uploadCV(file);
      
      setNotification({
        type: 'success',
        message: 'CV uploaded successfully'
      });
      
    setTimeout(() => {
      window.location.reload();
    }, 500); 

    } catch (err) {
     
      setNotification({
        type: 'error',
        message: 'Failed to upload CV. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });
    
    // Validate form
    const validation = validateProfileForm(formData);
    if (!validation.isValid) {
      setNotification({
        type: 'error',
        message: validation.errors[0]
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Update profile info
      await profileAPI.updateProfile(formData);
      
      // Update password if provided
      if (formData.currentPassword && formData.newPassword) {
        await profileAPI.changePassword(formData);
        
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
      
    setTimeout(() => {
      window.location.reload();
    }, 500); 

    } catch (err) {
      
      
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
    } finally {
      setIsSaving(false);
    }
  };

  

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
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
            showCurrentPassword={showCurrentPassword}
            showNewPassword={showNewPassword}
            showConfirmPassword={showConfirmPassword}
            setShowCurrentPassword={setShowCurrentPassword}
            setShowNewPassword={setShowNewPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        );
      case 'documents':
        return (
          <DocumentsTab 
            currentCV={formData.currentCV}
            onCVUpload={handleCVUpload}
          />
        );
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    const titles = {
      personal: { icon: 'bx-user', title: 'Personal Information' },
      security: { icon: 'bx-lock-alt', title: 'Security Settings' },
      documents: { icon: 'bx-file', title: 'Document Management' }
    };
    return titles[activeTab];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 w-full">
      <div className="max-w-7xl mx-auto w-full">
        
        
        <ProfileHeader/>

        <NotificationAlert notification={notification} />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar */}
          <div className="w-full lg:w-1/4">
            <ProfilePhotoSection 
              profileImage={formData.profileImage}
              username={formData.username}
              email={formData.email}
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
                <i className={`bx ${getTabTitle().icon} mr-2 text-blue-600`}></i>
                {getTabTitle().title}
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