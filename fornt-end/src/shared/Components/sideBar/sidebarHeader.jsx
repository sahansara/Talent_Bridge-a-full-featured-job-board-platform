import React from 'react';
import { ICON_MAP } from './Icons';

const SidebarHeader = ({ config }) => {
  const HeaderIcon = ICON_MAP[config.headerIcon];

  return (
    <div className="p-6 flex items-center space-x-3 mt-12 lg:mt-0">
      <HeaderIcon />
      <span className="text-2xl font-bold">{config.title}</span>
    </div>
  );
};

export default SidebarHeader;