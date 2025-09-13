import React from 'react';
import { useLocation } from 'react-router-dom';
import { ICON_MAP } from './Icons';

const NavigationTabs = ({ config, closeMobileMenu, countsData, countsLoading }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mt-8 border-t border-white-700 flex-1 overflow-y-auto">
      <div className="px-6 py-5">
        {config.navigation.map((item) => {
          const IconComponent = ICON_MAP[item.icon];
          
          
          return (
            <a 
              key={item.path}
              href={item.href} 
              onClick={closeMobileMenu}
              className={`flex items-center mt-4 py-3 px-4 rounded-lg ${config.theme.hoverBg} transition-colors duration-200 relative ${
                isActive(item.path) ? config.theme.activeBg : ""
              }`}
            >
              <IconComponent />
              <span className="ml-4 text-sm md:text-base">{item.label}</span>
              
              
                
            
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationTabs;
