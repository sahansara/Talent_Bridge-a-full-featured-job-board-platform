import React from 'react';
import { ICON_MAP } from './Icons';
import { colorThemes } from '../../../colorThemes/colorThemes';

const MobileHeader = ({ config, isMobileMenuOpen, toggleMobileMenu }) => {
  const HeaderIcon = ICON_MAP[config.headerIcon];
  const MenuIcon = ICON_MAP[isMobileMenuOpen ? 'CloseIcon' : 'MenuIcon'];

  return (
    <div className={`fixed top-0 left-0 right-0 z-30 lg:hidden bg-gradient-to-b ${colorThemes.blue.bg} text-white p-4 flex justify-between items-center`}>
      <div className="flex items-center space-x-2">
        <HeaderIcon />
        <span className="text-xl font-bold">{config.title}</span>
      </div>
      <button
        onClick={toggleMobileMenu}
        className="text-white focus:outline-none"
      >
        <MenuIcon />
      </button>
    </div>
  );
};

export default MobileHeader;


