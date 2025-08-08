import { useState, useEffect } from 'react';
import {Briefcase, User, Building, Shield } from 'lucide-react';
import { colorThemes } from '../colorThemes/colorThemes';
import { LoginForm } from './loginForm/loginForm';
import ThemeSwitcher from '../colorThemes/themeSwitcher';



const images = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
];

const Login = () => {
  const [theme, setTheme] = useState('blue');
  const [currentImage, setCurrentImage] = useState(0);
  
  const currentTheme = colorThemes[theme];

  // Image slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  

  const userTypes = [
    { icon: <User className="w-5 h-5" />, title: 'Job Seekers', desc: 'Find your dream job' },
    { icon: <Building className="w-5 h-5" />, title: 'Employers', desc: 'Hire top talent' },
    { icon: <Shield className="w-5 h-5" />, title: 'Admins', desc: 'Platform management' }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { size: 'w-96 h-96', pos: '-top-48 -right-48', color: 'bg-purple-500', delay: '' },
          { size: 'w-80 h-80', pos: '-bottom-40 -left-40', color: 'bg-blue-500', delay: 'animation-delay-1000' },
          { size: 'w-64 h-64', pos: 'top-1/3 left-1/4', color: 'bg-pink-500', delay: 'animation-delay-2000' }
        ].map((circle, i) => (
          <div key={i} className={`absolute ${circle.pos} ${circle.size} ${circle.color} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${circle.delay}`}></div>
        ))}
      </div>
                                  
      {/* Theme Switcher */}
      <div className="absolute top-6 right-6 z-50 flex space-x-2">
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
       
      </div>

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative z-10">
        
        {/* Left Visual Section */}
        <div className="flex flex-col items-center justify-center p-8 lg:p-12">
          {/* Logo Header */}
          <div className="flex items-center mb-8">
            <div className={`bg-gradient-to-r ${currentTheme.primary} w-12 h-12 rounded-xl flex items-center justify-center mr-4`}>
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent py-4 font-sans-serif">
              Talent Bridge
            </h1>
          </div>

         {/* Main Image with Overlay */}
          <div className="relative w-full max-w-2xl mb-8">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
              <img src={images[currentImage]} alt="JobBoard Platform" 
                className="w-full h-full object-cover transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Image Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentImage ? `bg-white` : 'bg-white/40'
                  }`}></div>
                ))}
              </div>
            </div>
          </div>
                     
          {/* Welcome Text */}
          <div className="text-center text-white mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-md">
              Access your dashboard to find jobs, hire talent, or manage the platform
            </p>
          </div>

          {/* User Type Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            {userTypes.map((type, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
                <div className={`w-10 h-10 bg-gradient-to-r ${currentTheme.secondary} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  {type.icon}
                </div>
                <h3 className="text-white font-semibold text-sm">{type.title}</h3>
                <p className="text-gray-400 text-xs">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Login Form */}
        <div className="flex items-center justify-center p-8 lg:p-12 ">
          <LoginForm  currentTheme={currentTheme}/>

        </div>
      </div>
    </div>
  );
};

export default Login;