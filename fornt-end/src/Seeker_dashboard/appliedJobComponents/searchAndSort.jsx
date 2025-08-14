// src/components/SearchAndSort.js
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SearchAndSort = ({ searchTerm, setSearchTerm, sortOrder, onSort }) => {
  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-6 w-full max-w-7xl">
      {/* Search Bar */}
      <div className="relative flex-1">
        <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-200 transition-shadow duration-300">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full bg-white border border-gray-300 hover:border-blue-400 pl-4 pr-10 py-2 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="absolute right-7 top-1/2 transform -translate-y-1/2 text-blue-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Sort Button */}
      <button 
        onClick={onSort}
        className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 hover:bg-gray-50 shadow"
      >
        Sort by date 
        {sortOrder === 'newest' ? 
          <ChevronDown size={16} /> : 
          <ChevronUp size={16} />
        }
      </button>
    </div>
  );
};

export default SearchAndSort;
