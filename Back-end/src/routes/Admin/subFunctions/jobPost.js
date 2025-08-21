const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { COLLECTIONS } = require('../../../config/constants');

function getCollections(db) {
  return {
    jobPosts: db.collection(COLLECTIONS.OTHER.JOB_POST),
    employer: db.collection(COLLECTIONS.ROLE.EMPLOYER),
    notifications: db.collection(COLLECTIONS.NOTIFICATIONS.ADMIN_NOTIFICATIONS)
  };
}

async function attachEmployerDetails(job, employerCollection) {
  if (job.employerId) {
    // Convert string ID to ObjectId if needed
    const employerObjectId = typeof job.employerId === 'string' 
      ? new ObjectId(job.employerId) 
      : job.employerId;
      
    const employer = await employerCollection.findOne({ _id: employerObjectId });
    if (employer) {
      job.employerName = employer.employerName || employer.name || "Unknown employer";
      
      if (employer.logo || employer.thumbnail) {
        job.employerLogo = employer.logo || employer.thumbnail;
      }
    } else {
      job.employerName = "Unknown employer";
    }
  }
  return job;
}


async function createEmployerNotification(notificationsCollection, employerId, jobId, message, type) {
  return await notificationsCollection.insertOne({
    employerId: employerId.toString(),
    jobId: jobId,
    message: message,
    status: 'unread',
    type: type,
    createdAt: new Date()
  });
}

async function updateJobPostStatus(jobPostsCollection, jobId, status, userId) {
  const updateFields = {
    status: status,
    [`${status}At`]: new Date(),
    [`${status}By`]: userId
  };
  
  return await jobPostsCollection.updateOne(
    { _id: new ObjectId(jobId) },
    { $set: updateFields }
  );
}




function handleError(res, err, message, statusCode = 500) {
  console.error(`${message}:`, err);
  res.status(statusCode).json({ error: message });
}

module.exports = {
  getCollections,
    attachEmployerDetails,
    createEmployerNotification,
    updateJobPostStatus,
    handleError
};