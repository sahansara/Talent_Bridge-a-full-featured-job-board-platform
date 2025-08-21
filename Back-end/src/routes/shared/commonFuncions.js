const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { isValidPassword } = require('../../utils/validation');



function validateDatabaseConnection(db, res) {
  if (!db) {
    res.status(500).json({ error: 'Database connection not available' });
    return false;
  }
  return true;
}

function handleError(res, error, operation, statusCode = 500) {
  console.error(`Error ${operation}:`, error);
  res.status(statusCode).json({ error: `Failed to ${operation}` });
}

async function fetchUserById(collection, userId) {
  return await collection.findOne({ _id: new ObjectId(userId) });
}


async function isEmailAlreadyInUse(collection, email, currentUserId) {
  if (!email) return false;
  
  const existingUser = await collection.findOne({ 
    email, 
    _id: { $ne: new ObjectId(currentUserId) } 
  });
  
  return !!existingUser;
}

async function updateUserProfile(collection, userId, updateData) {
  return await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: updateData }
  );
}

function validatePasswordChangeInput(currentPassword, newPassword, res) {
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current password and new password are required' });
    return false;
  }


  return true;
}

function isValidPasswordFormat(currentPassword, newPassword, res) {
  if (!isValidPassword(newPassword)) {
    res.status(400).json({ error: 'New password does not meet complexity requirements' });
    return false; 
  }
  if (currentPassword === newPassword) {
    res.status(400).json({ error: 'New password cannot be the same as current password' });
    return false;
  }
  return true;
}

async function verifyCurrentPassword(currentPassword, hashedPassword) {
  return await bcrypt.compare(currentPassword, hashedPassword);
}

async function hashNewPassword(newPassword) {
  return await bcrypt.hash(newPassword, 10);
}

async function updateUserPassword(collection, userId, hashedPassword) {
  return await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { password: hashedPassword } }
  );
}


function validateFileUpload(file, res, fileType) {
  if (!file) {
    res.status(400).json({ error: `No ${fileType} file uploaded` });
    return false;
  }
  return true;
}

module.exports = {
    validateDatabaseConnection,
    handleError,
    fetchUserById,
    isEmailAlreadyInUse,
    updateUserProfile,
    validatePasswordChangeInput,
    isValidPasswordFormat,
    verifyCurrentPassword,
    hashNewPassword,
    updateUserPassword,
    validateFileUpload
    };