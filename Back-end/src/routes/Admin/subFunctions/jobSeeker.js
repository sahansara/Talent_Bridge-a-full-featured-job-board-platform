const express = require('express');
const { ObjectId } = require('mongodb');
const { COLLECTIONS} = require('../../../config/constants');

function validateObjectId(id, res) {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid job seeker ID' });
    return false;
  }
  return true;
}

function getJobSeekersCollection(db) {
  return db.collection(COLLECTIONS.ROLE.JOB_SEEKER);
}

function getJobSeekerProjection() {
  return {
    _id: 1,
    fullName: 1,
    email: 1,
    role: 1,
    createdAt: 1
   
  };
}

function getJobSeekerFilter() {
  return { role: 'jobseeker' };
}

function handleError(res, error, operation, statusCode = 500) {
  console.error(`Error ${operation}:`, error);
  res.status(statusCode).json({ error: `Failed to ${operation}` });
}

function logOperation(operation, details) {
  console.log(`Admin ${operation}: ${details}`);
}

function validateBulkDeleteRequest(userIds, res) {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    res.status(400).json({ error: 'User IDs array is required' });
    return false;
  }

  const invalidIds = userIds.filter(id => !ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    res.status(400).json({ error: `Invalid user IDs: ${invalidIds.join(', ')}` });
    return false;
  }
  
  return true;
}
module.exports = {
  validateObjectId,
    getJobSeekersCollection,
    getJobSeekerProjection,
    getJobSeekerFilter,
    handleError,
    logOperation,
    validateBulkDeleteRequest
};