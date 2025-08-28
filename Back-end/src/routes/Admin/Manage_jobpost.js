const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const {
  getCollections,
  attachEmployerDetails,
  createEmployerNotification,
  updateJobPostStatus,
  handleError
} = require('./subFunctions/jobPost');

// Get all job posts with optional filtering by status
router.get('/job-posts', async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const db = req.app.locals.db;
    const { jobPosts: jobPostsCollection, employer: employerCollection } = getCollections(db);

    let query = {};
    
    // Set filter based on status
    if (status && status !== 'all') {
      query.status = status;
    }

    const jobPosts = await jobPostsCollection.find(query)
      .sort({ createdAt: -1 })
      .toArray();
      
    // Enhance job posts with employer details
    for (let job of jobPosts) {
      await attachEmployerDetails(job, employerCollection);
    }

    res.status(200).json({ jobPosts });
  } catch (err) {
    handleError(res, err, 'Failed to retrieve job posts');
  }
});

// Approve a job post
router.put('/job-posts/:id/approve', async (req, res) => {
  try {
    const jobId = req.params.id;
    const db = req.app.locals.db;
    const { jobPosts: jobPostsCollection, notifications: notificationsCollection } = getCollections(db);
    
    // Verify job post exists
    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });
    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    // Update job post status to approved
    const result = await updateJobPostStatus(jobPostsCollection, jobId, 'approved', req.user.userId);

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to approve job post' });
    }

    // Create notification for employer
    const notificationMessage = `Your job post "${jobPost.title}" has been approved and is now live.`;
    await createEmployerNotification(notificationsCollection, jobPost.employerId, jobId, notificationMessage, 'job_approved');

    res.status(200).json({ 
      message: 'Job post approved successfully',
      jobId: jobId
    });
  } catch (err) {
    handleError(res, err, 'Failed to approve job post');
  }
});

// Reject a job post
router.put('/job-posts/:id/reject', async (req, res) => {
  try {
    const jobId = req.params.id;
    const db = req.app.locals.db;
    const { jobPosts: jobPostsCollection, notifications: notificationsCollection } = getCollections(db);
    
    // Verify job post exists
    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });
    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    // Update job post status to rejected
    const result = await updateJobPostStatus(jobPostsCollection, jobId, 'rejected', req.user.userId);

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to reject job post' });
    }

    // Create notification for employer
    const notificationMessage = `Your job post "${jobPost.title}" has been rejected. Please review our guidelines and consider resubmitting.`;
    await createEmployerNotification(notificationsCollection, jobPost.employerId, jobId, notificationMessage, 'job_rejected');

    res.status(200).json({ 
      message: 'Job post rejected successfully',
      jobId: jobId
    });
  } catch (err) {
    handleError(res, err, 'Failed to reject job post');
  }
});

// Get job post details by ID for views in open model frontend 
router.get('/job-posts/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const db = req.app.locals.db;
    const { jobPosts: jobPostsCollection, employer: employerCollection } = getCollections(db);

    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });

    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    // Attach employer details
    await attachEmployerDetails(jobPost, employerCollection);

    res.status(200).json({ jobPost });
  } catch (err) {
    handleError(res, err, 'Failed to retrieve job post details');
  }
});

// Create a notification endpoint (this might typically be handled in the approval/rejection routes)
router.post('/notifications/employer', async (req, res) => {
  try {
    const { jobId, status, message } = req.body;
    const db = req.app.locals.db;
    const { jobPosts: jobPostsCollection, notifications: notificationsCollection } = getCollections(db);
    
    // Get job post to get employerId
    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });
    
    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }
    
    // Create notification
    const notificationMessage = message || `Your job post has been ${status}.`;
    const notificationType = `job_${status}`;
    
    await createEmployerNotification(notificationsCollection, jobPost.employerId, jobId, notificationMessage, notificationType);
    
    res.status(201).json({ 
      message: 'Notification sent successfully',
      notification: {
        employerId: jobPost.employerId.toString(),
        jobId: jobId,
        message: notificationMessage,
        status: 'unread',
        type: notificationType,
        createdAt: new Date()
      }
    });
  } catch (err) {
    handleError(res, err, 'Failed to send notification');
  }
});

module.exports = router;