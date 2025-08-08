// src/utils/jobSeekerUtils.js

export const jobSeekerUtils = {
  // Format date function
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Filter job seekers based on search term
  filterJobSeekers: (jobSeekers, searchTerm) => {
    return jobSeekers.filter(user =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
};