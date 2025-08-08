import React from 'react';
import { FileText, AlertCircle, Loader } from 'lucide-react';

const LoadingErrorDisplay = ({ loading, error }) => {
  if (loading) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <Loader className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Applications</h3>
        <p className="text-gray-600">Please wait while we fetch your job applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-red-200">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Applications</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="text-sm text-gray-600">
          <p>Possible solutions:</p>
          <ul className="mt-2 space-y-1">
            <li>• Check if the backend server is running</li>
            <li>• Verify the API endpoint URL</li>
            <li>• Ensure you're properly authenticated</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
};

const EmptyState = () => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border">
      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No job posts found</h3>
      <p className="text-gray-600">Try adjusting your filters or search terms</p>
    </div>
  );
};

export { LoadingErrorDisplay, EmptyState };