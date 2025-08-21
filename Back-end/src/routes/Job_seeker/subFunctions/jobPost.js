const { ObjectId } = require('mongodb');
const {COLLECTIONS } = require('../../../config/constants');

function getCollections(db) {
  return {
    jobPosts: db.collection(COLLECTIONS.OTHER.JOB_POST),
    companies: db.collection(COLLECTIONS.ROLE.EMPLOYER),
    applications: db.collection(COLLECTIONS.OTHER.APPLICATIONS),
    seekEmployees: db.collection(COLLECTIONS.ROLE.JOB_SEEKER),
    notifications: db.collection(COLLECTIONS.NOTIFICATIONS.SEEKER_NOTIFICATIONS)
  };
}

function validateObjectId(id, res, fieldName = 'ID') {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: `Invalid ${fieldName} format` });
    return false;
  }
  return true;
}
function handleError(res, error, operation, statusCode = 500) {
  console.error(`Error ${operation}:`, error);
  res.status(statusCode).json({ error: `Failed to ${operation}` });
}
function buildJobSearchFilter(searchQuery) {
  const filter = { status: "approved" };

  if (searchQuery) {
    filter.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } },
      { location: { $regex: searchQuery, $options: 'i' } },
      { jobType: { $regex: searchQuery, $options: 'i' } },
      { employer: { $regex: searchQuery, $options: 'i' } }
    ];
  }

  return filter;
}
async function fetchEmployerDetails(employerCollection, employerId) {
  if (!employerId) return null;

  const employerObjectId = typeof employerId === 'string'
    ? new ObjectId(employerId)
    : employerId;

  return await employerCollection.findOne({ _id: employerObjectId });
}
function formatJobWithEmployer(job, employer = null) {
  let employerName = job.employer || "employer Name";
  let logo = job.thumbnail || null;

  if (employer) {
    employerName = employer.employerName || employer.name || employerName;
    logo = employer.logo || employer.thumbnail || logo;
  }

  return {
    id: job._id,
    title: job.title,
    employer: employerName,
    location: job.location,
    salary: job.salary,
    logo: logo,
    description: job.description,
    jobType: job.jobType,
    approvedAt: job.approvedAt,
  };
}
function formatJobDetails(job, employer = null) {
  if (employer) {
    job.employerName = employer.employerName || employer.name || 'Unknown employer';
    job.employerLogo = employer.logo || employer.thumbnail || null;
  } else {
    job.employerName = 'Unknown employer';
    job.employerLogo = null;
  }

  return {
    id: job._id,
    title: job.title,
    employer: job.employerName || job.employer || 'employer Name',
    location: job.location,
    salary: job.salary,
    logo: job.employerLogo || job.thumbnail || null,
    description: job.description,
    jobType: job.jobType,
    approvedAt: job.approvedAt
  };
}

async function checkExistingApplication(applicationsCollection, jobSeekerId, jobId) {
  return await applicationsCollection.findOne({
    jobSeekerId: new ObjectId(jobSeekerId),
    jobId: new ObjectId(jobId)
  });
}

async function validateApprovedJob(jobPostsCollection, jobId) {
  return await jobPostsCollection.findOne({ 
    _id: new ObjectId(jobId),
    status: 'approved'
  });
}

async function getJobSeekerProfile(seekEmployeesCollection, jobSeekerId) {
  return await seekEmployeesCollection.findOne({ 
    _id: new ObjectId(jobSeekerId) 
  });
}

function createApplicationData(jobSeekerId, jobId, job, jobSeeker) {
  return {
    jobSeekerId: new ObjectId(jobSeekerId),
    jobId: new ObjectId(jobId),
    employerId: new ObjectId(job.employerId),
    status: 'Applied',
    jobSeekerProfile: {
      fullName: jobSeeker.fullName,
      email: jobSeeker.email,
      cv: jobSeeker.cv_Upload,
      profileImage: jobSeeker.image
    },
    jobDetails: {
      title: job.title,
      employer: job.employer || 'employer Name',
      jobType: job.jobType,
      description: job.description,
      approvedAt: job.approvedAt,
      location: job.location,
      logo: job.thumbnail || job.employerLogo,
      salary: job.salary
    },
    appliedAt: new Date(),
    updatedAt: new Date()
  };
}
function createNotificationData(applicationId, job, jobSeeker, jobSeekerId, jobId) {
  return {
    applicationId: applicationId,
    employerId: new ObjectId(job.employerId),
    jobSeekerId: new ObjectId(jobSeekerId),
    jobId: new ObjectId(jobId),
    type: 'new_application',
    message: `${jobSeeker.fullName} applied for ${job.title}`,
    jobSeekerName: jobSeeker.fullName,
    jobSeekerImage: jobSeeker.image,
    jobTitle: job.title,
    status: 'unread',
    createdAt: new Date()
  };
}

function formatApplicationsForDashboard(applications) {
  return applications.map(app => ({
    id: app._id,
    jobTitle: app.jobDetails.title,
    employer: app.jobDetails.employer,
    jobType: app.jobDetails.jobType,
    approvedAt: app.jobDetails.approvedAt,
    description: app.jobDetails.description,
    location: app.jobDetails.location,
    salary: app.jobDetails.salary,
    logo: app.jobDetails.logo,
    status: app.status,
    appliedAt: app.appliedAt,
    updatedAt: app.updatedAt
  }));
}

async function enrichJobsWithEmployerData(jobs, companiesCollection) {
  return await Promise.all(jobs.map(async (job) => {
    const employer = await fetchEmployerDetails(companiesCollection, job.employerId);
    return formatJobWithEmployer(job, employer);
  }));
}

module.exports = {
  getCollections,
  validateObjectId,
  handleError,
  buildJobSearchFilter,
  fetchEmployerDetails,
  formatJobWithEmployer,
  formatJobDetails,
  checkExistingApplication,
  validateApprovedJob,
  getJobSeekerProfile,
  createApplicationData,
  createNotificationData,
  formatApplicationsForDashboard,
  enrichJobsWithEmployerData
};