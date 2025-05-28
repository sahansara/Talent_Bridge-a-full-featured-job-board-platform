// src/Seeker_dashboard/SeekerHome.jsx
import React from 'react';

const SeekerHome = ({ fullName }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl md:text-3xl font-bold">Welcome, {fullName}</h1>
    </div>
  );
};

export default SeekerHome;
