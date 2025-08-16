// src/shared/config/sidebarConfig.js
import { ROLES, USER_TYPES } from './roleConstants';
import {colorThemes} from  '../../colorThemes/colorThemes';

export const jobSeekerConfig = {
  role: ROLES.JOB_SEEKER,
  title: 'Dashboard',
  headerIcon: 'MoneyIcon',
  userLabel: USER_TYPES[ROLES.JOB_SEEKER],
  api: {
    profile: 'http://localhost:3000/api/users/profile',
    logout: 'http://localhost:3000/api/logout'
  },
  navigation: [
    { 
      path: '/job-seeker/dashboard/job-posts', 
      icon: 'SearchIcon', 
      label: 'Search Jobs',
      href: '/job-seeker/dashboard/job-posts?tab=searchjobs'
    },
    { 
      path: '/job-seeker/dashboard/applied-jobs', 
      icon: 'ApplicationsIcon', 
      label: 'Applications',
      href: '/job-seeker/dashboard/applied-jobs?tab=applications'
    },
    { 
      path: '/job-seeker/dashboard/notifications', 
      icon: 'NotificationIcon', 
      label: 'Notifications',
      href: '/job-seeker/dashboard/notifications?tab=notifications'
    },
    { 
      path: '/job-seeker/dashboard/profile', 
      icon: 'ProfileIcon', 
      label: 'Profile',
      href: '/job-seeker/dashboard/profile?tab=profile'
    }
  ],
  userDataMapping: {
    name: 'username',
    image: 'profileImage',
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
  headerIcon: 'employerIcon',
  userLabel: USER_TYPES[ROLES.EMPLOYER],
  api: {
    profile: 'http://localhost:3000/api/Company/profile',
    logout: 'http://localhost:3000/api/logout'
  },
  navigation: [
    { 
      path: '/Employer_dashboard/Employer_jobpost', 
      icon: 'JobListings', 
      label: 'Job Listings',
      href: '/Employer_dashboard/Employer_jobpost?tab=joblistings'
    },
    { 
      path: '/Employer_dashboard/View_appications', 
      icon: 'ApplicationsIcon', 
      label: 'Applications',
      href: '/Employer_dashboard/View_appications?tab=applications',
    },
    { 
      path: '/Employer_dashboard/Notifications', 
      icon: 'NotificationIcon', 
      label: 'Notifications',
      href: '/Employer_dashboard/Notifications?tab=notifications'
    },
    { 
      path: '/Employer_dashboard/Employer_profile', 
      icon: 'ProfileIcon', 
      label: 'Profile',
      href: '/Employer_dashboard/Employer_profile?tab=profile'
    }
  ],
  userDataMapping: {
    name: 'employerName',
    image: 'employerImage',
    defaultName: 'employer'
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
    logout: 'http://localhost:3000/api/logout',
  },

  navigation: [
   { 
      path: '/admin/dashboard/manageJobseekers', 
      icon: 'JobSeekerIcon', 
      label: 'Job Seekers',
      href: '/admin/dashboard/manageJobseekers?tab=jobseekers',
      
    },
    { 
      path: '/admin/dashboard/manageEmployer', 
      icon: 'EmployersIcon', 
      label: 'Employers',
      href: '/admin/dashboard/manageEmployer?tab=employers',
      countKey: 'employers'
    },
    { 
      path: '/admin/dashboard/managePost', 
      icon: 'JobPostIcon', 
      label: 'Manage Job Post',
      href: '/admin/dashboard/managePost?tab=jobposts',
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