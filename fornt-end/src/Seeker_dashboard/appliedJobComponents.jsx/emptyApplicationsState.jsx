
// src/components/EmptyApplicationsState.js
import React from 'react';
import { Briefcase } from 'lucide-react';

const EmptyApplicationsState = ({ searchTerm }) => {
  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
      <Briefcase className="mx-auto mb-3 text-gray-400" size={36} />
      <h3 className="text-lg font-medium text-gray-800 mb-1">No applications found</h3>
      <p className="text-gray-600">
        {searchTerm ? "Try different search terms" : "You haven't applied to any jobs yet"}
      </p>
    </div>
  );
};

export default EmptyApplicationsState;