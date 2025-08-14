import React from 'react';
import { truncateText, getThumbnailUrl } from '../../utils/employer/jobPost';

const JobCard = ({ job, onEdit, onDelete, isLast }) => {
  const thumbnailUrl = getThumbnailUrl(job.thumbnail);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-blue-100 p-6 ${!isLast ? 'border-b border-gray-200' : ''} hover:bg-blue-50 hover:shadow-md`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center">
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl}
                alt={`${job.title} thumbnail`} 
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <img 
                src="/api/placeholder/64/64" 
                alt="Default thumbnail" 
                className="w-12 h-12"
              />
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 
            className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => onEdit(job._id)}
          >
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
            {truncateText(job.description, 150)}
          </p>
          <p className="mt-2 text-sm text-gray-500">{job.location}</p>
          {job.jobType && job.salary && (
            <p className="mt-1 text-sm text-gray-500">
              {job.jobType} • {job.salary}
            </p>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0 flex space-x-2">
          <button
            onClick={() => onEdit(job._id)}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(job._id)}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-red-600 hover:text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;