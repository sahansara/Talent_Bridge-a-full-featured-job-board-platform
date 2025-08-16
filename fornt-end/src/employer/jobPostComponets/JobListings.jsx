import React from 'react';
import JobCard from './jobCard';

const JobListings = ({ jobs, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {jobs.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No job listings found. Create your first job posting using the "post new job" button.
        </div>
      ) : (
        jobs.map((job, index) => (
          <JobCard
            key={job._id}
            job={job}
            onEdit={onEdit}
            onDelete={onDelete}
            isLast={index === jobs.length - 1}
          />
        ))
      )}
    </div>
  );
};

export default JobListings;