import React, { useRef } from 'react';

const ProfilePhotoSection = ({ 
  formData, 
  onProfilePhotoUpdate, 
  isSaving 
}) => {
  const fileInputRef = useRef(null);

  return (
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
            disabled={isSaving}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <i className={`bx ${isSaving ? 'bx-loader-alt bx-spin' : 'bxs-camera'}`}></i>
          </button>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={onProfilePhotoUpdate}
          className="hidden" 
          accept="image/*"
          disabled={isSaving}
        />
        
        <h2 className="text-xl font-semibold text-gray-800 mb-1">{formData.companyName}</h2>
        <p className="text-gray-500 text-sm">{formData.email}</p>
        {formData.companyWebsite && (
          <a 
            href={formData.companyWebsite} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 text-sm mt-1 hover:underline flex items-center"
          >
            <i className="bx bx-link-external mr-1"></i> Website
          </a>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoSection;