import { ROLES, USER_TYPES } from './roleConstants';
import {colorThemes} from  '../../colorThemes/colorThemes';
import { API_BASE_URLS} from '../../config/api';


export const jobSeekerConfig = {
  role: ROLES.JOB_SEEKER,
  title: 'Dashboard',
  headerIcon: 'MoneyIcon',
  userLabel: USER_TYPES[ROLES.JOB_SEEKER],
  api: {
    profile: `${API_BASE_URLS}/api/users/profile`,
    logout: `${API_BASE_URLS}/api/logout`
  },
  navigation: [
    { 
      path: '/jobSeeker/dashboard/jobVacancies', 
      icon: 'SearchIcon', 
      label: 'Search Jobs',
      href: '/jobSeeker/dashboard/jobVacancies?tab=searchjobs'
    },
    { 
      path: '/jobSeeker/dashboard/applied', 
      icon: 'ApplicationsIcon', 
      label: 'Applications',
      href: '/jobSeeker/dashboard/applied?tab=applications'
    },
    { 
      path: '/jobSeeker/dashboard/notifications', 
      icon: 'NotificationIcon', 
      label: 'Notifications',
      href: '/jobSeeker/dashboard/notifications?tab=notifications'
    },
    { 
      path: '/jobSeeker/dashboard/profile', 
      icon: 'ProfileIcon', 
      label: 'Profile',
      href: '/jobSeeker/dashboard/profile?tab=profile'
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
    hoverBg: 'hover:bg-[#2b2b2b]'
  }
};

export const employerConfig = {
  role: ROLES.EMPLOYER,
  title: 'Employer',
  headerIcon: 'employerIcon',
  userLabel: USER_TYPES[ROLES.EMPLOYER],
  api: {
    profile: `${API_BASE_URLS}/api/Company/profile`,
    logout: `${API_BASE_URLS}/api/logout`
  },
  navigation: [
    { 
      path: '/employer/dashboard', 
      icon: 'JobListings', 
      label: 'Job Listings',
      href: '/employer/dashboard?tab=joblistings'
    },
    { 
      path: '/employer/dashboard/viewAppications', 
      icon: 'ApplicationsIcon', 
      label: 'Applications',
      href: '/employer/dashboard/viewAppications?tab=applications',
    },
    { 
      path: '/employer/dashboard/notifications', 
      icon: 'NotificationIcon', 
      label: 'Notifications',
      href: '/employer/dashboard/notifications?tab=notifications'
    },
    { 
      path: '/employer/dashboard/Profile', 
      icon: 'ProfileIcon', 
      label: 'Profile',
      href: '/employer/dashboard/Profile?tab=profile'
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
    hoverBg: 'hover:bg-[#2b2b2b]'
  }
};

export const adminConfig = {
  role: ROLES.ADMIN,
  title: 'Admin Panel',
  headerIcon: 'ShieldIcon',
  userLabel: USER_TYPES[ROLES.ADMIN],
  api: {
    profile: `${API_BASE_URLS}/api/admin/profile`,
    logout: `${API_BASE_URLS}/api/logout`,
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
    },
    {
      path: '/admin/dashboard/notifications', 
      icon: 'NotificationIcon', 
      label: 'Notifications',
      href: '/admin/dashboard/notifications?tab=notifications'
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
   hoverBg: 'hover:bg-[#2b2b2b]'
  }
};