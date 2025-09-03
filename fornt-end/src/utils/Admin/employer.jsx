
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
    return companies.filter(employer =>
      employer.employerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
};