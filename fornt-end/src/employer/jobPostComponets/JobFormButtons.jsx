import React from 'react';

const JobFormButtons = ({ 
  isEditing, 
  handleSubmit, 
  handleCancel 
}) => {
  return (
    <div className="mt-6 flex justify-end">
      {isEditing && (
        <button
          type="button"
          onClick={handleCancel}
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
  );
};

export default JobFormButtons;