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
    const Companycollection = db.collection('Companies');


    let query = {};
    
    // Set filter based on status
    if (status && status !== 'all') {
      query.status = status;
    }

    const jobPosts = await jobPostsCollection.find(query)
      .sort({ createdAt: -1 })
      .toArray();
      
    // Enhance job posts with company details
for (let job of jobPosts) {
  if (job.companyId) {
    // Convert string ID to ObjectId if needed
    const companyObjectId = typeof job.companyId === 'string' 
      ? new ObjectId(job.companyId) 
      : job.companyId;
      
    const company = await Companycollection.findOne({ _id: companyObjectId });
    if (company) {
      // Add company name directly to the job object for easier frontend access
      job.companyName = company.companyName || company.name || "Unknown Company";
      
      // If there's a company logo, add it as well
      if (company.logo || company.thumbnail) {
        job.companyLogo = company.logo || company.thumbnail;
      }
    } else {
      job.companyName = "Unknown Company";
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
      employerId: jobPost.companyId.toString(), // Using companyId as employerId
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
      employerId: jobPost.companyId.toString(), // Using companyId as employerId
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
    const Companycollection = db.collection('Companies'); // ✅ make sure collection name is correct

    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });

    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }

    // ✅ Attach companyName and logo if companyId exists
    if (jobPost.companyId) {
      const companyObjectId = typeof jobPost.companyId === 'string'
        ? new ObjectId(jobPost.companyId)
        : jobPost.companyId;

      const company = await Companycollection.findOne({ _id: companyObjectId });

      if (company) {
        jobPost.companyName = company.companyName || company.name || 'Unknown Company';
        if (company.logo || company.thumbnail) {
          jobPost.companyLogo = company.logo || company.thumbnail;
        }
      } else {
        jobPost.companyName = 'Unknown Company';
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
    
    // Get job post to get companyId
    const jobPost = await jobPostsCollection.findOne({ _id: new ObjectId(jobId) });
    
    if (!jobPost) {
      return res.status(404).json({ error: 'Job post not found' });
    }
    
    // Create notification
    const notification = {
      employerId: jobPost.companyId.toString(), // Using companyId as employerId
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