const express = require('express');
const router = express.Router();
const {
  fetchAllAdminNotifications,
  markNotificationAsRead,
  handleApiError,
  sendSuccessResponse,
  sendErrorResponse
} = require('./subFunctions/notification'); 

router.get('/notifications', async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    if (!db) {
      return sendErrorResponse(res, 'Database connection not available', 500);
    }
    
    const result = await fetchAllAdminNotifications(db);
    
    if (!result.success) {
      return sendErrorResponse(res, result.error, 500);
    }
    
    sendSuccessResponse(
      res, 
      { notifications: result.notifications },
      'Admin notifications retrieved successfully'
    );
    
  } catch (error) {
    handleApiError(res, error, 'fetch admin notifications');
  }
});


router.put('/notifications/:id/read', async (req, res) => {
  try {
    const { id: notificationId } = req.params;
    const db = req.app.locals.db;
    
    if (!db) {
      return sendErrorResponse(res, 'Database connection not available', 500);
    }
    
    if (!notificationId) {
      return sendErrorResponse(res, 'Notification ID is required', 400);
    }
    
    const result = await markNotificationAsRead(db, notificationId);
    
    if (!result.success) {
      const statusCode = result.error === 'Notification not found' ? 404 : 500;
      return sendErrorResponse(res, result.error, statusCode);
    }
    
    const statusCode = result.alreadyRead ? 200 : 200;
    sendSuccessResponse(
      res,
      { 
        notificationId: notificationId,
        alreadyRead: result.alreadyRead || false
      },
      result.message,
      statusCode
    );
    
  } catch (error) {
    handleApiError(res, error, 'mark notification as read');
  }
});



module.exports = router;