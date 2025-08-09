import React from 'react';
import Dashboard from '../shared/Components/Dashboard';
import { jobSeekerConfig } from '../shared/config/sidebarConfig';

const SK_dashboard = () => {
  return <Dashboard config={jobSeekerConfig} />;
};

export default SK_dashboard;