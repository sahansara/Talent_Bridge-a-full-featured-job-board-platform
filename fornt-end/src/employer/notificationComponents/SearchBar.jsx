import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, activeTab }) => {
  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
      <div className="relative max-w-2xl mx-auto">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'jobpost' ? 'job post' : 'application'} notifications...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl shadow-sm 
                     focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 
                     transition-all duration-300 text-gray-700 placeholder-gray-400
                     hover:border-blue-300 hover:shadow-md"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;