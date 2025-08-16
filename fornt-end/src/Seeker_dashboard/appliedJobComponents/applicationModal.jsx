
// src/components/ApplicationModal.js
import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import StatusIcon from './statusIcon';
import { appliedJobsUtils } from '../../utils/jobSeeker/appliedJobs';

const ApplicationModal = ({ isOpen, application, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 bg-white z-10">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Job Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {/* Job Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {application.logo ? (
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={
                    application.logo.startsWith('http') ? application.logo : `http://localhost:3000/${application.logo}`
                  } 
                  alt="employer logo" 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl sm:text-3xl font-bold text-blue-500">
                  {(application.employer || application.title || "J").charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {application.title || application.jobTitle}
                </h1>
                <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium w-fit ${appliedJobsUtils.getStatusClass(application.status)}`}>
                  <StatusIcon status={application.status} size={16} />
                  {application.status}
                </div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 truncate">
                {application.employer || "employer not specified"}
              </p>
            </div>
          </div>
          
          {/* Job Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Location
              </h4>
              <p className="text-gray-800 font-medium">{application.location || "Not specified"}</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"/>
                </svg>
                Job Type
              </h4>
              <p className="text-gray-800 font-medium">{application.jobType || "Not specified"}</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:col-span-2 lg:col-span-1">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
                Salary
              </h4>
              <p className="text-gray-800 font-medium">{application.salary || "Not specified"}</p>
            </div>
          </div>
          
          {/* Posted Date */}
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Posted Date
            </h4>
            <p className="text-gray-800 font-medium">
              {application.approvedAt ? appliedJobsUtils.formatDate(application.approvedAt) : "Not available"}
            </p>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Description
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              {application.description ? (
                <div className="prose max-w-none text-gray-700 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                  {application.description}
                </div>
              ) : (
                <p className="italic text-gray-500 text-sm sm:text-base">No description provided</p>
              )}
            </div>
          </div>

          {/* Application Timeline */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Application Timeline
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={16} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm sm:text-base">Application submitted</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{appliedJobsUtils.formatDate(application.appliedAt)}</p>
                </div>
              </div>
              
              {application.status !== 'Pending' && (
                <div className="flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    application.status === 'Approved' ? 'bg-green-100' : 
                    application.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <CheckCircle size={16} className={`${
                      application.status === 'Approved' ? 'text-green-600' : 
                      application.status === 'Rejected' ? 'text-red-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      Application {application.status.toLowerCase()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {appliedJobsUtils.formatDate(application.updatedAt || application.appliedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Modal Footer - Sticky */}
        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-gray-50 sticky bottom-0">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;