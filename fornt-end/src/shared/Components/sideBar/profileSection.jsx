
// src/shared/components/sidebar/ProfileSection.js
import React from 'react';
import { ICON_MAP } from './Icons';
import { API_BASE_URLS } from '../../../config/api';
const ProfileSection = ({ config, userData, handleLogout }) => {
  const LogoutIcon = ICON_MAP.LogoutIcon;
  const { name, image } = config.userDataMapping;
  
  const getProfileImageSrc = () => {
    const userImage = userData[image];
    if (!userImage) return null;
    return userImage.startsWith('http') 
      ? userImage 
      : `${API_BASE_URLS}/${userImage}`;
  };

  const userName = userData[name] || config.userDataMapping.defaultName;

  return (
    <div className="w-full p-6 border-t border-white-700 flex-shrink-0">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
          {userData[image] ? (
            <img
              src={getProfileImageSrc()}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-500 text-white text-xl">
              {userName.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-300">{config.userLabel}</p>
          <p className="text-base font-semibold truncate">{userName}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg hover:bg-red-700 bg-red-600 transition-colors duration-200"
      >
        <LogoutIcon />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileSection;