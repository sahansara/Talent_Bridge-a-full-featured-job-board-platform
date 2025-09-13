const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
const { COLLECTIONS } = require('../../config/constants');
const { isValidEmail, } = require('../../utils/validation');

function getFeedbackCollection(db) {
  return db.collection(COLLECTIONS.OTHER.FeedBack);
}
function handleError(res, error, operation, statusCode = 500) {
  console.error(`${operation} error:`, error);
  res.status(statusCode).json({ error: `Error ${operation}` });
}

function validateRequiredFields(body, res) {
  const requiredFields = ['name', 'email', 'message',];
  
  if (!body) {
    res.status(400).json({ error: 'Please provide request body' });
    return false;
  }

  for (const field of requiredFields) {
    if (!body[field]) {
      res.status(400).json({ error: 'Please provide all required fields' });
      return false;
    }
  }

  return true;
}

function validateFeedbackFields(body, res) {
  if (!isValidEmail(body.email)) {
    res.status(400).json({ error: 'Please provide a valid email address' });
    return false;
  }

  if (body.name.length < 2 || body.name.length > 100) {
    res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    return false;
  }

  if (body.message.length < 10 || body.message.length > 1000) {
    res.status(400).json({ error: 'Message must be between 10 and 1000 characters' });
    return false;
  }

  return true;
}
async function processFeedback(body, feedbackCollection) {
  const feedbackData = {
    name: body.name,
    email: body.email,
    message: body.message,
    role: body.role || 'User',
    rating: body.rating ? parseInt(body.rating) : null,
    submittedAt: new Date()
  };

  const result = await feedbackCollection.insertOne(feedbackData);
  return result;
}


async function getFeedbackFilter(feedbackCollection) {
  const feedbacks = await feedbackCollection
    .find({ rating: { $in: [3,4, 5] } })
    .sort({ submittedAt: -1 })
    .toArray();
  return feedbacks;
}
function getFeedbackProjection() {
  return {
    _id: 1,
    name: 1,
    email: 1,
    message: 1,
    role: 1,
    rating: 1,
    submittedAt: 1
  };
}
module.exports = {
    getFeedbackCollection,
    handleError,
    validateRequiredFields,
    validateFeedbackFields,
    processFeedback,
    getFeedbackFilter,
    getFeedbackProjection
};
