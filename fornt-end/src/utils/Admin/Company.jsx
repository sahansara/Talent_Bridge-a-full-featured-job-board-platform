// src/utils/notificationUtils.js

export const notificationUtils = {
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

  // Filter companies based on search term
  filterCompanies: (companies, searchTerm) => {
    return companies.filter(company =>
      company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
};