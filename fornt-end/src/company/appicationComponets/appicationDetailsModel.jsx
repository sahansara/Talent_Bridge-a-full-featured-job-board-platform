import React from 'react';
import { X, Eye, Download } from 'lucide-react';
import { applicationUtils } from '../../utils/Company/viewAppication';

const ApplicationDetailsModal = ({ 
  selectedApplication, 
  onClose, 
  onUpdateStatus, 
  onUpdateNotes, 
  onCVPreview, 
  onCVDownload, 
  jobPosts 
}) => {
  const { getStatusColor } = applicationUtils;

  if (!selectedApplication) return null;

  const handleStatusUpdate = async (newStatus) => {
    const jobId = jobPosts.find(job => 
      job.applications.some(app => app.id === selectedApplication.id)
    )?.id;
    
    if (jobId) {
      await onUpdateStatus(jobId, selectedApplication.id, newStatus);
    }
  };

  const handleNotesUpdate = (notes) => {
    const jobId = jobPosts.find(job => 
      job.applications.some(app => app.id === selectedApplication.id)
    )?.id;
    
    if (jobId) {
      onUpdateNotes(jobId, selectedApplication.id, notes);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Application Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Applicant Info */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={selectedApplication.image}
              alt={selectedApplication.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h4 className="text-lg font-medium">{selectedApplication.name}</h4>
              <p className="text-gray-600">{selectedApplication.email}</p>
              <p className="text-gray-600">{selectedApplication.phone}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Experience</label>
              <p className="text-gray-900">{selectedApplication.experience}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Location</label>
              <p className="text-gray-900">{selectedApplication.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Applied Date</label>
              <p className="text-gray-900">{new Date(selectedApplication.appliedDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Current Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedApplication.status)}`}>
                {selectedApplication.status}
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Skills</label>
            <div className="flex flex-wrap gap-2">
              {selectedApplication.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Notes</label>
            <textarea
              value={selectedApplication.notes}
              onChange={(e) => handleNotesUpdate(e.target.value)}
              placeholder="Add private notes about this candidate..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CV Download */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">CV Document</label>
            <div className="flex gap-3">
              <button
                onClick={() => onCVPreview(selectedApplication.cvUrl)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview CV
              </button>
              <button
                onClick={() => onCVDownload(selectedApplication.cvUrl)}
                className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CV
              </button>
            </div>
          </div>

          {/* Status Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => handleStatusUpdate('Accepted')}
              className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              disabled={selectedApplication.status === 'Accepted'}
            >
              Accept / Schedule Interview
            </button>
            <button
              onClick={() => handleStatusUpdate('Under Review')}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              disabled={selectedApplication.status === 'Under Review'}
            >
              Under Review
            </button>
            <button
              onClick={() => handleStatusUpdate('Rejected')}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              disabled={selectedApplication.status === 'Rejected'}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
    );
}
export default ApplicationDetailsModal;