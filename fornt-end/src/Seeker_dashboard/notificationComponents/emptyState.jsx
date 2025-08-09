// src/components/EmptyState.js
import React from 'react';
import { FileText, Users } from 'lucide-react';

const EmptyState = ({ activeTab, searchTerm }) => {
  return (
    <div className="text-center py-12 sm:py-16">
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        {activeTab === 'jobpost' ? (
          <FileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
        ) : (
          <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
        No {activeTab === 'jobpost' ? 'job vacancy' : 'application'} notifications found
      </h3>
      <p className="text-gray-500 text-sm sm:text-base">
        {searchTerm 
          ? 'Try adjusting your search terms' 
          : `You'll see ${activeTab === 'jobpost' ? 'job vacancy updates' : 'application updates'} here when they arrive`
        }
      </p>
    </div>
  );
};

export default EmptyState;
