// loadpost.js - Job Posts API routes
const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Import helper functions
const {
  getCollections,
  validateObjectId,
  handleError,
  buildJobSearchFilter,
  fetchEmployerDetails,
  formatJobDetails,
  checkExistingApplication,
  validateApprovedJob,
  getJobSeekerProfile,
  createApplicationData,
  createNotificationData,
  formatApplicationsForDashboard,
  enrichJobsWithEmployerData
} = require('./subFunctions/jobPost'); 


// Get all approved jobs with search functionality
router.get('/jobs', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { jobPosts, companies } = getCollections(db);
    const searchQuery = req.query.search || '';

    // Build search filter
    const filter = buildJobSearchFilter(searchQuery);

    // Fetch jobs
    const jobs = await jobPosts.find(filter).sort({ approvedAt: -1 }).toArray();

    // Enrich jobs with employer data
    const formattedJobs = await enrichJobsWithEmployerData(jobs, companies);

    res.status(200).json(formattedJobs);
  } catch (error) {
    handleError(res, error, 'fetch job posts');
  }
});

// Get single job post by ID
router.get('/job/:id', async (req, res) => {
  try {
    const jobId = req.params.id;

    // Validate job ID format
    if (!validateObjectId(jobId, res, 'job ID')) return;

    const db = req.app.locals.db;
    const { jobPosts, companies } = getCollections(db);

    // Find approved job by ID
    const job = await jobPosts.findOne({
      _id: new ObjectId(jobId),
      status: "approved"
    });

    if (!job) {
      return res.status(404).json({ error: 'Job post not found or not approved' });
    }

    // Fetch employer details
    const employer = await fetchEmployerDetails(companies, job.employerId);

    // Format job with employer data
    const formattedJob = formatJobDetails(job, employer);

    res.status(200).json(formattedJob);
  } catch (error) {
    handleError(res, error, 'fetch job post');
  }
});

// Check if job seeker already applied to a specific job
router.get('/applications', async (req, res) => {
  try {
    const { jobId } = req.query;
    const jobSeekerId = req.user.userId;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    const db = req.app.locals.db;
    const { applications } = getCollections(db);
    
    // Check for existing application
    const existingApplication = await checkExistingApplication(applications, jobSeekerId, jobId);

    if (existingApplication) {
      return res.status(200).json([{ jobId: jobId, status: existingApplication.status }]);
    }

    return res.status(200).json([]);
  } catch (error) {
    handleError(res, error, 'check application status');
  }
});

// Submit job application
router.post('/applications', async (req, res) => {
  try {
    const { jobId } = req.body;
    const jobSeekerId = req.user.userId;

    // Validate required fields
    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    if (!validateObjectId(jobId, res, 'job ID')) return;

    const db = req.app.locals.db;
    const { applications, jobPosts, seekEmployees, notifications } = getCollections(db);

    // Validate job exists and is approved
    const job = await validateApprovedJob(jobPosts, jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found or not approved' });
    }

    // Check if already applied
    const existingApplication = await checkExistingApplication(applications, jobSeekerId, jobId);
    if (existingApplication) {
      return res.status(409).json({ error: 'You have already applied to this job' });
    }

    // Get job seeker profile
    const jobSeeker = await getJobSeekerProfile(seekEmployees, jobSeekerId);
    if (!jobSeeker) {
      return res.status(404).json({ error: 'Job seeker profile not found' });
    }

    // Create application data
    const applicationData = createApplicationData(jobSeekerId, jobId, job, jobSeeker);

    // Insert application
    const applicationResult = await applications.insertOne(applicationData);

    // Create employer notification
    const notificationData = createNotificationData(
      applicationResult.insertedId, 
      job, 
      jobSeeker, 
      jobSeekerId, 
      jobId
    );

    await notifications.insertOne(notificationData);

    res.status(201).json({ 
      message: 'Application submitted successfully',
      applicationId: applicationResult.insertedId,
      status: 'Applied'
    });

  } catch (error) {
    handleError(res, error, 'submit application');
  }
});

// Get all applications for a job seeker (dashboard)
router.get('/my-applications', async (req, res) => {
  try {
    const jobSeekerId = req.user.userId;
    const db = req.app.locals.db;
    const { applications } = getCollections(db);

    // Fetch user's applications
    const userApplications = await applications.find({
      jobSeekerId: new ObjectId(jobSeekerId)
    }).sort({ appliedAt: -1 }).toArray();

    // Format applications for frontend
    const formattedApplications = formatApplicationsForDashboard(userApplications);

    res.status(200).json(formattedApplications);
  } catch (error) {
    handleError(res, error, 'fetch applications');
  }
});

module.exports = router;