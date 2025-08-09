import React from 'react';

const WelcomeHeader = ({ fullName }) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome, {fullName || 'User'}</h1>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Jobs</h1>
    </>
  );
};

export default WelcomeHeader;