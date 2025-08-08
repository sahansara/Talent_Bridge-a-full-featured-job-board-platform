import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
export const Navbar = ({ theme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={`fixed w-full z-40 transition-all duration-500 ${
      isScrolled ? 'bg-black/20 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-7">
          <div className="flex items-center">
            <div className={`bg-gradient-to-r ${theme.primary} w-10 h-12 rounded-xl flex items-center justify-center mr-3`}>
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent py-3 font-sans">
                Talent Bridge
            </h1>
          </div>
          
          <div className="hidden md:flex space-x-9">
             <button
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white transition-all duration-300 capitalize relative group md:text-xl"
            >
    Home
    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r ${theme.secondary} transition-all duration-300 group-hover:w-full`}></span>
  </button>
            {[  'features','jobs', 'about'].map(item => (
              <button key={item} onClick={() => scrollToSection(item)}
                className="text-gray-300 hover:text-white transition-all duration-300 capitalize relative group  md:text-xl "
              >
                {item}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r ${theme.secondary} transition-all duration-300 group-hover:w-full`}></span>
              </button>
            ))}
          </div>
          
             <button
                onClick={() => navigate('/User_login')}
                className={`bg-gradient-to-r ${theme.primary} hover:scale-105 rounded-xl px-4 md:px-6 py-2.5 font-medium transition-all duration-300 text-sm md:text-base`}
              >
                Sign In
              </button>

        </div>
      </div>
    </nav>
  );
}
export default Navbar;