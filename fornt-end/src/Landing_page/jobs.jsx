
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';


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
            <div key={index} className="group p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                  <p className="text-gray-400 text-sm">{job.company} · {job.location}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">{job.type}</span>
              </div>
              
              <p className="text-xl font-bold text-white mb-3">{job.salary}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">{tag}</span>
                ))}
              </div>
              
              <button className="flex items-center text-blue-400 hover:text-white font-medium transition-all duration-300">
                View Details <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
           onClick={() => navigate('/User_login')} 
           className={`bg-gradient-to-r ${theme.primary} hover:scale-105 rounded-2xl px-8 py-4 font-semibold transition-all duration-300`}>
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  );
}

export default Jobs;