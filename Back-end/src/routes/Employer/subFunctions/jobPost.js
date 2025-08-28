const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { COLLECTIONS } = require('../../../config/constants');

function getJobsCollection(db) {
  return db.collection(COLLECTIONS.OTHER.JOB_POST);
}



function ensureUploadDirectory(uploadDir) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

function createJobThumbnailStorage() {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'uploads/job-thumbnail';
      ensureUploadDirectory(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Create unique filename with original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'job-' + uniqueSuffix + ext);
    }
  });
}

function imageFileFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
}
function createJobThumbnailUpload() {
  return multer({ 
    storage: createJobThumbnailStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: imageFileFilter
  });
}

function buildEmployerJobsQuery(employerId, status) {
  const query = { employerId: new ObjectId(employerId) };
  
  if (status && status !== 'all') {
    query.status = status;
  }
  
  return query;
}

async function fetchEmployerJobs(jobsCollection, employerId, status) {
  const query = buildEmployerJobsQuery(employerId, status);
  return await jobsCollection.find(query).sort({ createdAt: -1 }).toArray();
}

function validateJobFields(jobData, res) {
  const { title, description, location, jobType, salary } = jobData;
  
  if (!title || !description || !location || !jobType || !salary) {
    res.status(400).json({ message: 'All fields are required' });
    return false;
  }
  
  return true;
}

function createNewJobData(employerId, jobData, file = null) {
  const { title, description, location, jobType, salary } = jobData;
  
  return {
    employerId: new ObjectId(employerId),
    title,
    description,
    location,
    jobType,
    salary,
    thumbnail: file ? `uploads/job-thumbnail/${file.filename}` : null,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

async function insertNewJob(jobsCollection, jobData) {
  const result = await jobsCollection.insertOne(jobData);
  jobData._id = result.insertedId;
  return jobData;
}

async function verifyJobOwnership(jobsCollection, jobId, employerId) {
  return await jobsCollection.findOne({ 
    _id: new ObjectId(jobId),
    employerId: new ObjectId(employerId)
  });
}

function safeDeleteFile(filePath, fileType = 'file') {
  if (filePath) {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error(`Error deleting ${fileType}:`, error);
      // Continue execution even if file deletion fails
    }
  }
}

function buildJobUpdateData(existingJob, updateData, file = null) {
  const { title, description, location, jobType, salary } = updateData;
  
  const updateObject = {
    title: title || existingJob.title,
    description: description || existingJob.description,
    location: location || existingJob.location,
    jobType: jobType || existingJob.jobType,
    salary: salary || existingJob.salary,
    updatedAt: new Date()
  };
  
  // Handle thumbnail update
  if (file) {
    // Delete old thumbnail if exists
    safeDeleteFile(existingJob.thumbnail, 'thumbnail');
    // Set new thumbnail path
    updateObject.thumbnail = `uploads/job-thumbnail/${file.filename}`;
  }
  
  return updateObject;
}

async function updateJobInDatabase(jobsCollection, jobId, updateData) {
  return await jobsCollection.updateOne(
    { _id: new ObjectId(jobId) },
    { $set: updateData }
  );
}
async function fetchUpdatedJob(jobsCollection, jobId) {
  return await jobsCollection.findOne({ _id: new ObjectId(jobId) });
}


async function deleteJobAndFiles(jobsCollection, job) {
  // Delete thumbnail file if exists
  safeDeleteFile(job.thumbnail, 'thumbnail');
  
  // Delete job from database
  return await jobsCollection.deleteOne({ _id: job._id });
}

function validateObjectId(id, res, fieldName = 'ID') {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ message: `Invalid ${fieldName} format` });
    return false;
  }
  return true;
}

function handleJobNotFound(res, operation = 'access') {
  res.status(404).json({ message: `Job not found or not authorized to ${operation}` });
}

module.exports = {
  getJobsCollection,
  ensureUploadDirectory,
  createJobThumbnailStorage,
  imageFileFilter,
  createJobThumbnailUpload,
  buildEmployerJobsQuery,
  fetchEmployerJobs,
  validateJobFields,
  createNewJobData,
  insertNewJob,
  verifyJobOwnership,
  safeDeleteFile,
  buildJobUpdateData,
  updateJobInDatabase,
  fetchUpdatedJob,
  deleteJobAndFiles,
  validateObjectId,
  handleJobNotFound
};