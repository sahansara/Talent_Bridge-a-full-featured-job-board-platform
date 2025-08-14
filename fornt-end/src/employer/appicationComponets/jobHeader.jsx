import React from 'react';
import { MapPin, Calendar, ChevronDown } from 'lucide-react';

const JobHeader = ({ job, expandedJobs, toggleJobExpansion }) => {
  return (
    <div 
      className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
      onClick={() => toggleJobExpansion(job.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {job.category}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {job.applications.length} Applications
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Posted: {new Date(job.postDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform ${
            expandedJobs.has(job.id) ? 'rotate-180' : ''
          }`}
        />
      </div>
    </div>
  );
};

export default JobHeader;