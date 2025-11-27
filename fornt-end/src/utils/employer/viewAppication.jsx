export const applicationUtils = {
  // Get status color for application status
  getStatusColor: (status) => {
    switch(status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  },

  // Filter job posts based on criteria
  filterJobPosts: (jobPosts, filters) => {
    const { categoryFilter, jobFilter, searchTerm, statusFilter, dateFilter } = filters;
    
    return jobPosts.filter(job => {
      if (categoryFilter !== 'All' && job.category !== categoryFilter) return false;
      if (jobFilter !== 'All' && job.id.toString() !== jobFilter) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return job.title.toLowerCase().includes(searchLower) ||
               job.applications.some(app => app.name.toLowerCase().includes(searchLower));
      }
      return true;
    }).map(job => ({
      ...job,
      applications: job.applications.filter(app => {
        if (statusFilter !== 'All' && app.status !== statusFilter) return false;
        if (dateFilter !== 'All') {
          const appDate = new Date(app.appliedDate);
          const now = new Date();
          const diffTime = Math.abs(now - appDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (dateFilter === 'Last 7 days' && diffDays > 7) return false;
          if (dateFilter === 'Last 30 days' && diffDays > 30) return false;
          if (dateFilter === 'This month' && appDate.getMonth() !== now.getMonth()) return false;
        }
        return true;
      })
    }));
  },

  // Calculate total applications
  getTotalApplications: (jobPosts) => {
    return jobPosts.reduce((sum, job) => sum + job.applications.length, 0);
  },

  // Handle CV download logic
  handleCVDownload: async (cvUrl, downloadFunction) => {
    try {
      const { blob, filename } = await downloadFunction(cvUrl);
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading CV:', error);
      throw error;
    }
  },

  
  debugCV: (cvUrl) => {
    console.log('CV URL:', cvUrl);
    const fullUrl = cvUrl.startsWith('http') ? cvUrl : `http://localhost:3000${cvUrl}`;
    console.log('Full URL:', fullUrl);
  }
};

// Constants
export const FILTER_OPTIONS = {
  categories: ['All', 'IT', 'Marketing', 'Design', 'Healthcare', 'Finance'],
  statuses: ['All', 'Applied', 'Under Review', 'Accepted', 'Rejected'],
  dateRanges: ['All', 'Last 7 days', 'Last 30 days', 'This month']
};

// Mock data]
export const MOCK_JOB_POSTS = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    category: "IT",
    location: "New York",
    postDate: "2024-01-15",
    applications: [
      {
        id: 1,
        jobSeekerId: 1,
        name: "John Smith",
        email: "john@email.com",
        phone: "+1234567890",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        appliedDate: "2024-01-20",
        status: "Applied",
        cvUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        experience: "5 years",
        location: "New York",
        skills: ["React", "JavaScript", "TypeScript", "Node.js"],
        notes: ""
      },
      {
        id: 2,
        jobSeekerId: 2,
        name: "Sarah Johnson",
        email: "sarah@email.com",
        phone: "+1234567891",
        image: "https://images.unsplash.com/photo-1494790108755-2616b332c9ae?w=150&h=150&fit=crop&crop=face",
        appliedDate: "2024-01-22",
        status: "Under Review",
        cvUrl: "/cv/sarah-johnson-cv.pdf",
        experience: "3 years",
        location: "Boston",
        skills: ["Vue.js", "React", "CSS", "HTML"],
        notes: "Strong portfolio, good communication skills"
      }
    ]
  },
  {
    id: 2,
    title: "Marketing Manager",
    category: "Marketing",
    location: "Los Angeles",
    postDate: "2024-01-10",
    applications: [
      {
        id: 3,
        jobSeekerId: 3,
        name: "Mike Wilson",
        email: "mike@email.com",
        phone: "+1234567892",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        appliedDate: "2024-01-18",
        status: "Accepted",
        cvUrl: "/cv/mike-wilson-cv.pdf",
        experience: "7 years",
        location: "Los Angeles",
        skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
        notes: "Excellent track record, scheduled for final interview"
      }
    ]
  },
  {
    id: 3,
    title: "UX Designer",
    category: "Design",
    location: "San Francisco",
    postDate: "2024-01-12",
    applications: [
      {
        id: 4,
        jobSeekerId: 4,
        name: "Emma Davis",
        email: "emma@email.com",
        phone: "+1234567893",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        appliedDate: "2024-01-25",
        status: "Rejected",
        cvUrl: "/cv/emma-davis-cv.pdf",
        experience: "2 years",
        location: "San Francisco",
        skills: ["Figma", "Sketch", "Adobe XD", "Prototyping"],
        notes: "Portfolio doesn't match our requirements"
      },
      {
        id: 5,
        jobSeekerId: 5,
        name: "Alex Chen",
        email: "alex@email.com",
        phone: "+1234567894",
        image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
        appliedDate: "2024-01-23",
        status: "Applied",
        cvUrl: "/cv/alex-chen-cv.pdf",
        experience: "4 years",
        location: "Seattle",
        skills: ["UI/UX", "Wireframing", "User Research", "Prototyping"],
        notes: ""
      }
    ]
  }
];