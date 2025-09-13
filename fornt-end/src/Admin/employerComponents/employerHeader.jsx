// src/components/EmployerHeader.js
import React from 'react';
import { Users } from 'lucide-react';

const EmployerHeader = ({ totalCompanies }) => {
  return (
    <div className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">employer Management</h1>
              <p className="text-gray-600">Manage and monitor employer accounts</p>
            </div>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-600 font-semibold">{totalCompanies} Total Companies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerHeader;