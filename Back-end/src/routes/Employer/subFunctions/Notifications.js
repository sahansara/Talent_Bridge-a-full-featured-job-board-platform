const { ObjectId } = require('mongodb');
const {collection, COLLECTIONS} = require("../../../config/constants")


function getEmployerNotificationCollections(db) {
  return {
    notifications: db.collection(COLLECTIONS.NOTIFICATIONS.ADMIN_NOTIFICATIONS),
    jobSeekerNotifications: db.collection(COLLECTIONS.NOTIFICATIONS.SEEKER_NOTIFICATIONS),
    jobPosts: db.collection(COLLECTIONS.OTHER.JOB_POST)
  };
}

function validateObjectId(id, res, fieldName = 'ID') {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: `Invalid ${fieldName} format` });
    return false;
  }
  return true;
}
function convertEmployerIdToString(employerId) {
  return employerId.toString();
}

function convertEmployerIdToObjectId(employerId) {
  try {
    return new ObjectId(employerId);
  } catch (error) {
   
    return null;
  }
}

async function fetchEmployerNotifications(notificationsCollection, employerId) {
  return await notificationsCollection.find({
    employerId: convertEmployerIdToString(employerId)
  }).sort({ createdAt: -1 }).toArray();
}

function extractJobIdsFromNotifications(notifications) {
  return notifications.map(notification => {
    try {
      return new ObjectId(notification.jobId);
    } catch (err) {
      
      return null;
    }
  }).filter(id => id !== null);
}

function createJobTitleMapping(jobs) {
  const jobMap = {};
  jobs.forEach(job => {
    jobMap[job._id.toString()] = job.title;
  });
  return jobMap;
}

function enrichNotificationsWithJobTitles(notifications, jobTitleMap) {
  return notifications.map(notification => ({
    ...notification,
    jobTitle: jobTitleMap[notification.jobId] || 'Untitled Job'
  }));
}

async function processAndEnrichNotifications(notifications, jobsCollection) {
  if (notifications.length === 0) {
    return [];
  }

  // Extract job IDs and fetch jobs
  const jobIds = extractJobIdsFromNotifications(notifications);
  
  if (jobIds.length === 0) {
    return enrichNotificationsWithJobTitles(notifications, {});
  }

  const jobs = await jobsCollection.find({ _id: { $in: jobIds } }).toArray();
  
  // Create job title mapping and enrich notifications
  const jobTitleMap = createJobTitleMapping(jobs);
  return enrichNotificationsWithJobTitles(notifications, jobTitleMap);
}

async function verifyNotificationOwnership(notificationsCollection, notificationId, employerId) {
  try {
    return await notificationsCollection.findOne({
      _id: new ObjectId(notificationId),
      employerId: convertEmployerIdToString(employerId)
    });
  } catch (error) {
    
    return null;
  }
}

async function markNotificationAsRead(notificationsCollection, notificationId) {
  return await notificationsCollection.updateOne(
    { _id: new ObjectId(notificationId) },
    { $set: { status: 'read' } }
  );
}

async function deleteEmployerNotification(notificationsCollection, notificationId, employerId) {
  return await notificationsCollection.deleteOne({
    _id: new ObjectId(notificationId),
    employerId: employerId
  });
}

async function fetchJobApplicationNotifications(notificationsCollection, employerId) {
 

  
  const totalCount = await notificationsCollection.countDocuments();
 

  let notifications = [];
  
  
  notifications = await notificationsCollection.find({  
    employerId: convertEmployerIdToString(employerId)
  }).sort({ createdAt: -1 }).toArray();
  

  if (notifications.length === 0) {
    const employerObjectId = convertEmployerIdToObjectId(employerId);
    if (employerObjectId) {
      try {
        notifications = await notificationsCollection.find({  
          employerId: employerObjectId
        }).sort({ createdAt: -1 }).toArray();
      } catch (objectIdError) {
        
      }
    }
  }
  

  if (notifications.length === 0) {
    notifications = await tryAlternativeFieldNames(notificationsCollection, employerId);
  }

  
  
  return {
    notifications,
    debugInfo: {
      employerId: employerId,
      employerIdString: convertEmployerIdToString(employerId),
      totalNotificationsInCollection: totalCount
    }
  };
}

async function tryAlternativeFieldNames(notificationsCollection, employerId) {
  const alternativeFields = ['employer_id', 'employerId', 'employer_id'];
  
  for (const field of alternativeFields) {
    // Try string version
    let notifications = await notificationsCollection.find({  
      [field]: convertEmployerIdToString(employerId)
    }).sort({ createdAt: -1 }).toArray();
    
    if (notifications.length > 0) {
      return notifications;
    }
    
    // Try ObjectId version
    const employerObjectId = convertEmployerIdToObjectId(employerId);
    if (employerObjectId) {
      try {
        notifications = await notificationsCollection.find({  
          [field]: employerObjectId
        }).sort({ createdAt: -1 }).toArray();
        
        if (notifications.length > 0) {
          
          return notifications;
        }
      } catch (err) {
        return null
      }
    }
  }
  
  return [];
}

async function verifyJobApplicationNotificationOwnership(notificationsCollection, notificationId, employerId) {
  try {
    const employerObjectId = convertEmployerIdToObjectId(employerId);
    if (!employerObjectId) {
      return null;
    }

    return await notificationsCollection.findOne({
      _id: new ObjectId(notificationId),
      employerId: employerObjectId
    });
  } catch (error) {

    return null;
  }
}

async function deleteJobApplicationNotification(notificationsCollection, notificationId, employerId) {
  const employerObjectId = convertEmployerIdToObjectId(employerId);
  if (!employerObjectId) {
    return { deletedCount: 0 };
  }

  return await notificationsCollection.deleteOne({
    _id: new ObjectId(notificationId),
    employerId: employerObjectId
  });
}

function createEmptyNotificationsResponse(debugInfo) {
  return {
    notifications: [],
    message: 'No notifications found for this employer',
    debug: debugInfo
  };
}

module.exports = {
  getEmployerNotificationCollections,
  validateObjectId,
  convertEmployerIdToString,
  convertEmployerIdToObjectId,
  fetchEmployerNotifications,
  extractJobIdsFromNotifications,
  createJobTitleMapping,
  enrichNotificationsWithJobTitles,
  processAndEnrichNotifications,
  verifyNotificationOwnership,
  markNotificationAsRead,
  deleteEmployerNotification,
  fetchJobApplicationNotifications,
  tryAlternativeFieldNames,
  verifyJobApplicationNotificationOwnership,
  deleteJobApplicationNotification,
  createEmptyNotificationsResponse
};