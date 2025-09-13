const { ObjectId } = require('mongodb');
const { COLLECTIONS } = require('../../../config/constants');
function getNotificationCollections(db) {
  return {
    employerNotifications: db.collection(COLLECTIONS.NOTIFICATIONS.EM_NOTIFICATIONS),
    vacancyNotifications: db.collection(COLLECTIONS.NOTIFICATIONS.VACANCIES_NOTIFICATIONS),
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

function handleError(res, error, operation, statusCode = 500) {
  console.error(`Error ${operation}:`, error);
  res.status(statusCode).json({ 
    message: `Server error while ${operation}`,
    error: error.message 
  });
}

function convertToObjectId(userId) {
  try {
    return new ObjectId(userId);
  } catch (error) {
    
    return null;
  }
}

async function fetchJobSeekerNotifications(notificationCollection, jobSeekerId) {
  let notifications = [];
  
  try {
    // Try with ObjectId conversion
    const objectId = convertToObjectId(jobSeekerId);
    if (objectId) {
      notifications = await notificationCollection.find({  
        jobSeekerId: objectId
      }).sort({ createdAt: -1 }).toArray();
    }
  } catch (objectIdError) {
   
    
    // Try with string ID as fallback
    try {
      notifications = await notificationCollection.find({  
        jobSeekerId: jobSeekerId
      }).sort({ createdAt: -1 }).toArray();
    } catch (fallbackError) {
      
    }
  }

  return notifications;
}

function extractJobIds(notifications) {
  return notifications.map(notification => {
    try {
      return new ObjectId(notification.jobId);
    } catch (err) {
     
      return null;
    }
  }).filter(id => id !== null);
}

function createJobTitleMap(jobs) {
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

async function fetchJobTitlesForNotifications(jobsCollection, notifications) {
  // Extract valid job IDs
  const jobIds = extractJobIds(notifications);

  if (jobIds.length === 0) {
    return {};
  }

  // Fetch jobs
  const jobs = await jobsCollection.find({ _id: { $in: jobIds } }).toArray();
  
  // Create and return mapping
  return createJobTitleMap(jobs);
}

async function verifyNotificationOwnership(notificationCollection, notificationId, userId) {
  try {
    const userObjectId = convertToObjectId(userId);
    if (!userObjectId) {
      return null;
    }

    return await notificationCollection.findOne({
      _id: new ObjectId(notificationId),
      jobSeekerId: userObjectId
    });
  } catch (error) {
   
    return null;
  }
}

async function markNotificationAsRead(notificationCollection, notificationId) {
  return await notificationCollection.updateOne(
    { _id: new ObjectId(notificationId) },
    { $set: { isRead: true } }
  );
}

async function deleteUserNotification(notificationCollection, notificationId, userId) {
  const userObjectId = convertToObjectId(userId);
  if (!userObjectId) {
    return { deletedCount: 0 };
  }

  return await notificationCollection.deleteOne({
    _id: new ObjectId(notificationId),
    jobSeekerId: userObjectId
  });
}

async function fetchVacancyNotifications(notificationCollection) {
  return await notificationCollection.find({})
    .sort({ createdAt: -1 })
    .toArray();
}
async function processAndEnrichNotifications(notifications, jobsCollection) {
  if (notifications.length === 0) {
    return [];
  }

  // Get job title mapping
  const jobTitleMap = await fetchJobTitlesForNotifications(jobsCollection, notifications);
  
  // Enrich notifications with job titles
  return enrichNotificationsWithJobTitles(notifications, jobTitleMap);
}

module.exports = {
  getNotificationCollections,
  validateObjectId,
  handleError,
  convertToObjectId,
  fetchJobSeekerNotifications,
  extractJobIds,
  createJobTitleMap,
  enrichNotificationsWithJobTitles,
  fetchJobTitlesForNotifications,
  verifyNotificationOwnership,
  markNotificationAsRead,
  deleteUserNotification,
  fetchVacancyNotifications,
  processAndEnrichNotifications
};