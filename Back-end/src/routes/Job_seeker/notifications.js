const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Import helper functions
const {
  getNotificationCollections,
  validateObjectId,
  handleError,
  fetchJobSeekerNotifications,
  verifyNotificationOwnership,
  markNotificationAsRead,
  deleteUserNotification,
  fetchVacancyNotifications,
  processAndEnrichNotifications
} = require('./subFunctions/notification'); 

// Get job application notifications for job seeker
router.get('/applications/notifications', async (req, res) => {
  try {
    const jobSeekerId = req.user.userId;
    const db = req.app.locals.db;
    const { employerNotifications, jobPosts } = getNotificationCollections(db);

    // Fetch notifications with fallback strategies
    const notifications = await fetchJobSeekerNotifications(employerNotifications, jobSeekerId);

    // Process and enrich notifications with job titles
    const enrichedNotifications = await processAndEnrichNotifications(notifications, jobPosts);

    res.status(200).json({
      notifications: enrichedNotifications,
      message: 'Notifications retrieved successfully'
    });
    
  } catch (error) {
    handleError(res, error, 'fetching notifications');
  }
});

// Mark application notification as read
router.put('/applications/notifications/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const jobSeekerId = req.user.userId;

    // Validate notification ID format
    if (!validateObjectId(notificationId, res, 'notification ID')) return;

    const db = req.app.locals.db;
    const { employerNotifications } = getNotificationCollections(db);
    
    // Verify notification exists and belongs to this user
    const notification = await verifyNotificationOwnership(employerNotifications, notificationId, jobSeekerId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or access denied' });
    }
    
    // Update notification status to read
    await markNotificationAsRead(employerNotifications, notificationId);
    
    res.status(200).json({ message: 'Application notification marked as read' });
  } catch (error) {
    handleError(res, error, 'updating application notification');
  }
});

// Delete application notification
router.delete('/applications/notifications/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const jobSeekerId = req.user.userId;

    // Validate notification ID format
    if (!validateObjectId(notificationId, res, 'notification ID')) return;

    const db = req.app.locals.db;
    const { employerNotifications } = getNotificationCollections(db);

    // Delete notification with ownership verification
    const result = await deleteUserNotification(employerNotifications, notificationId, jobSeekerId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        message: 'Application notification not found or not authorized to delete.' 
      });
    }

    res.status(200).json({ message: 'Application notification deleted successfully.' });
  } catch (error) {
    handleError(res, error, 'deleting application notification');
  }
});

// Get job post vacancy notifications
router.get('/jobVacancy/notifications', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { vacancyNotifications, jobPosts } = getNotificationCollections(db);

    // Fetch all vacancy notifications
    const notifications = await fetchVacancyNotifications(vacancyNotifications);

    // Process and enrich notifications with job titles
    const enrichedNotifications = await processAndEnrichNotifications(notifications, jobPosts);

    res.status(200).json({
      message: 'Notifications retrieved successfully',
      notifications: enrichedNotifications
    });

  } catch (error) {
    handleError(res, error, 'fetching vacancy notifications');
  }
});

module.exports = router;