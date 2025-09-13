import React from 'react';
import { Eye, Download, Clock } from 'lucide-react';
import { applicationUtils } from "../../utils/employer/viewAppication";

const ApplicationCard = ({ 
  application, 
  jobId, 
  onViewDetails, 
  onCVPreview, 
  onCVDownload, 
  onUpdateStatus 
}) => {
  const { getStatusColor } = applicationUtils;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Applicant Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={application.image}
          alt={application.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{application.name}</h4>
          <p className="text-sm text-gray-600">{application.experience} experience</p>
        </div>
      </div>

      {/* Status */}
      <div className="mb-3">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </div>

      {/* Applied Date */}
      <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
        <Clock className="w-4 h-4" />
        Applied: {new Date(application.appliedDate).toLocaleDateString()}
      </div>

      {/* Skills Preview */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {application.skills.slice(0, 2).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {skill}
            </span>
          ))}
          {application.skills.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{application.skills.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => onViewDetails(application)}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 inline mr-1" />
          View Details
        </button>

        <button
          onClick={() => onCVPreview(application.cvUrl)}
          className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          title="Preview CV"
        >
          <Eye className="w-4 h-4" />
        </button>
                                
        <button
          onClick={() => onCVDownload(application.cvUrl)}
          className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          title="Download CV"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Status Actions */}
      <div className="flex gap-1">
        <button
          onClick={() => onUpdateStatus(jobId, application.id, 'Accepted')}
          className="flex-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded hover:bg-green-200 transition-colors"
          disabled={application.status === 'Accepted'}
        >
          Accept
        </button>
        <button
          onClick={() => onUpdateStatus(jobId, application.id, 'Under Review')}
          className="flex-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded hover:bg-yellow-200 transition-colors"
          disabled={application.status === 'Under Review'}
        >
          Review
        </button>
        <button
          onClick={() => onUpdateStatus(jobId, application.id, 'Rejected')}
          className="flex-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded hover:bg-red-200 transition-colors"
          disabled={application.status === 'Rejected'}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;