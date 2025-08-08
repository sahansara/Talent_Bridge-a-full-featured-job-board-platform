import React from 'react';
import postValidationUtils from '../../utils/Admin/PostValidation';

const PostDetailsModal = ({ 
  isOpen, 
  job, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  if (!isOpen || !job) return null;

  const handleApprove = () => {
    onApprove(job._id || job.id);
    onClose();
  };

  const handleReject = () => {
    onReject(job._id || job.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-2xl font-bold text-gray-800">Job Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="px-6 py-4">
          {/* Job Header */}
          <div className="flex items-center mb-6">
            {postValidationUtils.hasCompanyLogo(job) ? (
              <div className="h-20 w-20 rounded-lg overflow-hidden mr-4 bg-gray-100">
                <img 
                  src={postValidationUtils.getCompanyLogoUrl(job)}
                  alt="Company logo" 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                <span className="text-3xl font-bold text-blue-500">
                  {postValidationUtils.getCompanyInitial(job)}
                </span>
              </div>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-lg text-gray-600">
                {postValidationUtils.getDisplayText(job.companyName, "Company not specified")}
              </p>
            </div>
          </div>
          
          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Location</h4>
              <p className="text-gray-800">{postValidationUtils.getDisplayText(job.location)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Job Type</h4>
              <p className="text-gray-800">{postValidationUtils.getDisplayText(job.jobType)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Salary</h4>
              <p className="text-gray-800">{postValidationUtils.getDisplayText(job.salary)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Status</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${postValidationUtils.getStatusBadgeClass(job.status)}`}>
                {postValidationUtils.getStatusDisplayText(job.status)}
              </span>
            </div>
          </div>
          
          {/* Posted Date */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Posted Date</h4>
            <p className="text-gray-800">{postValidationUtils.formatDate(job.createdAt)}</p>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h4>
            <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
              {job.description ? (
                <p>{job.description}</p>
              ) : (
                <p className="italic text-gray-500">No description provided</p>
              )}
            </div>
          </div>
          
          {/* Status Timeline */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Status Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500"></div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-sm text-gray-500">{postValidationUtils.formatDate(job.createdAt)}</p>
                </div>
              </div>
              
              {job.approvedAt && (
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-green-500"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Approved</p>
                    <p className="text-sm text-gray-500">{postValidationUtils.formatDate(job.approvedAt)}</p>
                  </div>
                </div>
              )}
              
              {job.rejectedAt && (
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-red-500"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Rejected</p>
                    <p className="text-sm text-gray-500">{postValidationUtils.formatDate(job.rejectedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-4">
          {job.status === 'pending' && (
            <>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Approve
              </button>
              
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsModal;