const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Set up multer storage for job thumbnails
const jobThumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/job-thumbnail';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'job-' + uniqueSuffix + ext);
  }
});

// Set up file filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize multer upload with 2MB size limit for job thumbnails
const jobThumbnailUpload = multer({ 
  storage: jobThumbnailStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter
});





// ✅ Get user profile route
router.get('/profile',  async (req, res) => {
  try {
    const userId = req.user.userId;

    const db = req.app.locals.db;
    const Companycollection = db.collection('Companies');
    const user = await Companycollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data without password
    const userData = {
      companyName: user.companyName,
      comDescription: user.comDescription,
      role: user.role,  
      companyImage: user.image ? user.image : null,
    };
    res.status(200).json(userData);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// ✅ Logout route
router.post('/Employer/logout',  (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});



// ✅ GET /api/jobs - Fetch all jobs for the logged-in company
router.get('/jobs', async (req, res) => {
  try {
    const companyId = req.user.userId;
    const { status } = req.query; // Get status filter if provided
    const db = req.app.locals.db;
    const jobsCollection = db.collection('Job_Posts');
    

     // Build query with company ID
     const query = { companyId: new ObjectId(companyId) };
     // Add status filter if provided
     
     if (status && status !== 'all') {
       query.status = status;
     }
  
    // Find all jobs associated with the company ID from the token
    const jobs = await jobsCollection.find({ 
      companyId: new ObjectId(companyId) 
    }).sort({ createdAt: -1 }).toArray(); // Sort by newest first
    
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
});




// ✅ POST /api/jobs - Create a new job
router.post('/jobs', jobThumbnailUpload.single('thumbnail'), async (req, res) => {
  try {
    const companyId = req.user.userId;
    const { title, description, location, jobType, salary } = req.body;
    
    // Validate required fields
    if (!title || !description || !location || !jobType || !salary) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const db = req.app.locals.db;
    const jobsCollection = db.collection('Job_Posts');
    
    // Create new job document
    const newJob = {
      companyId: new ObjectId(companyId),
      title,
      description,
      location,
      jobType,
      salary,
      thumbnail: req.file ? `uploads/job-thumbnail/${req.file.filename}` : null,
      status: 'pending', 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save job to database
    const result = await jobsCollection.insertOne(newJob);
    
    // Add the ID to the job object for the response
    newJob._id = result.insertedId;
    
    res.status(201).json(newJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error while creating job' });
  }
});

// ✅ PUT /api/jobs/:id - Update an existing job
router.put('/jobs/:id', jobThumbnailUpload.single('thumbnail'), async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyId = req.user.userId;
    const { title, description, location, jobType, salary } = req.body;
    
    const db = req.app.locals.db;
    const jobsCollection = db.collection('Job_Posts');
    
    // Find job by ID and company ID to ensure ownership
    const job = await jobsCollection.findOne({ 
      _id: new ObjectId(jobId),
      companyId: new ObjectId(companyId)
    });
    
    // Check if job exists and belongs to company
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized to edit' });
    }
    
    // Update fields
    const updateData = {
      title: title || job.title,
      description: description || job.description,
      location: location || job.location,
      jobType: jobType || job.jobType,
      salary: salary || job.salary,
      updatedAt: new Date()
    };
    
    // Update thumbnail if new file is uploaded
    if (req.file) {
      // Delete old thumbnail if exists
      if (job.thumbnail) {
        const oldPath = path.join(process.cwd(), job.thumbnail);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      
      // Set new thumbnail path
      updateData.thumbnail = `uploads/job-thumbnail/${req.file.filename}`;
    }
    
    // Update job in database
    await jobsCollection.updateOne(
      { _id: new ObjectId(jobId) },
      { $set: updateData }
    );
    
    // Get updated job to return
    const updatedJob = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
    
    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error while updating job' });
  }
});

// ✅ DELETE /api/jobs/:id - Delete a job
router.delete('/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyId = req.user.userId;
    
    const db = req.app.locals.db;
    const jobsCollection = db.collection('Job_Posts');
    
    // Find job by ID and company ID to ensure ownership
    const job = await jobsCollection.findOne({ 
      _id: new ObjectId(jobId),
      companyId: new ObjectId(companyId)
    });
    
    // Check if job exists and belongs to company
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized to delete' });
    }
    
    // Delete thumbnail file if exists
    if (job.thumbnail) {
      const thumbnailPath = path.join(process.cwd(), job.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    
    // Delete job from database
    await jobsCollection.deleteOne({ _id: new ObjectId(jobId) });
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
});


router.get('/notifications', async (req, res) => {
  try {
    const companyId = req.user.userId;
    const db = req.app.locals.db;
    const notificationsCollection = db.collection('notifications');
    const jobsCollection = db.collection('Job_Posts');

    const notifications = await notificationsCollection.find({
      employerId: companyId.toString()
    }).sort({ createdAt: -1 }).toArray();

    // Enrich notifications with job titles
    const jobIds = notifications.map(n => new ObjectId(n.jobId));
    const jobs = await jobsCollection.find({ _id: { $in: jobIds } }).toArray();

    const jobMap = {};
    jobs.forEach(job => {
      jobMap[job._id.toString()] = job.title;
    });

    const enrichedNotifications = notifications.map(notification => ({
      ...notification,
      jobTitle: jobMap[notification.jobId] || 'Untitled Job'
    }));

    res.status(200).json({
      notifications: enrichedNotifications,
      message: 'Notifications retrieved successfully'
    });
  } catch (error) {
    console.error('Error in notifications route:', error);
    res.status(500).json({
      message: 'Server error while fetching notifications',
      error: error.message
    });
  }
});


// Add a route to mark notifications as read
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const companyId = req.user.userId;
    const db = req.app.locals.db;
    const notificationsCollection = db.collection('notifications');
    
    // Verify notification exists and belongs to this employer
    const notification = await notificationsCollection.findOne({
      _id: new ObjectId(notificationId),
      employerId: companyId.toString()
    });
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    // Update notification status to read
    await notificationsCollection.updateOne(
      { _id: new ObjectId(notificationId) },
      { $set: { status: 'read' } }
    );
    
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Server error while updating notification' });
  }
});

router.delete('/notifications/:id', async (req, res) => {
  try {
    
    
    const db = req.app.locals.db;
    const notificationsCollection = db.collection('notifications');
    const notificationId = new ObjectId(req.params.id);
    const employerId = req.user.userId;

    const result = await notificationsCollection.deleteOne({
      _id: notificationId,
      employerId: employerId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Notification not found or not authorized to delete.' });
    }

    res.status(200).json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


//get jobappication notifications 
router.get('/applications/notifications', async (req, res) => {
  try {
    console.log("Job Seeker ID (raw):", req.user.userId);
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const applicationCollection = db.collection('job_seeker_notifications');
    const jobsCollection = db.collection('Job_Posts');

    // DEBUG: Check collection content first
    const totalCount = await applicationCollection.countDocuments();
    console.log("Total notifications in collection:", totalCount);

    // Try multiple formats to find notifications
    let notifications = [];
    
    // Try as string first
    notifications = await applicationCollection.find({  
      employerId: employerId.toString()
    }).sort({ createdAt: -1 }).toArray();
    
    // If no results, try as ObjectId
    if (notifications.length === 0) {
      try {
        notifications = await applicationCollection.find({  
          employerId: new ObjectId(employerId)
        }).sort({ createdAt: -1 }).toArray();
      } catch (objectIdError) {
        console.log("ObjectId conversion failed, trying other field names...");
      }
    }
    
    // If still no results, try common alternative field names
    if (notifications.length === 0) {
      const alternativeFields = ['employer_id', 'companyId', 'company_id'];
      
      for (const field of alternativeFields) {
        notifications = await applicationCollection.find({  
          [field]: employerId.toString()
        }).sort({ createdAt: -1 }).toArray();
        
        if (notifications.length > 0) {
          console.log(`Found notifications using field: ${field}`);
          break;
        }
        
        // Try ObjectId version too
        try {
          notifications = await applicationCollection.find({  
            [field]: new ObjectId(employerId)
          }).sort({ createdAt: -1 }).toArray();
          
          if (notifications.length > 0) {
            console.log(`Found notifications using ObjectId field: ${field}`);
            break;
          }
        } catch (err) {
          // Continue to next field
        }
      }
    }

    console.log("Found Notifications:", notifications.length);
    
    if (notifications.length === 0) {
      return res.status(200).json({
        notifications: [],
        message: 'No notifications found for this employer',
        debug: {
          employerId: employerId,
          employerIdString: employerId.toString(),
          totalNotificationsInCollection: totalCount
        }
      });
    }

    // Enrich notifications with job titles
    const jobIds = notifications.map(n => {
      try {
        return new ObjectId(n.jobId);
      } catch (err) {
        console.log("Invalid jobId format:", n.jobId);
        return null;
      }
    }).filter(id => id !== null);

    const jobs = await jobsCollection.find({ _id: { $in: jobIds } }).toArray();

    const jobMap = {};
    jobs.forEach(job => {
      jobMap[job._id.toString()] = job.title;
    });

    const enrichedNotifications = notifications.map(notification => ({
      ...notification,
      jobTitle: jobMap[notification.jobId] || 'Untitled Job'
    }));

    res.status(200).json({
      notifications: enrichedNotifications,
      message: 'Notifications retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error in notifications route:', error);
    res.status(500).json({
      message: 'Server error while fetching notifications',
      error: error.message
    });
  }
});
// Mark application notification as read
router.put('/applications/notifications/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const applicationCollection = db.collection('job_seeker_notifications');
    
    // Convert employerId to ObjectId for comparison
    const employerObjectId = new ObjectId(employerId);
    
    // Verify notification exists and belongs to this employer
    const notification = await applicationCollection.findOne({
      _id: new ObjectId(notificationId),
      employerId: employerObjectId // Use ObjectId instead of string
    });
    
  
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or access denied' });
    }
    
    // Update notification status to read
    await applicationCollection.updateOne(
      { _id: new ObjectId(notificationId) },
      { $set: { status: 'read' } }
    );
    
    res.status(200).json({ message: 'Application notification marked as read' });
  } catch (error) {
    console.error('Error updating application notification:', error);
    res.status(500).json({ message: 'Server error while updating application notification' });
  }
});

// Delete application notification
router.delete('/applications/notifications/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const applicationCollection = db.collection('job_seeker_notifications');
    const notificationId = new ObjectId(req.params.id);
    const employerId = req.user.userId;

    // Convert employerId to ObjectId for proper comparison
    const result = await applicationCollection.deleteOne({
      _id: notificationId,
      employerId: new ObjectId(employerId), // Use ObjectId instead of string
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Application notification not found or not authorized to delete.' });
    }

    res.status(200).json({ message: 'Application notification deleted successfully.' });
  } catch (error) {
    console.error('Error deleting application notification:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
module.exports = router;