const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const {
  getEmployerNotificationCollections,
  validateObjectId,
  fetchEmployerNotifications,
  processAndEnrichNotifications,
  verifyNotificationOwnership,
  markNotificationAsRead,
  deleteEmployerNotification,
  fetchJobApplicationNotifications,
  verifyJobApplicationNotificationOwnership,
  deleteJobApplicationNotification,
  createEmptyNotificationsResponse
} = require('./subFunctions/Notifications');

const {handleError} = require('../shared/commonFuncions');
// Get employer notifications
router.get('/notifications', async (req, res) => {
  try {
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const { notifications: notificationsCollection, jobPosts } = getEmployerNotificationCollections(db);

    // Fetch employer notifications
    const notifications = await fetchEmployerNotifications(notificationsCollection, employerId);

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

// Mark notification as read
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const employerId = req.user.userId;

    // Validate notification ID format
    if (!validateObjectId(notificationId, res, 'notification ID')) return;

    const db = req.app.locals.db;
    const { notifications: notificationsCollection } = getEmployerNotificationCollections(db);
    
    // Verify notification exists and belongs to this employer
    const notification = await verifyNotificationOwnership(notificationsCollection, notificationId, employerId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    // Update notification status to read
    await markNotificationAsRead(notificationsCollection, notificationId);
    
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    handleError(res, error, 'updating notification');
  }
});

// Delete notification
router.delete('/notifications/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const employerId = req.user.userId;

    // Validate notification ID format
    if (!validateObjectId(notificationId, res, 'notification ID')) return;

    const db = req.app.locals.db;
    const { notifications: notificationsCollection } = getEmployerNotificationCollections(db);

    // Delete notification with ownership verification
    const result = await deleteEmployerNotification(notificationsCollection, notificationId, employerId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Notification not found or not authorized to delete.' });
    }

    res.status(200).json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    handleError(res, error, 'deleting notification');
  }
});

// Gjob application notifications with advanced fallback strategies
router.get('/applications/notifications', async (req, res) => {
  try {
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const { jobSeekerNotifications, jobPosts } = getEmployerNotificationCollections(db);

    // Fetch notifications with multiple fallback strategies
    const { notifications, debugInfo } = await fetchJobApplicationNotifications(jobSeekerNotifications, employerId);
    
    // Return empty response if no notifications found
    if (notifications.length === 0) {
      return res.status(200).json(createEmptyNotificationsResponse(debugInfo));
    }

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

// Mark job application notification as read
router.put('/applications/notifications/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const employerId = req.user.userId;

    // Validate notification ID format
    if (!validateObjectId(notificationId, res, 'notification ID')) return;

    const db = req.app.locals.db;
    const { jobSeekerNotifications } = getEmployerNotificationCollections(db);
    
    // Verify notification exists and belongs to this employer
    const notification = await verifyJobApplicationNotificationOwnership(jobSeekerNotifications, notificationId, employerId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or access denied' });
    }
    
    // Update notification status to read
    await markNotificationAsRead(jobSeekerNotifications, notificationId);
    
    res.status(200).json({ message: 'Application notification marked as read' });
  } catch (error) {
    handleError(res, error, 'updating application notification');
  }
});

// Delete job application notification
router.delete('/applications/notifications/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const employerId = req.user.userId;

    // Validate notification ID format
    if (!validateObjectId(notificationId, res, 'notification ID')) return;

    const db = req.app.locals.db;
    const { jobSeekerNotifications } = getEmployerNotificationCollections(db);

    // Delete notification with ownership verification
    const result = await deleteJobApplicationNotification(jobSeekerNotifications, notificationId, employerId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Application notification not found or not authorized to delete.' });
    }

    res.status(200).json({ message: 'Application notification deleted successfully.' });
  } catch (error) {
    handleError(res, error, 'deleting application notification');
  }
});

module.exports = router;