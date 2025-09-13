import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, activeTab }) => {
  return (
    <div className="p-4 sm:p-6 bg-blue-50 border-b border-gray-200">
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'jobpost' ? 'job vacancy' : 'application'} notifications...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white border border-gray-300 rounded-lg shadow-sm 
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                     transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm sm:text-base"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;