import React from 'react';
import CountUp from 'react-countup';
import { CheckCircle } from 'lucide-react';

export const About = ({ theme }) => {
  const stats = [
    { end: 2023, label: 'Year Founded' },
    { end: 500000, label: 'Applications Processed' },
    { end: 97, label: 'Satisfaction Rate', suffix: '%' },
    { end: 100, label: 'Global Reach', suffix: '+' },
    { end: 8000, label: 'Registered Employers', suffix: '+' },
    { end: 1500000, label: 'Jobs Listed', suffix: '+' }
  ];

  const highlights = [
    'Launched in 2023 with cutting-edge MERN & Tailwind technology',
    'Secure JWT-based authentication system with multi-role access',
    'Supports Job Seekers, Employers, and Admins with unique dashboards',
    'Smart job matching, live application tracking & real-time updates',
    'Admin control panel for managing users, job listings & analytics'
  ];

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              About Talent Bridge
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Talent Bridge is a modern, full-stack recruitment platform that empowers job seekers, employers, and admins with seamless features to simplify the hiring process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {highlights.map((text, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-gray-300">{text}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((item, index) => (
              <div key={index} className="text-center p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${theme.secondary} bg-clip-text text-transparent mb-2`}>
                  <CountUp end={item.end} duration={2} suffix={item.suffix || ''} separator="," />
                </div>
                <div className="text-gray-400 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export default About;