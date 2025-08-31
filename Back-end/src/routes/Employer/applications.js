// employerRoutes.js - Employer Application Management API routes
const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Import helper functions
const {
  getEmployerCollections,
  handleError,
  logOperation,
  fetchEmployerApplications,
  processEmployerApplications,
  validateApplicationStatus,
  findAndVerifyApplication,
  fetchEmployerDetails,
  updateApplicationStatus,
  createStatusNotificationData,
  insertNotification,
  updateApplicationNotes,
  fetchEmployerNotifications,
  generateCvFilePaths,
  findExistingCvFile,
  logCvDebugInfo,
  verifyCvAccess,
  setCvResponseHeaders,
  streamCvFile
} = require('./subFunctions/applications'); // Adjust path as needed


// GET /api/employer/All-applications - Fetch all applications for logged-in employer
router.get('/All-applications', async (req, res) => {
  try {
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const { applications } = getEmployerCollections(db);

    logOperation('Fetching applications for employer', employerId);

    // Fetch all applications for this employer
    const employerApplications = await fetchEmployerApplications(applications, employerId);

    // Process and format applications
    const jobPosts = processEmployerApplications(employerApplications);

    if (jobPosts.length === 0) {
      return res.status(200).json({
        message: 'No applications found',
        jobPosts: []
      });
    }

    res.status(200).json({
      message: 'Applications fetched successfully',
      jobPosts: jobPosts
    });

  } catch (error) {
    handleError(res, error, 'fetching applications');
  }
});

// PUT /api/employer/applications/:applicationId/status
router.put('/applications/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const { applications, notifications, companies } = getEmployerCollections(db);

    // Validate status
    if (!validateApplicationStatus(status, res)) return;

    logOperation(`Updating application ${applicationId} status to`, status);

    // Find and verify application ownership
    const application = await findAndVerifyApplication(applications, applicationId, employerId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }

    // Get employer ID from application
    const employersId = application.employerId;
    if (!employersId) {
      return res.status(400).json({ error: 'employer ID not found in application' });
    }

    // Fetch employer details for notification
    const employer = await fetchEmployerDetails(companies, employersId);
    if (!employer) {
      return res.status(404).json({ error: 'employer not found' });
    }

    // Update application status
    const updateResult = await updateApplicationStatus(applications, applicationId, status);

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Create notification data
    const notificationData = createStatusNotificationData(
      application, 
      employerId, 
      applicationId, 
      status, 
      employer
    );

    // Insert notification
    await insertNotification(notifications, notificationData);

    logOperation('Notification created for job seeker', application.jobSeekerId);

    res.status(200).json({
      message: 'Application status updated successfully',
      status: status,
      notificationSent: true
    });

  } catch (error) {
    handleError(res, error, 'updating application status');
  }
});

// PUT /api/employer/applications/:applicationId/notes - Add/Update notes
router.put('/applications/:applicationId/notes', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { notes } = req.body;
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const { applications } = getEmployerCollections(db);

    logOperation('Updating notes for application', applicationId);

    // Update application notes
    const updateResult = await updateApplicationNotes(applications, applicationId, employerId, notes);

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }

    res.status(200).json({
      message: 'Application notes updated successfully',
      notes: notes
    });

  } catch (error) {
    handleError(res, error, 'updating application notes');
  }
});

// GET /api/employer/cv/:filename - Serve CV files with proper headers
router.get('/cv/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const { applications } = getEmployerCollections(db);
    
    // Security check: Verify the CV belongs to an application for this employer
    const application = await verifyCvAccess(applications, employerId, filename);
    
    // Generate possible file paths
    const possiblePaths = generateCvFilePaths(filename, __dirname);
    
    // Log debug information
    logCvDebugInfo(filename, employerId, __dirname, possiblePaths, application);
    
    if (!application) {
      console.log('❌ No application found - unauthorized access');
      return res.status(404).json({ error: 'CV not found or unauthorized' });
    }
    
    // Find existing file
    const foundPath = findExistingCvFile(possiblePaths);
    
    if (!foundPath) {
      return res.status(404).json({ 
        error: 'CV file not found on server',
        debug: {
          filename,
          searchedPaths: possiblePaths,
          cwd: process.cwd(),
          dirname: __dirname
        }
      });
    }
    
    // File found, set headers and serve
    console.log('✅ Serving file from:', foundPath);
    
    setCvResponseHeaders(res, filename);
    streamCvFile(res, foundPath);
    
  } catch (error) {
    handleError(res, error, 'serving CV file');
  }
});

module.exports = router;