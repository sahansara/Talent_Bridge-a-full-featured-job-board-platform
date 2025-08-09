import React from 'react';
import { FileText, Users } from 'lucide-react';

const EmptyState = ({ activeTab, searchTerm }) => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
        {activeTab === 'jobpost' ? (
          <FileText className="w-12 h-12 text-gray-400" />
        ) : (
          <Users className="w-12 h-12 text-gray-400" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No {activeTab === 'jobpost' ? 'job post' : 'application'} notifications found
      </h3>
      <p className="text-gray-500">
        {searchTerm 
          ? 'Try adjusting your search terms' 
          : `You'll see ${activeTab === 'jobpost' ? 'job post updates' : 'application updates'} here when they arrive`
        }
      </p>
    </div>
  );
};

export default EmptyState;