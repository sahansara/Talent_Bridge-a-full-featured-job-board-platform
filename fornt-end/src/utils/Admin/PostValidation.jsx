class PostValidationUtils {
  // Format date to readable format
  formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Filter jobs based on search term
  filterJobsBySearch(jobs, searchTerm) {
    if (!searchTerm.trim()) {
      return jobs;
    }

    return jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.companyName || job.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.province || job.location || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Find job by ID (handles both _id and id)
  findJobById(jobs, jobId) {
    return jobs.find(job => job.id === jobId || job._id === jobId);
  }

  // Get MongoDB ID from job object
  getMongoId(job) {
    return job._id || job.id;
  }

  // Remove job from array by ID
  removeJobById(jobs, jobId) {
    return jobs.filter(job => (job.id !== jobId && job._id !== jobId));
  }

  // Get status badge class
  getStatusBadgeClass(status) {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  }

  // Get company logo URL
  getCompanyLogoUrl(job) {
    const API_BASE_URL = 'http://localhost:3000/';
    
    if (job.companyLogo) {
      return `${API_BASE_URL}${job.companyLogo}`;
    } else if (job.thumbnail) {
      return `${API_BASE_URL}${job.thumbnail}`;
    }
    return '/placeholder-logo.png';
  }

  // Get company initial
  getCompanyInitial(job) {
    return (job.companyName || job.title || "J").charAt(0);
  }

  // Validate job post data
  validateJobPost(job) {
    const errors = [];

    if (!job.title || job.title.trim() === '') {
      errors.push('Job title is required');
    }

    if (!job.description || job.description.trim() === '') {
      errors.push('Job description is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get display text for missing data
  getDisplayText(value, fallback = "Not specified") {
    return value || fallback;
  }

  // Truncate text to specified length
  truncateText(text, maxLength = 100) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Check if job has company logo
  hasCompanyLogo(job) {
    return !!(job.companyLogo || job.thumbnail);
  }

  // Get status display text
  getStatusDisplayText(status) {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  }
}

export default new PostValidationUtils();