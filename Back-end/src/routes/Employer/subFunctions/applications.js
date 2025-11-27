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
  const baseFilename = filename.replace(/^cv-/, ''); 
  const filenameWithoutExt = filename.replace('.pdf', '');
  
  const possibleFilenames = [
    filename,                    // Original filename
    `cv-${filename}`,           // With cv- prefix
    `cv-${baseFilename}`,       // cv- + base filename
    filenameWithoutExt,         // Without extension
    `cv-${filenameWithoutExt}`  // cv- prefix without extension
  ];
  
  const basePaths = [
    path.join(currentDir, '../../uploads/cvs'),
    path.join(currentDir, '../uploads/cvs'),
    path.join(currentDir, '../../uploads'),
    path.join(currentDir, '../uploads'),
    path.join(process.cwd(), 'uploads/cvs'),
    path.join(process.cwd(), 'uploads'),
    path.join(process.cwd(), 'backend/uploads/cvs'),
    path.join(process.cwd(), 'backend/uploads')
  ];
  
  // Generate all combinations
  const allPaths = [];
  basePaths.forEach(basePath => {
    possibleFilenames.forEach(fname => {
      allPaths.push(path.join(basePath, fname));
      // Also try with .pdf extension if not already present
      if (!fname.includes('.pdf')) {
        allPaths.push(path.join(basePath, `${fname}.pdf`));
      }
    });
  });
  
  return allPaths;
}

// Enhanced debug logging
function logCvDebugInfo(filename, employerId, currentDir, possiblePaths, application) {

  console.log('1. Requested filename:', filename);
  console.log('2. Employer ID:', employerId);
  console.log('3. Current __dirname:', currentDir);
  console.log('4. Process CWD:', process.cwd());
  console.log('5. Application found:', !!application);
  
  if (application) {
    console.log('6. Application CV field:', application.jobSeekerProfile?.cv);
    console.log('7. Application ID:', application._id);
    console.log('8. Job Seeker ID:', application.jobSeekerId);
  }
  
  console.log('9. Testing these paths:');
  possiblePaths.forEach((testPath, index) => {
    const exists = fs.existsSync(testPath);
    console.log(`   ${index + 1}. ${testPath} - ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
  });
  
  // Also check if the actual file from database exists
  if (application?.jobSeekerProfile?.cv) {
    const dbCvPath = path.join(process.cwd(), application.jobSeekerProfile.cv);
    const dbFileExists = fs.existsSync(dbCvPath);
    console.log('10. Database CV path:', dbCvPath, '-', dbFileExists ? '✅ EXISTS' : '❌ NOT FOUND');
  }
  
  console.log('CV FILE DEBUG END ');
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
  console.log('Verifying CV access for:', { employerId, filename });
  
  // Try multiple query patterns
  const queries = [
    // Exact match
    {
      employerId: new ObjectId(employerId),
      'jobSeekerProfile.cv': filename
    },
    // Regex match for partial filename
    {
      employerId: new ObjectId(employerId),
      'jobSeekerProfile.cv': { $regex: filename.replace('.pdf', ''), $options: 'i' }
    },
    // Check if filename contains the pattern
    {
      employerId: new ObjectId(employerId),
      'jobSeekerProfile.cv': { $regex: filename.split('.')[0], $options: 'i' }
    }
  ];
  
  for (const query of queries) {
    const result = await applicationsCollection.findOne(query);
    if (result) {
      console.log('Found application with query:', query);
      return result;
    }
  }
  
  console.log('No application found with any query pattern');
  return null;
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
async function getCvPathFromDatabase(applicationsCollection, employerId, filename) {
  const application = await applicationsCollection.findOne({
    employerId: new ObjectId(employerId),
    $or: [
      { 'jobSeekerProfile.cv': { $regex: filename, $options: 'i' } },
      { 'jobSeekerProfile.cv': { $regex: filename.replace('.pdf', ''), $options: 'i' } }
    ]
  });
  
  if (application?.jobSeekerProfile?.cv) {
    return {
      application,
      cvPath: path.join(process.cwd(), application.jobSeekerProfile.cv)
    };
  }
  
  return null;
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