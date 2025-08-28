// employerJobRoutes.js - Employer Job Management API routes
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const {handleError}= require('../shared/commonFuncions')
const {
  getJobsCollection,
  createJobThumbnailUpload,
  fetchEmployerJobs,
  validateJobFields,
  createNewJobData,
  insertNewJob,
  verifyJobOwnership,
  buildJobUpdateData,
  updateJobInDatabase,
  fetchUpdatedJob,
  deleteJobAndFiles,
  validateObjectId,
  handleJobNotFound,
  createadminNotification,
  getjobpostnotification
} = require('./subFunctions/jobPost'); 

// Configure multer upload middleware
const jobThumbnailUpload = createJobThumbnailUpload();

// GET /api/jobs - Fetch all jobs for the logged-in employer
router.get('/jobs', async (req, res) => {
  try {
    const employerId = req.user.userId;
    const { status } = req.query; // Get status filter if provided
    const db = req.app.locals.db;
    const jobsCollection = getJobsCollection(db);
    
    // Fetch employer jobs with optional status filter
    const jobs = await fetchEmployerJobs(jobsCollection, employerId, status);
    
    res.json(jobs);
  } catch (error) {
    handleError(res, error, 'fetching jobs');
  }
});

// POST /api/jobs - Create a new job
router.post('/jobs', jobThumbnailUpload.single('thumbnail'), async (req, res) => {
  try {
    const employerId = req.user.userId;
    const jobData = req.body;
    
    // Validate required fields
    if (!validateJobFields(jobData, res)) return;
   
    const db = req.app.locals.db;
    const jobsCollection = getJobsCollection(db);
    
   
    // Create new job data object
    const newJobData = createNewJobData(employerId, jobData, req.file);
   
    // Insert job into database
    const newJob = await insertNewJob(jobsCollection, newJobData);
    const messages= `Job post "${jobData.title}" has been updated and may need review`;
     try {
      const notificationResult = await createadminNotification(
        db,
        employerId,
        newJob._id,
        messages
      );
      
      if (!notificationResult.success) {
        console.error('Failed to create admin notification:', notificationResult.error);
      }
    } catch (notificationError) {
      console.error('Error creating admin notification:', notificationError);
      
    }
   
    res.status(201).json(newJob);
  } catch (error) {
    handleError(res, error, 'creating job');
  }
});

// PUT /api/jobs/:id - Update an existing job
router.put('/jobs/:id', jobThumbnailUpload.single('thumbnail'), async (req, res) => {
  try {
    const jobId = req.params.id;
    const employerId = req.user.userId;
    const updateData = req.body;
    
    // Validate job ID format
    if (!validateObjectId(jobId, res, 'job ID')) return;
    
    const db = req.app.locals.db;
    const jobsCollection = getJobsCollection(db);
    
    // Verify job ownership
    const existingJob = await verifyJobOwnership(jobsCollection, jobId, employerId);
    if (!existingJob) {
      handleJobNotFound(res, 'edit');
      return;
    }
    
    // Build update data with thumbnail handling
    const jobUpdateData = buildJobUpdateData(existingJob, updateData, req.file);
    
    // Update job in database
    await updateJobInDatabase(jobsCollection, jobId, jobUpdateData);
    
    // Fetch and return updated job
    const updatedJob = await fetchUpdatedJob(jobsCollection, jobId);
    
    res.json(updatedJob);
  } catch (error) {
    handleError(res, error, 'updating job');
  }
});

// DELETE /api/jobs/:id - Delete a job
router.delete('/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const employerId = req.user.userId;
    
    // Validate job ID format
    if (!validateObjectId(jobId, res, 'job ID')) return;
    
    const db = req.app.locals.db;
    const jobsCollection = getJobsCollection(db);
    
    // Verify job ownership
    const job = await verifyJobOwnership(jobsCollection, jobId, employerId);
    if (!job) {
      handleJobNotFound(res, 'delete');
      return;
    }
    
    // Delete job and associated files
    await deleteJobAndFiles(jobsCollection, job);
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    handleError(res, error, 'deleting job');
  }
});

module.exports = router;