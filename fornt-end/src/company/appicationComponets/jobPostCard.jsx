import React from 'react';
import JobHeader from './jobHeader';
import ApplicationsList from './applicationList';

const JobPostCard = ({ 
  job, 
  expandedJobs, 
  toggleJobExpansion, 
  onViewDetails, 
  onCVPreview, 
  onCVDownload, 
  onUpdateStatus 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Job Header */}
      <JobHeader 
        job={job}
        expandedJobs={expandedJobs}
        toggleJobExpansion={toggleJobExpansion}
      />

      {/* Applications */}
      {expandedJobs.has(job.id) && (
        <div className="p-6">
          <ApplicationsList
            job={job}
            onViewDetails={onViewDetails}
            onCVPreview={onCVPreview}
            onCVDownload={onCVDownload}
            onUpdateStatus={onUpdateStatus}
          />
        </div>
      )}
    </div>
  );
};

export default JobPostCard;