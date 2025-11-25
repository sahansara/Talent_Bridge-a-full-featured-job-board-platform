import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { API_BASE_URLS } from '../../config/api';


export const ApplyConfirmationModal = ({ isOpen, onClose, selectedJob, userProfile, userCV, onApply, isApplying }) => {
  
  
  useEffect(() => {
  if (isOpen) {
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
  } else {
    // Restore scrolling
    document.body.style.overflow = 'unset';
  }

  // Cleanup function to restore scrolling when component unmounts
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [isOpen]);
  if (!isOpen || !selectedJob) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-8 py-6">
          <h3 className="text-3xl font-bold text-gray-800">Confirm Application</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transform hover:scale-110 transition-transform"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="px-8 py-6">
          {/* Job Information Section */}
          <div className="mb-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h4 className="text-xl font-bold text-blue-800 mb-3">Job Details</h4>
            <p className="text-lg text-gray-700 mb-4">
              You are applying for: <span className="font-semibold text-blue-700">{selectedJob.title}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">employer:</p>
                <p className="font-medium text-gray-800">{selectedJob.employer}</p>
              </div>
              {selectedJob.location && (
                <div>
                  <p className="text-gray-600 mb-1">Location:</p>
                  <p className="font-medium text-gray-800">{selectedJob.location}</p>
                </div>
              )}
              {selectedJob.salary && (
                <div>
                  <p className="text-gray-600 mb-1">Salary Range:</p>
                  <p className="font-medium text-gray-800">{selectedJob.salary}</p>
                </div>
              )}
              {selectedJob.jobType && (
                <div>
                  <p className="text-gray-600 mb-1">Job Type:</p>
                  <p className="font-medium text-gray-800">{selectedJob.jobType}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* User Profile Summary */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Your Profile Summary</h4>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {userProfile?.profileImage ? (
                <img 
                  src={userProfile.profileImage.startsWith('/profile-images/') ?
                      `/api/placeholder/96/96` : 
                      (userProfile.profileImage.startsWith('http') ? 
                        userProfile.profileImage : 
                        `${API_BASE_URLS}/${userProfile.profileImage}`)} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                  <span className="text-3xl font-bold text-blue-500">
                    {(userProfile?.username || "U").charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-xl font-semibold">{userProfile?.username || "User"}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">{userProfile?.email || "No email provided"}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="text-gray-600">{userProfile?.phone || "No phone provided"}</p>
                  </div>
                </div>
                {userProfile?.skills && userProfile.skills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* CV Preview Section */}
          <div className="mb-8">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Your CV</h4>
            {userCV ? (
              <div className="border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center md:justify-between space-y-4 md:space-y-0 bg-gray-50">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-lg">{userCV.split('/').pop() || "Your CV"}</p>
                    <p className="text-sm text-gray-500">PDF Document</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (userCV.startsWith('/documents/')) {
                      alert('CV Preview: This is a dummy CV file for UI testing');
                    } else {
                      window.open(userCV.startsWith('http') ? userCV : `${API_BASE_URLS}/${userCV}`, '_blank');
                    }
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview CV
                </button>
              </div>
            ) : (
              <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50 text-yellow-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-lg">No CV uploaded</p>
                  <p className="text-sm">Please upload your CV in your profile before applying.</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Privacy Note Section */}
          <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Privacy Notice</h4>
            <p className="text-gray-600">
              By clicking "Yes, Apply", your CV and profile information will be sent to {selectedJob.employer}. 
              The employer will use your information for the hiring process according to their privacy policy.
            </p>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-8 py-6 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onApply}
            disabled={isApplying || !userCV}
            className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center ${
              !userCV ? 
              'bg-gray-300 text-gray-500 cursor-not-allowed' : 
              'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 hover:shadow-md'
            }`}
          >
            {isApplying ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Applying...</span>
              </>
            ) : (
              <>
                <span>Yes, Apply</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyConfirmationModal;