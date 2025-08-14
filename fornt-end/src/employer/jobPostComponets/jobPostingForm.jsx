import React from 'react';
import JobFormFields from './JobformFields';
import ThumbnailUpload from './thumbnailUpload';
import JobFormButtons from './JobFormButtons';

const JobPostingForm = ({
  formData,
  handleInputChange,
  thumbnailPreview,
  handleThumbnailChange,
  removeThumbnail,
  isEditing,
  handleSubmit,
  handleCancel
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Form Fields */}
          <JobFormFields 
            formData={formData}
            handleInputChange={handleInputChange}
          />
          
          {/* Thumbnail Upload */}
          <ThumbnailUpload
            thumbnailPreview={thumbnailPreview}
            handleThumbnailChange={handleThumbnailChange}
            removeThumbnail={removeThumbnail}
          />
        </div>
        
        {/* Submit Button */}
        <JobFormButtons
          isEditing={isEditing}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default JobPostingForm;