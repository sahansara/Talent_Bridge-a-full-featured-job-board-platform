const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const {
  getCollections,
  attachEmployerDetails,
  createEmployerNotification,
  createjobseekerNotification,
  updateJobPostStatus,
  handleError
} = require('./subFunctions/jobPost');

// Get all job posts 
router.get('/job-posts', async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const db = req.app.locals.db;
    const { jobPosts: jobPostsCollection, employer: employerCollection } = getCollections(db);

    let query = {};
    
    // Set filter use on status
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
    const { jobPosts: jobPostsCollection, notifications: notificationsCollection, Vacancienotification: Vacancienotification, employer: employer } = getCollections(db);
    
    // Verify job post alreafdy has
    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });
    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    // Update job post status to approve
    const result = await updateJobPostStatus(jobPostsCollection, jobId, 'approved', req.user.userId);
    
    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to approve job post' });
    }

    // Find employer name using employer id in employer collection
    let employerName = "Unknown employer";
    try {
      const employerData = await employer.findOne(
        { _id: new ObjectId(jobPost.employerId) },
        { 
          projection: { 
            employerName: 1, 
            _id: 1
          }
        }
      );
      
      if (employerData && employerData.employerName) {
        employerName = employerData.employerName;
      }
    } catch (employerError) {
      console.error('Error fetching employer data:', employerError);
    
    }

    // Create notification for employer
    const notificationMessage = `Your job post "${jobPost.title}" has been approved and is now live`;
    await createEmployerNotification(notificationsCollection, jobPost.employerId, jobId, notificationMessage, 'job_approved');
    
    // Create job vacancy notification for job seekers 
    const jobvacancyMessage = `New vacancy posted by "${employerName}": ${jobPost.title}`;
    await createjobseekerNotification(Vacancienotification, jobPost.employerId, jobId, jobvacancyMessage, jobPost.thumbnail, 'job_approved');

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
    
    // Verify job post alrady has
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

// Get job post details for model
router.get('/job-posts/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const db = req.app.locals.db;
    const { jobPosts: jobPostsCollection, employer: employerCollection } = getCollections(db);

    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });

    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    // Attach all employer details
    await attachEmployerDetails(jobPost, employerCollection);

    res.status(200).json({ jobPost });
  } catch (err) {
    handleError(res, err, 'Failed to retrieve job post details');
  }
});

// Create  notification for employer
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
    
    // Create notifications
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