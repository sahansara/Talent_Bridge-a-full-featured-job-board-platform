// src/components/EmployerCard.js
import React from 'react';
import { Trash2, User, Shield, Mail, Phone, Globe, Calendar } from 'lucide-react';
import { notificationUtils } from '../../utils/Admin/employer';

const EmployerCard = ({ employer, index, onDeleteClick }) => {
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
            
           <img 
            src={employer.image.startsWith('http') ? employer.image : `http://localhost:3000/${employer.image}`} 
            alt={'employer'}
            className="h-8 w-8 text-white"
            />
        
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white truncate">{employer.employerName}</h3>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-blue-200" />
                <span className="text-blue-200 text-sm capitalize">{employer.role}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onDeleteClick(employer._id)}
            className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
            title="Delete employer"
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
            <p className="text-sm text-gray-600 truncate" title={employer.email}>{employer.email}</p>
          </div>
        </div>

        {/* Contact Number */}
        <div className="flex items-start space-x-3">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <Phone className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Contact Number</p>
            <p className="text-sm text-gray-600">{employer.contactNumber || 'Not available'}</p>
          </div>
        </div>

        {/* employer Website */}
        <div className="flex items-start space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Globe className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Website</p>
            {employer.employerWebsite ? (
              <a 
                href={employer.employerWebsite} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 truncate block"
                title={employer.employerWebsite}
              >
                {employer.employerWebsite}
              </a>
            ) : (
              <p className="text-sm text-gray-600">Not available</p>
            )}
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Calendar className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Joined</p>
            <p className="text-sm text-gray-600">{notificationUtils.formatDate(employer.createdAt)}</p>
          </div>
        </div>

        {/* employer ID */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs font-medium text-gray-900 mb-1">employer ID</p>
          <p className="text-xs text-gray-600 font-mono break-all">{employer._id}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployerCard;