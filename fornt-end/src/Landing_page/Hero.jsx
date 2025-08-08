import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChevronDown ,ArrowRight} from 'lucide-react';

import fullStack from '../assets/11.jpg';
import marketing from '../assets/12.jpg';
import web from '../assets/4.jpg';


export const Hero = ({ theme }) => {
  const [userType, setUserType] = useState('Select user type');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  

const images = [web,fullStack,marketing];

const statsData = [
  { number: 50000, label: 'Active Jobs', gradient: 'from-blue-500 to-purple-500' },
  { number: 100000, label: 'Companies', gradient: 'from-green-500 to-teal-400' },
  { number: 1000000, label: 'Job Seekers', gradient: 'from-yellow-400 to-red-500' }
];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [counts, setCounts] = useState(statsData.map(() => 0));
  

  // Image carousel effect
  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds
    return () => clearInterval(imageTimer);
  }, []);

  // Animated counters
  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prevCounts) =>
        prevCounts.map((count, index) => {
          const target = statsData[index].number;
          const increment = target / 100;
          if (count < target) {
            const newCount = Math.min(count + increment, target);
            return Math.floor(newCount);
          }
          return target;
        })
      );
    }, 30); // speed of counting

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="relative pt-24 md:pt-32 pb-16 md:pb-24">
      {/* Hero Image Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop" 
          alt="Modern office" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-gray-300 mb-6">
              🚀 New features launched
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Your Dream Job
              </span>
              <br />
              <span className={`bg-gradient-to-r ${theme.secondary} bg-clip-text text-transparent-40`}>
                Awaits You
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-gray-300 leading-relaxed">
              Connect with top companies worldwide. Experience the future of job searching with AI-powered matching.
            </p>

            <div className="max-w-sm mx-auto lg:mx-0 space-y-4">
              <div className="relative">
                <button
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-left flex justify-between items-center hover:bg-white/20 transition-all duration-300"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="text-white">I'm a {userType !== 'Select user type' ? userType.toLowerCase() : '...'}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl mt-2 shadow-2xl z-30 overflow-hidden">
                    {['Job Seeker', 'Employer', 'Administrator'].map(type => (
                      <div
                        key={type}
                        className="px-6 py-4 cursor-pointer hover:bg-white/10 transition-all duration-200 text-white"
                        onClick={() => {
                          setUserType(type);
                          setDropdownOpen(false);

                          
                        }}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                    className={`w-full bg-gradient-to-r ${theme.primary} hover:scale-105 rounded-2xl px-8 py-4 font-semibold transition-all duration-300 group`}
                    onClick={() => {
                      switch (userType.toLowerCase()) {
                        case 'job seeker':
                          navigate('/Seeker_register');
                          break;
                        case 'employer':
                          navigate('/Employer_register');
                          break;
                        case 'administrator':
                          navigate('/admin');
                          break;
                        default:
                          alert('Please select a user type first!');
                          break;
                      }
                    }}
                  >
                    <span className="flex items-center justify-center">
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>

            </div>
          </div>

   <div className="px-4 py-6 md:px-12 max-w-[800px] w-full mx-auto">
  <div className="relative w-full md:w-[700px] h-[200px] sm:h-[250px] md:h-[400px] mx-auto">
    <img
      src={images[currentImageIndex]}
      alt="Team"
      className="w-full h-full object-cover rounded-[20px] md:rounded-[40px] shadow-xl md:shadow-2xl transition-all duration-1000"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-[20px] md:rounded-[40px]"></div>
  </div>
</div>
</div>

       {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-16">
        {statsData.map((stat, index) => (
          <div key={index} className="text-center">
            <div
              className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
            >
              {counts[index].toLocaleString()}+
            </div>
            <div className="text-gray-400 text-xs md:text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
      </div>
  );
}

export default Hero;