import React from 'react';

const JobDetailsModal = ({ 
  isModalOpen, 
  selectedJob, 
  closeModal, 
  handleApplyJob, 
  formatDate 
}) => {
  if (!isModalOpen || !selectedJob) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-2xl font-bold text-gray-800">Job Details</h3>
          <button
            onClick={closeModal}
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
            {selectedJob.logo ? (
              <div className="h-20 w-20 rounded-lg overflow-hidden mr-4 bg-gray-100">
                <img 
                  src={
                    selectedJob.logo.startsWith('http') ? selectedJob.logo : `http://localhost:3000/${selectedJob.logo}`
                  } 
                  alt="Company logo" 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                <span className="text-3xl font-bold text-blue-500">
                  {(selectedJob.company || selectedJob.title || "J").charAt(0)}
                </span>
              </div>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h1>
              <p className="text-lg text-gray-600">{selectedJob.company || "Company not specified"}</p>
            </div>
          </div>
          
          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Location</h4>
              <p className="text-gray-800">{selectedJob.location || "Not specified"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Job Type</h4>
              <p className="text-gray-800">{selectedJob.jobType || "Not specified"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Salary</h4>
              <p className="text-gray-800">{selectedJob.salary || "Not specified"}</p>
            </div>
          </div>
          
          {/* Posted Date */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Posted Date</h4>
            <p className="text-gray-800">{selectedJob.approvedAt ? formatDate(selectedJob.approvedAt) : "Not available"}</p>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h4>
            <div className="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-line">
              {selectedJob.description ? (
                <p>{selectedJob.description}</p>
              ) : (
                <p className="italic text-gray-500">No description provided</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-4">
          <button
            onClick={() => handleApplyJob(selectedJob.id)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md font-medium flex items-center justify-center"
          >
            <span>Apply</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
          
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;