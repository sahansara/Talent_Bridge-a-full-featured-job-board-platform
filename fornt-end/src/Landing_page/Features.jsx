import React from 'react';
import { Search, Users, TrendingUp, Star } from 'lucide-react';


export const Features = ({ theme }) => {
  const features = [
    { icon: <Search className="w-6 h-6" />, title: 'AI-Powered Search', description: 'Intelligent matching algorithm' },
    { icon: <Users className="w-6 h-6" />, title: 'Smart Matching', description: 'Perfect company-candidate fit' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Career Insights', description: 'Salary trends and analytics' },
    { icon: <Star className="w-6 h-6" />, title: 'Premium Support', description: '24/7 dedicated assistance' }
  ];

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Powerful Features</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${theme.secondary} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Features;