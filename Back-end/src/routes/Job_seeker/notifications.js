// loadpost.js - Job Posts API routes
const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();



//get jobappication notifications 
router.get('/applications/notifications', async (req, res) => {
  try {
    
    const jobSeekerId = req.user.userId;
    const db = req.app.locals.db;
    const applicationCollection = db.collection('employer_notifications');
    const jobsCollection = db.collection('Job_Posts');

   

    // Try multiple formats to find notifications
    let notifications = [];
    
    
 
    if (notifications.length === 0) {
      try {
        notifications = await applicationCollection.find({  
          jobSeekerId: new ObjectId(jobSeekerId)
        }).sort({ createdAt: -1 }).toArray();
      } catch (objectIdError) {
        console.log("ObjectId conversion failed, trying other field names...");
      }
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
    const jobSeekerId = req.user.userId;
    const db = req.app.locals.db;
    const applicationCollection = db.collection('employer_notifications');
    
    // Convert jobSeekerId to ObjectId for comparison
    const employerObjectId = new ObjectId(jobSeekerId);
    
    // Verify notification exists and belongs to this employer
    const notification = await applicationCollection.findOne({
      _id: new ObjectId(notificationId),
      jobSeekerId: employerObjectId // Use ObjectId instead of string
    });
    
  
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or access denied' });
    }
    
    // Update notification status to read
    await applicationCollection.updateOne(
      { _id: new ObjectId(notificationId) },
      { $set: { isRead:true } }
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
    const applicationCollection = db.collection('employer_notifications');
    const notificationId = new ObjectId(req.params.id);
    const jobSeekerId = req.user.userId;

    // Convert jobSeekerId to ObjectId for proper comparison
    const result = await applicationCollection.deleteOne({
      _id: notificationId,
      jobSeekerId: new ObjectId(jobSeekerId), 
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

//job post vacancy notifications 
router.get('/jobVacancy/notifications', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const notificationCollection = db.collection('vacancy_notifications');
    const jobsCollection = db.collection('Job_Posts');

    // Get all notifications (You can later filter by region/field/industry)
    const notifications = await notificationCollection.find({})
      .sort({ createdAt: -1 }).toArray();

    // Get related job titles
    const jobIds = notifications.map(n => {
      try {
        return new ObjectId(n.jobId);
      } catch {
        return null;
      }
    }).filter(id => id);

    const jobs = await jobsCollection.find({ _id: { $in: jobIds } }).toArray();
    const jobMap = {};
    jobs.forEach(job => {
      jobMap[job._id.toString()] = job.title;
    });

    const enriched = notifications.map(n => ({
      ...n,
      jobTitle: jobMap[n.jobId] || 'Untitled Job'
    }));

    res.status(200).json({
      message: 'Notifications retrieved successfully',
      notifications: enriched
    });

  } catch (error) {
    console.error('Error fetching vacancy notifications:', error);
    res.status(500).json({
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});







module.exports = router;