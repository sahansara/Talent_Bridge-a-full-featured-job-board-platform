import React from 'react';
import { Calendar, FileText, User, TrendingUp } from 'lucide-react';

const HeaderSection = ({ filteredJobPosts, totalApplications, newApplicationsToday = 0 }) => {
  // Calculate application rate if we have job posts
  const averageApplicationsPerPost = filteredJobPosts.length > 0 
    ? Math.round(totalApplications / filteredJobPosts.length) 
    : 0;

  return (
    <div className="mb-8">
      {/* Main Title Section */}
      <div className="mb-6 bg-white rounded-2xl p-8 shadow-xl border-l-8 border-blue-600 border border-gray-100">
  <div className="flex items-center mb-4">
    <div className="w-3 h-12 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full mr-4"></div>
    <div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-2 py-1">
        Application Management
      </h1>
      <p className="text-gray-600 text-lg font-medium">
        Review and manage job applications from candidates
      </p>
    </div>
  </div>
</div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Current Date Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Calendar className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Date</p>
              <p className="font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Job Posts Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Job Posts</p>
              <p className="font-bold text-2xl text-gray-900">{filteredJobPosts.length}</p>
            </div>
          </div>
        </div>

        {/* Total Applications Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <User className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="font-bold text-2xl text-gray-900">{totalApplications}</p>
            </div>
          </div>
        </div>

        {/* Average Applications Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. per Post</p>
              <p className="font-bold text-2xl text-gray-900">{averageApplicationsPerPost}</p>
            </div>
          </div>
        </div>
      </div>

     
          
    </div>
  );
};

export default HeaderSection;