import { ArrowRight, MapPin, DollarSign, Clock } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Jobs = ({ theme }) => {
  const jobs = [
    { title: 'Senior Frontend Developer', company: 'TechCorp', location: 'Remote', salary: '$120k - $150k', type: 'Full-time', tags: ['React', 'TypeScript'] },
    { title: 'Marketing Manager', company: 'BrandGrowth', location: 'New York, NY', salary: '$90k - $110k', type: 'Full-time', tags: ['Digital Marketing', 'SEO'] }
  ];
   const navigate = useNavigate();
  return (
    <section id="jobs" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Featured Jobs</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {jobs.map((job, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-blue-400/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-5">
                {/* Header with title and type badge */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1 truncate">{job.title}</h3>
                    <p className="text-gray-300 text-sm font-medium">{job.company}</p>
                  </div>
                  <span className="ml-3 px-2.5 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30">
                    {job.type}
                  </span>
                </div>

                {/* Location and Salary Row */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-white font-bold">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>{job.salary}</span>
                  </div>
                </div>
                
                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/30">
                      {tag}
                    </span>
                  ))}
                </div>
                
              
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-blue-400/30 transition-all duration-500"></div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/User_login')}
           className={`bg-gradient-to-r ${theme?.primary || 'from-blue-600 to-purple-600'} hover:scale-105 rounded-2xl px-8 py-4 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  );
}

export default Jobs;