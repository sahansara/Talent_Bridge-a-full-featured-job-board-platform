import React from 'react';
import Dashboard from '../shared/Components/Dashboard';
import { employerConfig } from '../shared/config/sidebarConfig';

const Em_dashboard = () => {
  return <Dashboard config={employerConfig} />;
};

export default Em_dashboard;