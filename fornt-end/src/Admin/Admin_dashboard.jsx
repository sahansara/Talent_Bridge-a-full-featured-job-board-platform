import React from 'react';
import Dashboard from '../shared/Components/Dashboard';
import { adminConfig } from '../shared/config/sidebarConfig';

const Admin_dashboard = () => {
  return <Dashboard config={adminConfig} />;
};

export default Admin_dashboard;