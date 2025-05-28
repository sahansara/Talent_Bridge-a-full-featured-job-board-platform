// DashboardContent.jsx
import React from 'react';

const DashboardContent = ({ userData }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl md:text-3xl font-bold">Welcome Admin, {userData?.Adminfullname || 'User'}</h1>
      <p className="mt-4 text-gray-600">{userData?.adminDescription || 'No description available'}</p>
    </div>
  );
};

export default DashboardContent;