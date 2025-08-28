import React, { useRef } from 'react';

const ProfilePhotoSection = ({ 
  profileImage, 
  username, 
  email, 
  onProfilePhotoUpdate, 
  isSaving 
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          {profileImage ? (
            <img 
              src={profileImage}
              alt="Profile" 
              className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
              
            />
          ) : (
            <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
              <i className="bx bx-user text-blue-500 text-4xl"></i>
            </div>
          )}
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={isSaving}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            <i className="bx bxs-camera"></i>
          </button>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={onProfilePhotoUpdate}
          className="hidden" 
          accept="image/*"
        />
        
        <h2 className="text-xl font-semibold text-gray-800 mb-1">{username}</h2>
        <p className="text-gray-500 text-sm">{email}</p>
      </div>
    </div>
  );
};

export default ProfilePhotoSection;