import React from 'react';
import { colorThemes } from '../colorThemes/colorThemes';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const Footer = ({ theme }) => {
  const currentTheme = theme;
  return (
    <footer className={`bg-gradient-to-r ${currentTheme.bg} text-white py-12 mt-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
         
          {/* Left side - copyright */}
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Talent Bridge. All rights reserved.
          </div>
          
          {/* Middle - links */}
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</a>
          </div>
          
          {/* Right side - social icons */}
          <div className="flex space-x-5 text-xl">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
              <FaLinkedin />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
              <FaGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;