export const appliedJobsUtils = {
  // Format date
  formatDate: (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return 'Invalid date';
    }
  },

  // Get status class for styling
  getStatusClass: (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'under review':
        return 'bg-orange-100 text-yellow-800 border-orange-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  },

  // Filter applications by search term
  filterApplications: (applications, searchTerm) => {
    if (searchTerm.trim() === '') {
      return applications;
    }
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return applications.filter(app => 
      app.jobTitle.toLowerCase().includes(lowercasedSearch) || 
      app.employer.toLowerCase().includes(lowercasedSearch)
    );
  },

  // Sort applications by date
  sortApplicationsByDate: (applications, sortOrder) => {
    return [...applications].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.appliedAt) - new Date(a.appliedAt);
      } else {
        return new Date(a.appliedAt) - new Date(b.appliedAt);
      }
    });
  }
};