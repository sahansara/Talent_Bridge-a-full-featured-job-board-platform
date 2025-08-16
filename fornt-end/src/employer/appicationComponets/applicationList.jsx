import React from 'react';
import { User } from 'lucide-react';
import ApplicationCard from './applicationCard';

const ApplicationsList = ({ 
  job, 
  onViewDetails, 
  onCVPreview, 
  onCVDownload, 
  onUpdateStatus 
}) => {
  if (job.applications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No applications found for this job</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {job.applications.map(application => (
        <ApplicationCard
          key={application.id}
          application={application}
          jobId={job.id}
          onViewDetails={onViewDetails}
          onCVPreview={onCVPreview}
          onCVDownload={onCVDownload}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};

export default ApplicationsList;