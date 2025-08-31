const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
const { COLLECTIONS } = require('../../../config/constants');


function getEmployerCollections(db) {
  return {
    applications: db.collection(COLLECTIONS.OTHER.APPLICATIONS),
    notifications: db.collection(COLLECTIONS.NOTIFICATIONS.EM_NOTIFICATIONS),
    companies: db.collection(COLLECTIONS.ROLE.EMPLOYER),
  };
}

function handleError(res, error, operation, statusCode = 500) {
  console.error(`Error ${operation}:`, error);
  res.status(statusCode).json({ error: `Error ${operation}` });
}

function logOperation(operation, details) {
  console.log(`${operation}: ${details}`);
}

async function fetchEmployerApplications(applicationsCollection, employerId) {
  return await applicationsCollection.find({
    employerId: new ObjectId(employerId)
  }).sort({ appliedAt: -1 }).toArray();
}

function formatImageUrl(imagePath) {
  if (!imagePath) return null;
  return `http://localhost:3000/${imagePath.replace(/\\/g, '/')}`;
}

function formatCvUrl(cvPath) {
  if (!cvPath) return null;
  return `http://localhost:3000/${cvPath.replace(/\\/g, '/')}`;
}
function formatApplicationData(app) {
  return {
    id: app._id,
    jobSeekerId: app.jobSeekerId,
    name: app.jobSeekerProfile.fullName,
    email: app.jobSeekerProfile.email,
    phone: app.jobSeekerProfile.phone || 'N/A',
    image: formatImageUrl(app.jobSeekerProfile.profileImage),
    appliedDate: app.appliedAt,
    status: app.status,
    cvUrl: formatCvUrl(app.jobSeekerProfile.cv),
    experience: app.jobSeekerProfile.experience || 'N/A',
    location: app.jobSeekerProfile.location || 'N/A',
    skills: app.jobSeekerProfile.skills || [],
    notes: app.notes || ''
  };
}

function groupApplicationsByJob(applications) {
  return applications.reduce((acc, app) => {
    const jobId = app.jobId.toString();
    
    if (!acc[jobId]) {
      acc[jobId] = {
        jobId: app.jobId,
        jobDetails: app.jobDetails,
        applications: []
      };
    }
    
    acc[jobId].applications.push(formatApplicationData(app));
    
    return acc;
  }, {});
}

function formatJobPostsFromApplications(groupedApplications) {
  return Object.values(groupedApplications).map(job => ({
    id: job.jobId,
    title: job.jobDetails.title,
    category: job.jobDetails.category || 'General',
    location: job.jobDetails.location,
    postDate: job.jobDetails.approvedAt || job.jobDetails.createdAt,
    employer: job.jobDetails.employer,
    logo: formatImageUrl(job.jobDetails.logo),
    applications: job.applications
  }));
}

function processEmployerApplications(applications) {
  if (!applications || applications.length === 0) {
    return [];
  }

  // Group applications by job ID
  const groupedApplications = groupApplicationsByJob(applications);
  
  // Convert to job posts format
  return formatJobPostsFromApplications(groupedApplications);
}

function validateApplicationStatus(status, res) {
  const validStatuses = ['Applied', 'Under Review', 'Accepted', 'Rejected'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status provided' });
    return false;
  }
  return true;
}

async function findAndVerifyApplication(applicationsCollection, applicationId, employerId) {
  return await applicationsCollection.findOne({
    _id: new ObjectId(applicationId),
    employerId: new ObjectId(employerId)
  });
}

async function fetchEmployerDetails(companiesCollection, employerId) {
  if (!employerId) return null;
  
  return await companiesCollection.findOne({ 
    _id: new ObjectId(employerId) 
  });
}

async function updateApplicationStatus(applicationsCollection, applicationId, status) {
  return await applicationsCollection.updateOne(
    { _id: new ObjectId(applicationId) },
    {
      $set: {
        status: status,
        updatedAt: new Date()
      }
    }
  );
}

function generateNotificationMessage(status, jobTitle) {
  switch(status) {
    case 'Accepted':
      return `Great news! Your application for **${jobTitle}** has been accepted. The employer will contact you soon for next steps.`;
    case 'Under Review':
      return `Your application for **${jobTitle}** is now under review. We'll update you on the progress soon.`;
    case 'Rejected':
      return `Thank you for your interest. Unfortunately, your application for **${jobTitle}** was not selected this time.`;
    default:
      return `Your application status for **${jobTitle}** has been updated to ${status}.`;
  }
}

function createStatusNotificationData(application, employerId, applicationId, status, employer) {
  const message = generateNotificationMessage(status, application.jobDetails.title);
  
  return {
    jobSeekerId: application.jobSeekerId,
    employerId: new ObjectId(employerId),
    applicationId: new ObjectId(applicationId),
    jobId: application.jobId,
    message: message,
    type: 'status_update',
    status: status,
    jobTitle: application.jobDetails.title,
    employerName: employer?.employerName || 'Unknown Employer',
    employerImage: employer?.image || null,
    isRead: false,
    createdAt: new Date()
  };
}
async function insertNotification(notificationsCollection, notificationData) {
  return await notificationsCollection.insertOne(notificationData);
}

async function updateApplicationNotes(applicationsCollection, applicationId, employerId, notes) {
  return await applicationsCollection.updateOne(
    { 
      _id: new ObjectId(applicationId),
      employerId: new ObjectId(employerId)
    },
    {
      $set: {
        notes: notes || '',
        updatedAt: new Date()
      }
    }
  );
}

async function fetchEmployerNotifications(notificationsCollection, employerId, limit = 50) {
  return await notificationsCollection.find({
    employerId: new ObjectId(employerId)
  }).sort({ createdAt: -1 }).limit(limit).toArray();
}

function generateCvFilePaths(filename, currentDir) {
  return [
    path.join(currentDir, '../../uploads/cvs', filename),
    path.join(currentDir, '../uploads/cvs', filename),
    path.join(currentDir, '../../uploads', filename),
    path.join(currentDir, '../uploads', filename),
    path.join(process.cwd(), 'uploads/cvs', filename),
    path.join(process.cwd(), 'uploads', filename),
    path.join(process.cwd(), 'backend/uploads/cvs', filename),
    path.join(process.cwd(), 'backend/uploads', filename)
  ];
}

function findExistingCvFile(possiblePaths) {
  for (let i = 0; i < possiblePaths.length; i++) {
    if (fs.existsSync(possiblePaths[i])) {
      return possiblePaths[i];
    }
  }
  return null;
}

function logCvDebugInfo(filename, employerId, currentDir, possiblePaths, application) {
  console.log('=== CV FILE DEBUG START ===');
  console.log('1. Requested filename:', filename);
  console.log('2. Employer ID:', employerId);
  console.log('3. Current __dirname:', currentDir);
  console.log('4. Process CWD:', process.cwd());
  console.log('5. Application found:', !!application);
  
  if (application) {
    console.log('6. Application CV field:', application.jobSeekerProfile?.cv);
  }
  
  console.log('7. Testing these paths:');
  possiblePaths.forEach((testPath, index) => {
    const exists = fs.existsSync(testPath);
    console.log(`   ${index + 1}. ${testPath} - ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
  });
  
  console.log('=== CV FILE DEBUG END ===');
}
async function verifyCvAccess(applicationsCollection, employerId, filename) {
  return await applicationsCollection.findOne({
    employerId: new ObjectId(employerId),
    'jobSeekerProfile.cv': { $regex: filename }
  });
}

function setCvResponseHeaders(res, filename) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=' + filename);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function streamCvFile(res, filePath) {
  const fileStream = fs.createReadStream(filePath);
  
  fileStream.on('error', (error) => {
    console.error('Error streaming file:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error streaming file' });
    }
  });
  
  fileStream.pipe(res);
}

module.exports = {
  getEmployerCollections,
  handleError,
  logOperation,
  fetchEmployerApplications,
  formatImageUrl,
  formatCvUrl,
  formatApplicationData,
  groupApplicationsByJob,
  formatJobPostsFromApplications,
  processEmployerApplications,
  validateApplicationStatus,
  findAndVerifyApplication,
  fetchEmployerDetails,
  updateApplicationStatus,
  generateNotificationMessage,
  createStatusNotificationData,
  insertNotification,
  updateApplicationNotes,
  fetchEmployerNotifications,
  generateCvFilePaths,
  findExistingCvFile,
  logCvDebugInfo,
  verifyCvAccess,
  setCvResponseHeaders,
  streamCvFile
};