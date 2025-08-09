// src/shared/components/sidebar/Sidebar.js

import React from 'react';
import SidebarHeader from './SidebarHeader';
import NavigationTabs from './NavigationTabs';
import ProfileSection from './ProfileSection';

const Sidebar = ({ config, isMobileMenuOpen, closeMobileMenu, userData, handleLogout }) => {
  return (
    <div
      className={`
        fixed z-40 top-0 left-0 h-full w-72 ${config.theme.sidebarBg} text-white flex-shrink-0 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
         lg:translate-x-0  lg:h-screen
      `}
    >
      <SidebarHeader config={config} />
      <NavigationTabs config={config} closeMobileMenu={closeMobileMenu} />
      <ProfileSection config={config} userData={userData} handleLogout={handleLogout} />
    </div>
  );
};

export default Sidebar;