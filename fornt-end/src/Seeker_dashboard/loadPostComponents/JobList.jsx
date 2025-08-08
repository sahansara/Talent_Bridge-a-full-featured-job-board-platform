import React from 'react';
import JobCard from './JobCard';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-40">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const NoJobsFound = () => (
  <div className="bg-white rounded-lg shadow-md p-8 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 className="text-xl font-medium text-gray-800 mb-2">No jobs found</h3>
    <p className="text-gray-600">Try adjusting your search criteria or check back later for new opportunities.</p>
  </div>
);

const JobList = ({ loading, jobs, handleViewJob, handleApplyJob }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {jobs.map(job => (
        <JobCard 
          key={job.id}
          job={job}
          handleViewJob={handleViewJob}
          handleApplyJob={handleApplyJob}
        />
      ))}
      
      {jobs.length === 0 && <NoJobsFound />}
    </div>
  );
};

export default JobList;