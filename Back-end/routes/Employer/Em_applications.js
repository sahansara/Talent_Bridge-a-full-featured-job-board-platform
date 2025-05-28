const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// 1. GET /api/employer/applications - Fetch all applications for logged-in employer
router.get('/All-applications', async (req, res) => {
  try {
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const applicationsCollection = db.collection('job_applications');

    console.log(`Fetching applications for employer: ${employerId}`);

    // Get all applications for this employer
    const applications = await applicationsCollection.find({
      employerId: new ObjectId(employerId)
    }).sort({ appliedAt: -1 }).toArray();

    if (!applications || applications.length === 0) {
      return res.status(200).json({
        message: 'No applications found',
        jobPosts: []
      });
    }

    // Group applications by jobId
    const groupedApplications = applications.reduce((acc, app) => {
      const jobId = app.jobId.toString();
      
      if (!acc[jobId]) {
        acc[jobId] = {
          jobId: app.jobId,
          jobDetails: app.jobDetails,
          applications: []
        };
      }
      
      acc[jobId].applications.push({
        id: app._id,
        jobSeekerId: app.jobSeekerId,
        name: app.jobSeekerProfile.fullName,
        email: app.jobSeekerProfile.email,
        phone: app.jobSeekerProfile.phone || 'N/A',
        image: app.jobSeekerProfile.profileImage ? `http://localhost:3000/${app.jobSeekerProfile.profileImage.replace(/\\/g, '/')}` : null,
        appliedDate: app.appliedAt,
        status: app.status,
        cvUrl: app.jobSeekerProfile.cv ? `http://localhost:3000/${app.jobSeekerProfile.cv.replace(/\\/g, '/')}` : null,
        experience: app.jobSeekerProfile.experience || 'N/A',
        location: app.jobSeekerProfile.location || 'N/A',
        skills: app.jobSeekerProfile.skills || [],
        notes: app.notes || ''
      });
      
      return acc;
    }, {});

    // Convert to array format
    const jobPosts = Object.values(groupedApplications).map(job => ({
      id: job.jobId,
      title: job.jobDetails.title,
      category: job.jobDetails.category || 'General',
      location: job.jobDetails.location,
      postDate: job.jobDetails.approvedAt || job.jobDetails.createdAt,
      company: job.jobDetails.company,
      logo: job.jobDetails.logo ? `http://localhost:3000/${job.jobDetails.logo.replace(/\\/g, '/')}` : null,
      applications: job.applications
    }));

    res.status(200).json({
      message: 'Applications fetched successfully',
      jobPosts: jobPosts
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Error fetching applications' });
  }
});

// 2. PUT /api/employer/applications/:applicationId/status - Update application status
router.put('/applications/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const applicationsCollection = db.collection('job_applications');
    const notificationsCollection = db.collection('employer_notifications');
    const companiesCollection = db.collection('Companies');

    // Validate status
    const validStatuses = ['Applied', 'Under Review', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided' });
    }

    console.log(`Updating application ${applicationId} status to: ${status}`);

    // Find the application first
    const application = await applicationsCollection.findOne({
      _id: new ObjectId(applicationId),
      employerId: new ObjectId(employerId)
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }


     // --- Get companyId from application ---
    const companyId = application.employerId; // Make sure this field exists in your application doc

    if (!companyId) {
      return res.status(400).json({ error: 'Company ID not found in application' });
    }

    // --- Fetch company details ---
    const company = await companiesCollection.findOne({ _id: new ObjectId(companyId) });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    // Update application status
    const updateResult = await applicationsCollection.updateOne(
      { _id: new ObjectId(applicationId) },
      {
        $set: {
          status: status,
          updatedAt: new Date()
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Create notification message
    let notificationMessage = '';
    switch(status) {
      case 'Accepted':
        notificationMessage = `Great news! Your application for **${application.jobDetails.title}** has been accepted. The employer will contact you soon for next steps.`;
        break;
      case 'Under Review':
        notificationMessage = `Your application for **${application.jobDetails.title}** is now under review. We'll update you on the progress soon.`;
        break;
      case 'Rejected':
        notificationMessage = `Thank you for your interest. Unfortunately, your application for **${application.jobDetails.title}** was not selected this time.`;
        break;
      default:
        notificationMessage = `Your application status for **${application.jobDetails.title}** has been updated to ${status}.`;
    }

    // Create notification for job seeker
    const notification = {
      jobSeekerId: application.jobSeekerId,
      employerId: new ObjectId(employerId),
      applicationId: new ObjectId(applicationId),
      jobId: application.jobId,
      message: notificationMessage,
      type: 'status_update',
      status: status,
      jobTitle: application.jobDetails.title,
      companyName: company.companyName, // From Companies collection
      companyImage: company.companyImage, // From Companies collection
      
      isRead: false,
      createdAt: new Date()
    };

    await notificationsCollection.insertOne(notification);

    console.log(`Notification created for job seeker: ${application.jobSeekerId}`);

    res.status(200).json({
      message: 'Application status updated successfully',
      status: status,
      notificationSent: true
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Error updating application status' });
  }
});

// 3. PUT /api/employer/applications/:applicationId/notes - Add/Update notes
router.put('/applications/:applicationId/notes', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { notes } = req.body;
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const applicationsCollection = db.collection('job_applications');

    console.log(`Updating notes for application: ${applicationId}`);

    // Update application notes
    const updateResult = await applicationsCollection.updateOne(
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

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }

    res.status(200).json({
      message: 'Application notes updated successfully',
      notes: notes
    });

  } catch (error) {
    console.error('Error updating application notes:', error);
    res.status(500).json({ error: 'Error updating application notes' });
  }
});

// 4. GET /api/employer/notifications - Get notifications created by employer actions (optional for tracking)
router.get('/notifications', async (req, res) => {
  try {
    const employerId = req.user.userId;
    const db = req.app.locals.db;
    const notificationsCollection = db.collection('employer_notifications');

    console.log(`Fetching notifications created by employer: ${employerId}`);

    const notifications = await notificationsCollection.find({
      employerId: new ObjectId(employerId)
    }).sort({ createdAt: -1 }).limit(50).toArray();

    res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications: notifications
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

// 5. GET /api/employer/applications/search - Search applications (bonus feature)
router.get('/applications/search', async (req, res) => {
  try {
    const employerId = req.user.userId;
    const { jobId, status, search, dateFrom, dateTo } = req.query;
    const db = req.app.locals.db;
    const applicationsCollection = db.collection('job_applications');

    let filter = { employerId: new ObjectId(employerId) };

    // Add filters
    if (jobId && jobId !== 'All') {
      filter.jobId = new ObjectId(jobId);
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { 'jobSeekerProfile.fullName': { $regex: search, $options: 'i' } },
        { 'jobDetails.title': { $regex: search, $options: 'i' } }
      ];
    }

    if (dateFrom || dateTo) {
      filter.appliedAt = {};
      if (dateFrom) filter.appliedAt.$gte = new Date(dateFrom);
      if (dateTo) filter.appliedAt.$lte = new Date(dateTo);
    }

    const applications = await applicationsCollection.find(filter)
      .sort({ appliedAt: -1 })
      .toArray();

    res.status(200).json({
      message: 'Search results fetched successfully',
      applications: applications,
      count: applications.length
    });

  } catch (error) {
    console.error('Error searching applications:', error);
    res.status(500).json({ error: 'Error searching applications' });
  }
});

module.exports = router;