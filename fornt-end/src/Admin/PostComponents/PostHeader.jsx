import React, { useState, useEffect } from 'react';
import {  Database } from 'lucide-react';
import SearchBar from '../shared/searchBar';



const PostHeader = ({  filterStatus, onFilterChange, searchTerm, onSearchChange,totalPost,}) => {

    
  return (
    <div className="mb-6">
      <div className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-blue-600 p-3 rounded-xl">
              < Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Vacancy Post Management</h1>
              <p className="text-gray-600">Manage and monitor job vacancy Posts</p>
            </div>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-blue-600 font-semibold">{totalPost} Total Job Post</span>
          </div>
        </div>
      </div>
    </div>

     <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={onSearchChange} // FIXED: Use onSearchChange instead of setSearchTerm
        placeholder="Search job posts..."
      />
        {/* Filters moved down 2 lines and centered */}
        <div className="mt-6 flex flex-col items-center">
        {/* Status Filter */}
        <div className="relative mb-4">
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-blue-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PostHeader;