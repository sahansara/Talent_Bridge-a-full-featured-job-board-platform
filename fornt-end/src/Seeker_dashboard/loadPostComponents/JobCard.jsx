import React from 'react';

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1113.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const JobCard = ({ job, handleViewJob, handleApplyJob }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-blue-100">
      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-start md:items-center space-x-4 mb-4 md:mb-0">
          <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
            {job.logo ? (
              <img 
                src={job.logo.startsWith('http') ? job.logo : `http://localhost:3000/${job.logo}`} 
                alt={`${job.employer} logo`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200">{job.title}</h2>
            <p className="text-gray-600 hover:text-gray-800 transition-colors duration-200">{job.employer}</p>
            <div className="flex items-center mt-1 text-gray-500">
              <LocationIcon />
              <span className="ml-1 text-sm">{job.location}</span>
            </div>
            <div className="mt-2 inline-block px-3 py-1 bg-green-50 text-green-600 font-medium rounded-full">{job.salary}</div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={() => handleViewJob(job.id)}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center justify-center"
          >
            <span>View</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => handleApplyJob(job.id)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 hover:shadow-md font-medium flex items-center justify-center"
          >
            <span>Apply</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;