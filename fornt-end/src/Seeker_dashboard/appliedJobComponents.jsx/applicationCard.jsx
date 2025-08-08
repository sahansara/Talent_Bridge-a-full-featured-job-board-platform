// src/components/ApplicationCard.js
import React from 'react';
import { MapPin, DollarSign, Calendar, Briefcase, ExternalLink } from 'lucide-react';
import StatusIcon from './statusIcon';
import { appliedJobsUtils } from '../../utils/jobSeeker/appliedJobs';

const ApplicationCard = ({ application, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
            {application.logo ? (
              <img 
                src={application.logo.startsWith('http') ? application.logo : `http://localhost:3000/${application.logo}`} 
                alt={`${application.company} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Briefcase className="text-gray-400" size={24} />
            )}
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${appliedJobsUtils.getStatusClass(application.status)}`}>
            <StatusIcon status={application.status} size={16} />
            {application.status}
          </span>
        </div>

        <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">{application.jobTitle}</h3>
        <p className="text-gray-700 mb-3">{application.company}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{application.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{application.salary || 'Salary not specified'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">Applied on {appliedJobsUtils.formatDate(application.appliedAt)}</span>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(application)}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          View Details
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;