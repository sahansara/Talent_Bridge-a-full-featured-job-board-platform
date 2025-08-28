const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { COLLECTIONS } = require('../../../config/constants');
const { isValidEmail, isValidPhoneNumber } = require('../../../utils/validation');
function getEmployerCollection(db) {
  return db.collection(COLLECTIONS.ROLE.EMPLOYER);
}

function handleError(res, error, operation, statusCode = 500) {
  console.error(`${operation} error:`, error);
  res.status(statusCode).json({ error: `Error ${operation}` });
}

function ensureUploadDirectory(uploadDir) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}



function createCompanyImageStorage(uploadDir) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
}

function createUploadMiddleware(uploadDir = 'uploads/company-images/') {
  ensureUploadDirectory(uploadDir);
  const storage = createCompanyImageStorage(uploadDir);
  return multer({ storage: storage });
}

function validateRequiredFields(body, res) {
  const requiredFields = ['employerName', 'email', 'password', 'comDescription', 'contactNumber'];
  
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

function validateEmail(email, res) {
  if (!(email)) {
    res.status(400).json({ error: 'Please provide a valid email address' });
    return false;
  }
  return true;
}

function validatePhoneNumber(contactNumber, res) {
  if (!isValidPhoneNumber(contactNumber)) {
    res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    return false;
  }
  return true;
}

async function checkEmailExists(collection, email) {
  const existingUser = await collection.findOne({ email });
  return !!existingUser;
}

async function hashPassword(password, saltRounds = 10) {
  return await bcrypt.hash(password, saltRounds);
}

function extractImagePath(files) {
  return files?.['companyImage']?.[0]?.path || null;
}

function buildEmployerUserData(body, hashedPassword, imagePath) {
  const { employerName, email, comDescription, contactNumber, employerWebsite, role } = body;
  
  return {
    employerName,
    email,
    role: role || 'employer',
    password: hashedPassword,
    comDescription,
    contactNumber,
    employerWebsite,
    image: imagePath,
    createdAt: new Date()
  };
}

async function registerEmployer(collection, userData) {
  return await collection.insertOne(userData);
}

function logRegistrationRequest(body) {
  console.log('Registration request body:', body);
}

function validateEmployerRegistration(body, res) {
  // Check required fields
  if (!validateRequiredFields(body, res)) return false;
  
  // Validate email format
  if (!validateEmail(body.email, res)) return false;
  
  // Validate phone number format
  if (!validatePhoneNumber(body.contactNumber, res)) return false;
  
  return true;
}

async function processEmployerRegistration(body, files, collection) {
  // Check if email already exists
  const emailExists = await checkEmailExists(collection, body.email);
  if (emailExists) {
    throw new Error('EMAIL_EXISTS');
  }

  // Extract image path
  const imagePath = extractImagePath(files);
  
  // Hash password
  const hashedPassword = await hashPassword(body.password);
  
  // Build user data
  const userData = buildEmployerUserData(body, hashedPassword, imagePath);
  
  // Register employer
  const result = await registerEmployer(collection, userData);
  
  return result;
}

module.exports = {
  getEmployerCollection,
  handleError,
  ensureUploadDirectory,
  createCompanyImageStorage,
  createUploadMiddleware,
  isValidEmail,
  isValidPhoneNumber,
  validateRequiredFields,
  validateEmail,
  validatePhoneNumber,
  checkEmailExists,
  hashPassword,
  extractImagePath,
  buildEmployerUserData,
  registerEmployer,
  logRegistrationRequest,
  validateEmployerRegistration,
  processEmployerRegistration
};