// loadpost.js - Job Posts API routes
const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();



router.get('/jobs', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const jobssCollection = db.collection('Job_Posts');
    const employercollection = db.collection('Companies');
    const searchQuery = req.query.search || '';

    const filter = { status: "approved" };

    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
        { jobType: { $regex: searchQuery, $options: 'i' } },
        { employer: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    const jobs = await jobssCollection.find(filter).sort({ approvedAt: -1 }).toArray();

    // Loop through jobs to enrich with employer data
    const formattedJobs = await Promise.all(jobs.map(async (job) => {
      let employerName = job.employer || "employer Name";
      let logo = job.thumbnail || null;

      if (job.employerId) {
        const employerObjectId = typeof job.employerId === 'string'
          ? new ObjectId(job.employerId)
          : job.employerId;

        const employer = await employercollection.findOne({ _id: employerObjectId });

        if (employer) {
          employerName = employer.employerName || employer.name || employerName;
          logo = employer.logo || employer.thumbnail || logo;
        }
      }

      return {
        id: job._id,
        title: job.title,
        employer: employerName,
        location: job.location,
        salary: job.salary,
        logo: logo,
        description: job.description,
        jobType: job.jobType,
        approvedAt: job.approvedAt,
      };
    }));

    res.status(200).json(formattedJobs);
  } catch (error) {
    console.error('Error fetching job posts:', error);
    res.status(500).json({ error: 'Failed to fetch job posts' });
  }
});


// Get job post by ID
router.get('/job/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const jobssCollection = db.collection('Job_Posts');
    const employercollection = db.collection('Companies');

    const jobId = req.params.id;

    // Validate ID format
    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    // Find the job post by ID and ensure it's approved
    const job = await jobssCollection.findOne({
      _id: new ObjectId(jobId),
      status: "approved"
    });

    if (!job) {
      return res.status(404).json({ error: 'Job post not found or not approved' });
    }

    // Attach employerName and logo if employerId exists
    if (job.employerId) {
      const employerObjectId = typeof job.employerId === 'string'
        ? new ObjectId(job.employerId)
        : job.employerId;

      const employer = await employercollection.findOne({ _id: employerObjectId });

      if (employer) {
        job.employerName = employer.employerName || employer.name || 'Unknown employer';
        job.employerLogo = employer.logo || employer.thumbnail || null;
      } else {
        job.employerName = 'Unknown employer';
        job.employerLogo = null;
      }
    }

    // Format the response
    const formattedJob = {
      id: job._id,
      title: job.title,
      employer: job.employerName || job.employer || 'employer Name',
      location: job.location,
      salary: job.salary,
      logo: job.employerLogo || job.thumbnail || null,
      description: job.description,
      jobType: job.jobType,
      approvedAt: job.approvedAt
    };

    res.status(200).json(formattedJob);
  } catch (error) {
    console.error('Error fetching job post:', error);
    res.status(500).json({ error: 'Failed to fetch job post' });
  }
});
// Check if job seeker already applied to a specific job
router.get('/applications', async (req, res) => {
  try {
    const { jobId } = req.query;
    const jobSeekerId = req.user.userId;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    // Check if application already exists
    const db = req.app.locals.db;
    const jobApplicationsCollection = db.collection('job_applications');
    
    const existingApplication = await jobApplicationsCollection.findOne({
      jobSeekerId: new ObjectId(jobSeekerId),
      jobId: new ObjectId(jobId)
    });

    if (existingApplication) {
      return res.status(200).json([{ jobId: jobId, status: existingApplication.status }]);
    }

    return res.status(200).json([]);
  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Submit job application
router.post('/applications', async (req, res) => {
  try {
    const { jobId } = req.body;
    const jobSeekerId = req.user.userId;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const db = req.app.locals.db;
    const jobApplicationsCollection = db.collection('job_applications');
    const jobPostsCollection = db.collection('Job_Posts');
    const seekEmployeesCollection = db.collection('seek_employees');
    const jobSeekerNotificationsCollection = db.collection('job_seeker_notifications');

    // Check if job exists and is approved
    const job = await jobPostsCollection.findOne({ 
      _id: new ObjectId(jobId),
      status: 'approved'
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found or not approved' });
    }

    // Check if already applied
    const existingApplication = await jobApplicationsCollection.findOne({
      jobSeekerId: new ObjectId(jobSeekerId),
      jobId: new ObjectId(jobId)
    });

    if (existingApplication) {
      return res.status(409).json({ error: 'You have already applied to this job' });
    }

    // Get job seeker profile details
    const jobSeeker = await seekEmployeesCollection.findOne({ 
      _id: new ObjectId(jobSeekerId) 
    });

    if (!jobSeeker) {
      return res.status(404).json({ error: 'Job seeker profile not found' });
    }

    // Create application record
    const applicationData = {
      jobSeekerId: new ObjectId(jobSeekerId),
      jobId: new ObjectId(jobId),
      employerId: new ObjectId(job.employerId),
      status: 'Applied',
      jobSeekerProfile: {
        fullName: jobSeeker.fullName,
        email: jobSeeker.email,
        cv: jobSeeker.cv_Upload,
        profileImage: jobSeeker.image
      },
      jobDetails: {
        title: job.title,
        employer: job.employer || 'employer Name',
        jobType: job.jobType,
        description: job.description,
        approvedAt: job.approvedAt,
        location: job.location,
        logo: job.thumbnail || job.employerLogo,
        salary: job.salary
      },
      appliedAt: new Date(),
      updatedAt: new Date()
    };

    // Insert application
    const applicationResult = await jobApplicationsCollection.insertOne(applicationData);

    // Create notification for employer
    const notificationData = {
      applicationId: applicationResult.insertedId,
      employerId: new ObjectId(job.employerId),
      jobSeekerId: new ObjectId(jobSeekerId),
      jobId: new ObjectId(jobId),
      type: 'new_application',
      message: `${jobSeeker.fullName} applied for ${job.title}`,
      jobSeekerName: jobSeeker.fullName,
      jobSeekerImage: jobSeeker.image,
      jobTitle: job.title,
      status: 'unread',
      createdAt: new Date()
    };

    await jobSeekerNotificationsCollection.insertOne(notificationData);

    res.status(201).json({ 
      message: 'Application submitted successfully',
      applicationId: applicationResult.insertedId,
      status: 'Applied'
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all applications for a job seeker (for dashboard)
router.get('/my-applications', async (req, res) => {
  try {
    const jobSeekerId = req.user.userId;
    const db = req.app.locals.db;
    const jobApplicationsCollection = db.collection('job_applications');

    const applications = await jobApplicationsCollection.find({
      jobSeekerId: new ObjectId(jobSeekerId)
    }).sort({ appliedAt: -1 }).toArray();

    // Format applications for frontend
    const formattedApplications = applications.map(app => ({
      id: app._id,
      jobTitle: app.jobDetails.title,
      employer: app.jobDetails.employer,
      jobType: app.jobDetails.jobType,
      approvedAt: app.jobDetails.approvedAt,
      description: app.jobDetails.description,
      location: app.jobDetails.location,
      salary: app.jobDetails.salary,
      logo: app.jobDetails.logo,
      status: app.status,
      appliedAt: app.appliedAt,
      updatedAt: app.updatedAt
    }));

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// // Update application status (when employer views it)
// router.patch('/applications/:applicationId/status', async (req, res) => {
//   try {
//     const { applicationId } = req.params;
//     const { status } = req.body;

//     if (!ObjectId.isValid(applicationId)) {
//       return res.status(400).json({ error: 'Invalid application ID' });
//     }

//     const validStatuses = ['Applied', 'Viewed', 'Interview', 'Rejected', 'Hired'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ error: 'Invalid status' });
//     }

//     const db = req.app.locals.db;
//     const jobApplicationsCollection = db.collection('job_applications');

//     const result = await jobApplicationsCollection.updateOne(
//       { _id: new ObjectId(applicationId) },
//       { 
//         $set: { 
//           status: status,
//           updatedAt: new Date()
//         }
//       }
//     );

//     if (result.matchedCount === 0) {
//       return res.status(404).json({ error: 'Application not found' });
//     }

//     res.status(200).json({ 
//       message: 'Application status updated successfully',
//       status: status
//     });

//   } catch (error) {
//     console.error('Error updating application status:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

module.exports = router;