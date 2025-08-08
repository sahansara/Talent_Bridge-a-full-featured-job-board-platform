import React from 'react';
import postValidationUtils from '../../utils/Admin/PostValidation';

const PostCard = ({ job, onViewDetails, onApprove, onReject }) => {
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    const statusClasses = postValidationUtils.getStatusBadgeClass(status);
    return `${baseClasses} ${statusClasses}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-blue-100">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            {/* Job Title & Company */}
            <div className="flex items-start space-x-4">
              {/* Company Logo/Thumbnail */}
              <div className="h-16 w-16 flex-shrink-0 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden">
                {postValidationUtils.hasCompanyLogo(job) ? (
                  <img
                    src={postValidationUtils.getCompanyLogoUrl(job)}
                    alt={`${job.title} thumbnail`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-3xl font-bold text-gray-500">
                    {postValidationUtils.getCompanyInitial(job)}
                  </div>
                )}
              </div>

              {/* Job Info */}
              <div>
                <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                <p className="text-gray-600">
                  {postValidationUtils.getDisplayText(job.companyName, "Company info not available")}
                </p>
                <div className="mt-2 flex flex-wrap gap-y-1">
                  <span className="mr-4 text-gray-700">
                    <i className="fas fa-map-marker-alt mr-1"></i> 
                    {postValidationUtils.getDisplayText(job.location, "")}
                  </span>
                  <span className="text-gray-700">
                    <i className="fas fa-money-bill-wave mr-1"></i> 
                    {postValidationUtils.getDisplayText(job.salary, "")}
                  </span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mt-4">
              <p className="text-gray-600 line-clamp-2">
                {postValidationUtils.truncateText(job.description, 150)}
              </p>
            </div>

            {/* Meta Info */}
            <div className="mt-4 text-sm text-gray-500">
              <p>Posted: {postValidationUtils.formatDate(job.createdAt)}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="relative top-4 right-4">
            <span className={getStatusBadge(job.status)}>
              {postValidationUtils.getStatusDisplayText(job.status)}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-4 md:mt-0 md:ml-6 flex flex-col justify-between">
            <button
              onClick={() => onViewDetails(job.id)}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center justify-center"
            >
              <span>View</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => onApprove(job.id)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md font-medium flex items-center justify-center"
              >
                <span>Approve</span>
              </button>
              <button
                onClick={() => onReject(job.id)}
                className="px-5 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;