// src/components/JobSeekerGrid.js
import React from 'react';
import { Users } from 'lucide-react';
import JobSeekerCard from './Card';

const JobSeekerGrid = ({ jobSeekers, onDeleteClick }) => {
  if (jobSeekers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No job seekers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobSeekers.map((jobSeeker, index) => (
          <JobSeekerCard 
            key={jobSeeker._id}
            jobSeeker={jobSeeker}
            index={index}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>
    </div>
  );
};

export default JobSeekerGrid;