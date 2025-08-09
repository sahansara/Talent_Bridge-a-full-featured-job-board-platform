// src/shared/config/sidebarConfig.js
import { ROLES, USER_TYPES } from './roleConstants';
import {colorThemes} from  '../../colorThemes/colorThemes';

export const jobSeekerConfig = {
  role: ROLES.JOB_SEEKER,
  title: 'Dashboard',
  headerIcon: 'MoneyIcon',
  userLabel: USER_TYPES[ROLES.JOB_SEEKER],
  api: {
    profile: 'http://localhost:3000/profile',
    logout: 'http://localhost:3000/jobseeker/logout'
  },
  navigation: [
    { 
      path: '/job-seeker/dashboard/job-posts', 
      icon: 'SearchIcon', 
      label: 'Search Jobs',
      href: '/job-seeker/dashboard/job-posts'
    },
    { 
      path: '/job-seeker/dashboard/applied-jobs', 
      icon: 'ApplicationsIcon', 
      label: 'Applications',
      href: '/job-seeker/dashboard/applied-jobs'
    },
    { 
      path: '/job-seeker/dashboard/notifications', 
      icon: 'NotificationIcon', 
      label: 'Notifications',
      href: '/job-seeker/dashboard/notifications'
    },
    { 
      path: '/job-seeker/dashboard/profile', 
      icon: 'ProfileIcon', 
      label: 'Profile',
      href: '/job-seeker/dashboard/profile'
    }
  ],
  userDataMapping: {
    name: 'fullName',
    image: 'image',
    defaultName: 'User'
  },
  theme: {
     sidebarBg: `bg-gradient-to-b ${colorThemes.blue.bg}`, 
    activeBg: 'bg-[#0c51ffcf]',
    hoverBg: 'hover:bg-[#21384D]'
  }
};

export const employerConfig = {
  role: ROLES.EMPLOYER,
  title: 'Employer',
  headerIcon: 'CompanyIcon',
  userLabel: USER_TYPES[ROLES.EMPLOYER],
  api: {
    profile: 'http://localhost:3000/api/Company/profile',
    logout: 'http://localhost:3000/api/Company/Employer/logout'
  },
  navigation: [
    { 
      path: '/Employer_dashboard/Employer_jobpost', 
      icon: 'JobListings', 
      label: 'Job Listings',
      href: '/Employer_dashboard/Employer_jobpost'
    },
    { 
      path: '/Employer_dashboard/View_appications', 
      icon: 'ApplicationsIcon', 
      label: 'Applications',
      href: '/Employer_dashboard/View_appications'
    },
    { 
      path: '/Employer_dashboard/Notifications', 
      icon: 'NotificationIcon', 
      label: 'Notifications',
      href: '/Employer_dashboard/Notifications'
    },
    { 
      path: '/Employer_dashboard/Employer_profile', 
      icon: 'ProfileIcon', 
      label: 'Profile',
      href: '/Employer_dashboard/Employer_profile'
    }
  ],
  userDataMapping: {
    name: 'companyName',
    image: 'companyImage',
    defaultName: 'Company'
  },
  theme: {
    sidebarBg: `bg-gradient-to-b ${colorThemes.blue.bg}`, 
    activeBg: 'bg-[#0c51ffcf]',
    hoverBg: 'hover:bg-[#21384D]'
  }
};

export const adminConfig = {
  role: ROLES.ADMIN,
  title: 'Admin Panel',
  headerIcon: 'ShieldIcon',
  userLabel: USER_TYPES[ROLES.ADMIN],
  api: {
     profile: 'http://localhost:3000/api/admin/profile',
    logout: 'http://localhost:3000/api/admin/logout',
  },

  navigation: [
   { 
      path: '/admin/admin_dashboard/manage_jobseekers', 
      icon: 'JobSeekerIcon', 
      label: 'Job Seekers',
      href: '/admin/admin_dashboard/manage_jobseekers',
      
    },
    { 
      path: '/admin/admin_dashboard/manage_companies', 
      icon: 'EmployersIcon', 
      label: 'Employers',
      href: '/admin/admin_dashboard/manage_companies',
      countKey: 'employers'
    },
    { 
      path: '/admin/admin_dashboard/manage_post', 
      icon: 'JobPostIcon', 
      label: 'Manage Job Post',
      href: '/admin/admin_dashboard/manage_post',
      countKey: 'jobPosts'
    }
  ],
  userDataMapping: {
    name: 'Adminfullname',
    image: 'adminImage',
    defaultName: 'Administrator'
  },
 theme: {
  sidebarBg: `bg-gradient-to-b ${colorThemes.blue.bg}`, 
  activeBg: 'bg-[#0c51ffcf]',
   hoverBg: 'hover:bg-[#21384D]'
  }
};