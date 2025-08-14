const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Authentication middleware for admins
const authenticateAdmin = (req, res, next) => {
  // Check if user is authenticated and has admin role
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};


// Get all job posts with optional filtering by status
router.get('/job-posts', authenticateAdmin, async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    const db = req.app.locals.db;
    const jobPostsCollection = db.collection('Job_Posts');
    const employercollection = db.collection('Companies');


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
  if (job.employerId) {
    // Convert string ID to ObjectId if needed
    const employerObjectId = typeof job.employerId === 'string' 
      ? new ObjectId(job.employerId) 
      : job.employerId;
      
    const employer = await employercollection.findOne({ _id: employerObjectId });
    if (employer) {
      // Add employer name directly to the job object for easier frontend access
      job.employerName = employer.employerName || employer.name || "Unknown employer";
      
      // If there's a employer logo, add it as well
      if (employer.logo || employer.thumbnail) {
        job.employerLogo = employer.logo || employer.thumbnail;
      }
    } else {
      job.employerName = "Unknown employer";
    }
  }
}

    res.status(200).json({ jobPosts });
  } catch (err) {
    console.error('Error fetching job posts:', err);
    res.status(500).json({ error: 'Failed to retrieve job posts' });
  }
});



// Approve a job post
router.put('/job-posts/:id/approve', authenticateAdmin, async (req, res) => {
  try {
    const jobId = req.params.id;
    const db = req.app.locals.db;
    const jobPostsCollection = db.collection('Job_Posts');
    const notificationsCollection = db.collection('notifications');
    
    // Verify job post exists
    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });
    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    // Update job post status to approved
    const result = await jobPostsCollection.updateOne(
      { _id: new ObjectId(jobId) },
      { $set: { 
          status: 'approved',
          approvedAt: new Date(),
          approvedBy: req.user.userId
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to approve job post' });
    }

    // Create notification for employer
    await notificationsCollection.insertOne({
      employerId: jobPost.employerId.toString(), // Using employerId as employerId
      jobId: jobId,
      message: `Your job post "${jobPost.title}" has been approved and is now live.`,
      status: 'unread',
      type: 'job_approved',
      createdAt: new Date()
    });

    res.status(200).json({ 
      message: 'Job post approved successfully',
      jobId: jobId
    });
  } catch (err) {
    console.error('Error approving job post:', err);
    res.status(500).json({ error: 'Failed to approve job post' });
  }
});

// Reject a job post
router.put('/job-posts/:id/reject', authenticateAdmin, async (req, res) => {
  try {
    const jobId = req.params.id;
    const db = req.app.locals.db;
    const jobPostsCollection = db.collection('Job_Posts');
    const notificationsCollection = db.collection('notifications');
    
    // Verify job post exists
    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });
    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    // Update job post status to rejected
    const result = await jobPostsCollection.updateOne(
      { _id: new ObjectId(jobId) },
      { $set: { 
          status: 'rejected',
          rejectedAt: new Date(),
          rejectedBy: req.user.userId
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to reject job post' });
    }

    // Create notification for employer
    await notificationsCollection.insertOne({
      employerId: jobPost.employerId.toString(), // Using employerId as employerId
      jobId: jobId,
      message: `Your job post "${jobPost.title}" has been rejected. Please review our guidelines and consider resubmitting.`,
      status: 'unread',
      type: 'job_rejected',
      createdAt: new Date()
    });

    res.status(200).json({ 
      message: 'Job post rejected successfully',
      jobId: jobId
    });
  } catch (err) {
    console.error('Error rejecting job post:', err);
    res.status(500).json({ error: 'Failed to reject job post' });
  }
});

// Get job post details by ID for viwes in open model fontend 
router.get('/job-posts/:id', authenticateAdmin, async (req, res) => {
  try {
    const jobId = req.params.id;
    const db = req.app.locals.db;
    const jobPostsCollection = db.collection('Job_Posts');
    const employercollection = db.collection('Companies'); // ✅ make sure collection name is correct

    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });

    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    // ✅ Attach employerName and logo if employerId exists
    if (jobPost.employerId) {
      const employerObjectId = typeof jobPost.employerId === 'string'
        ? new ObjectId(jobPost.employerId)
        : jobPost.employerId;

      const employer = await employercollection.findOne({ _id: employerObjectId });

      if (employer) {
        jobPost.employerName = employer.employerName || employer.name || 'Unknown employer';
        if (employer.logo || employer.thumbnail) {
          jobPost.employerLogo = employer.logo || employer.thumbnail;
        }
      } else {
        jobPost.employerName = 'Unknown employer';
      }
    }

    res.status(200).json({ jobPost });
  } catch (err) {
    console.error('Error fetching job post details:', err);
    res.status(500).json({ error: 'Failed to retrieve job post details' });
  }
});


// Create a notification endpoint (this might typically be handled in the approval/rejection routes)
router.post('/notifications/employer', authenticateAdmin, async (req, res) => {
  try {
    const { jobId, status, message } = req.body;
    const db = req.app.locals.db;
    const notificationsCollection = db.collection('notifications');
    const jobPostsCollection = db.collection('Job_Posts');
    
    // Get job post to get employerId
    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });
    
    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }
    
    // Create notification
    const notification = {
      employerId: jobPost.employerId.toString(), // Using employerId as employerId
      jobId: jobId,
      message: message || `Your job post has been ${status}.`,
      status: 'unread',
      type: `job_${status}`,
      createdAt: new Date()
    };
    
    await notificationsCollection.insertOne(notification);
    
    res.status(201).json({ 
      message: 'Notification sent successfully',
      notification
    });
  } catch (err) {
    console.error('Error sending notification:', err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;