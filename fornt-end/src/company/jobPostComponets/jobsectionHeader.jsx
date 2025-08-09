import React from 'react';
import PlusIcon from './Icon';

const JobSectionHeader = ({ toggleJobForm }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Job Post</h2>
      <button 
        onClick={toggleJobForm}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <PlusIcon />
        <span className="ml-2">post new job</span>
      </button>
    </div>
  );
};

export default JobSectionHeader;