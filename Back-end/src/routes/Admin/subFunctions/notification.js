const { ObjectId } = require('mongodb');
const { formatApplicationData } = require('../../Employer/subFunctions/applications');
const {COLLECTIONS} = require('../../../config/constants')

const getAdminNotificationsCollection = (db) => {
  return db.collection(COLLECTIONS.NOTIFICATIONS.JOBPOST_NOTIFICATIONS);
};


const fetchAllAdminNotifications = async (db) => {
  try {
    const adminNotificationsCollection = getAdminNotificationsCollection(db);
    
    const notifications = await adminNotificationsCollection
      .find({})
      .sort({ createdAt: -1 }) 
      .toArray();
    
    return {
      success: true,
      notifications: notifications
    };
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
};


const markNotificationAsRead = async (db, notificationId) => {
  try {
   
    if (!ObjectId.isValid(notificationId)) {
      return {
        success: false,
        error: 'Invalid notification ID format'
      };
    }

    const adminNotificationsCollection = getAdminNotificationsCollection(db);
    
   
    const notification = await adminNotificationsCollection.findOne({
      _id: new ObjectId(notificationId)
    });
    
    if (!notification) {
      return {
        success: false,
        error: 'Notification not found'
      };
    }
    
    
    const updateResult = await adminNotificationsCollection.updateOne(
      { _id: new ObjectId(notificationId) },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );
    
    if (updateResult.matchedCount === 0) {
      return {
        success: false,
        error: 'Notification not found'
      };
    }
    
    if (updateResult.modifiedCount === 0) {
      return {
        success: true,
        message: 'Notification was already marked as read',
        alreadyRead: true
      };
    }
    
    return {
      success: true,
      message: 'Notification marked as read successfully'
    };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const handleApiError = (res, error, operation) => {
  console.error(`Error ${operation}:`, error);
  res.status(500).json({
    success: false,
    message: `Failed to ${operation}`,
    error: error.message
  });
};


const sendSuccessResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message: message,
    ...data
  });
};

const sendErrorResponse = (res, error, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    message: error,
    error: error
  });
};

module.exports = {
  getAdminNotificationsCollection,
  fetchAllAdminNotifications,
  markNotificationAsRead,
  handleApiError,
  sendSuccessResponse,
  sendErrorResponse
};