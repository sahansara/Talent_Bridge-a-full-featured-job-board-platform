// src/components/JobSeekerCard.js
import React from 'react';
import { Trash2, User, Shield, Mail, Calendar } from 'lucide-react';
import { jobSeekerUtils } from '../../utils/Admin/jobSeeker';

const JobSeekerCard = ({ jobSeeker, index, onDeleteClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white truncate">{jobSeeker.fullName}</h3>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-sm capitalize">{jobSeeker.role}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onDeleteClick(jobSeeker._id)}
            className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            title="Delete job seeker"
          >
            <Trash2 className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4">
        {/* Email */}
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Mail className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Email</p>
            <p className="text-sm text-gray-600 truncate" title={jobSeeker.email}>{jobSeeker.email}</p>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Calendar className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Joined</p>
            <p className="text-sm text-gray-600">{jobSeekerUtils.formatDate(jobSeeker.createdAt)}</p>
          </div>
        </div>

        {/* User ID */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs font-medium text-gray-900 mb-1">User ID</p>
          <p className="text-xs text-gray-600 font-mono break-all">{jobSeeker._id}</p>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerCard;