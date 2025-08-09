import React from 'react';
import PostCard from './PostCard';

const PostList = ({ 
  posts, 
  isLoading, 
  error, 
  onViewDetails, 
  onApprove, 
  onReject 
}) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  // No Results
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">No job posts found with the current filters.</p>
      </div>
    );
  }

  // Posts List
  return (
    <div className="grid grid-cols-1 gap-6">
      {posts.map(job => (
        <PostCard
          key={job.id}
          job={job}
          onViewDetails={onViewDetails}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
};

export default PostList;