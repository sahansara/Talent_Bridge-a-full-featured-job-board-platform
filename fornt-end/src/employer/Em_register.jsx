import { useState, useEffect } from 'react';
import { Briefcase, Building2, Rocket, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './registerComponents/registerForn';
import { colorThemes } from '../colorThemes/colorThemes';
import ThemeSwitcher from '../colorThemes/themeSwitcher';

const images = [
  'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop'
];

const benefits = [
  { icon: <Building2 className="w-5 h-5" />, title: 'Create employer Profile', desc: 'Represent your business' },
  { icon: <Rocket className="w-5 h-5" />, title: 'Post Jobs', desc: 'Find qualified candidates fast' },
  { icon: <Shield className="w-5 h-5" />, title: 'Secure Platform', desc: 'Trusted by thousands of companies' }
];

const EmpRegister = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('blue');
  const [currentImage, setCurrentImage] = useState(0);

  const currentTheme = colorThemes[theme];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} relative overflow-hidden`}>
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { size: 'w-96 h-96', pos: '-top-48 -right-48', color: 'bg-blue-500', delay: '' },
          { size: 'w-80 h-80', pos: '-bottom-40 -left-40', color: 'bg-blue-400', delay: 'animation-delay-1000' },
          { size: 'w-64 h-64', pos: 'top-1/3 left-1/4', color: 'bg-blue-300', delay: 'animation-delay-2000' }
        ].map((circle, i) => (
          <div 
            key={i} 
            className={`absolute ${circle.pos} ${circle.size} ${circle.color} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${circle.delay}`}
          />
        ))}
      </div>

      {/* Theme Switcher */}
      <div className="absolute top-6 right-6 z-50 flex space-x-2">
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>

      {/* Login Button */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={() => navigate('/Employer_login')}
          className={`bg-gradient-to-r ${currentTheme.primary} hover:scale-105 rounded-xl px-6 py-2.5 font-medium transition-all duration-300 text-white text-sm`}
        >
          Login
        </button>
      </div>

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        
        {/* Left Visual Side */}
        <div className="flex flex-col items-center justify-center p-8 lg:p-12">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className={`bg-gradient-to-r ${currentTheme.primary} w-12 h-12 rounded-xl flex items-center justify-center mr-4`}>
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              JobBoard
            </h1>
          </div>

          {/* Slideshow Image */}
          <div className="relative w-full max-w-lg mb-8">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={images[currentImage]} 
                alt="Employer Portal" 
                className="w-full h-full object-cover transition-all duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentImage ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center text-white mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Join as Employer
              </span>
            </h2>
            <p className="text-lg text-blue-200 max-w-md">
              Register your company, post job openings, and find the right talent faster with JobBoard
            </p>
          </div>

          {/* Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center hover:bg-white/20 transition-all duration-300"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.secondary} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  {benefit.icon}
                </div>
                <h3 className="text-white font-semibold text-sm">{benefit.title}</h3>
                <p className="text-blue-200 text-xs">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Employer Form Section */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <RegisterForm currentTheme={currentTheme} />
        </div>
      </div>
    </div>
  );
};

export default EmpRegister;
