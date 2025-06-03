const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Get all job seekers (admin only)
router.get('/jobseekers', async (req, res) => {
  try {
    console.log('Admin fetching all job seekers');
    
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const db = req.app.locals.db;
    const collection = db.collection('seek_employees');

    // Fetch all job seekers but exclude sensitive fields
    const jobSeekers = await collection.find(
      { role: 'jobseeker' }, // Filter only job seekers
      {
        projection: {
          _id: 1,
          fullName: 1,
          email: 1,
          role: 1,
          createdAt: 1
          // Exclude password, cv_Upload, and image fields
        }
      }
    ).sort({ createdAt: -1 }).toArray(); // Sort by newest first

    console.log(`Found ${jobSeekers.length} job seekers`);
    
    res.status(200).json(jobSeekers);
    
  } catch (error) {
    console.error('Error fetching job seekers:', error);
    res.status(500).json({ error: 'Failed to fetch job seekers' });
  }
});

// Get single job seeker by ID (admin only)
router.get('/jobseekers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Admin fetching job seeker with ID: ${id}`);
    
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid job seeker ID' });
    }

    const db = req.app.locals.db;
    const collection = db.collection('seek_employees');

    const jobSeeker = await collection.findOne(
      { 
        _id: new ObjectId(id),
        role: 'jobseeker' 
      },
      {
        projection: {
          _id: 1,
          fullName: 1,
          email: 1,
          role: 1,
          createdAt: 1
          // Exclude sensitive fields
        }
      }
    );

    if (!jobSeeker) {
      return res.status(404).json({ error: 'Job seeker not found' });
    }

    console.log(`Job seeker found: ${jobSeeker.fullName}`);
    res.status(200).json(jobSeeker);
    
  } catch (error) {
    console.error('Error fetching job seeker:', error);
    res.status(500).json({ error: 'Failed to fetch job seeker' });
  }
});

// Delete job seeker (admin only)
router.delete('/jobseekers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Admin attempting to delete job seeker with ID: ${id}`);
    
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid job seeker ID' });
    }

    const db = req.app.locals.db;
    const collection = db.collection('seek_employees');

    // First check if the job seeker exists
    const existingJobSeeker = await collection.findOne({ 
      _id: new ObjectId(id),
      role: 'jobseeker' 
    });

    if (!existingJobSeeker) {
      return res.status(404).json({ error: 'Job ser not found' });
    }

    // Delete the job seeker
    const result = await collection.deleteOne({ 
      _id: new ObjectId(id),
      role: 'jobseeker' 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Job seeker not found or already deleted' });
    }

    console.log(`Job seeker deleted successfully: ${existingJobSeeker.fullName} (${existingJobSeeker.email})`);
    
    res.status(200).json({ 
      message: 'Job seeker deleted successfully',
      deletedUser: {
        _id: existingJobSeeker._id,
        fullName: existingJobSeeker.fullName,
        email: existingJobSeeker.email
      }
    });
    
  } catch (error) {
    console.error('Error deleting job seeker:', error);
    res.status(500).json({ error: 'Failed to delete job seeker' });
  }
});

// Get job seekers statistics (admin only)
router.get('/jobseekers/stats/overview', async (req, res) => {
  try {
    console.log('Admin fetching job seekers statistics');
    
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const db = req.app.locals.db;
    const collection = db.collection('seek_employees');

    // Get total count
    const totalJobSeekers = await collection.countDocuments({ role: 'jobseeker' });

    // Get count for this month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const thisMonthJobSeekers = await collection.countDocuments({
      role: 'jobseeker',
      createdAt: { $gte: startOfMonth }
    });

    // Get count for this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const thisWeekJobSeekers = await collection.countDocuments({
      role: 'jobseeker',
      createdAt: { $gte: startOfWeek }
    });

    // Get recent registrations (last 5)
    const recentJobSeekers = await collection.find(
      { role: 'jobseeker' },
      {
        projection: {
          _id: 1,
          fullName: 1,
          email: 1,
          createdAt: 1
        }
      }
    ).sort({ createdAt: -1 }).limit(5).toArray();

    const stats = {
      total: totalJobSeekers,
      thisMonth: thisMonthJobSeekers,
      thisWeek: thisWeekJobSeekers,
      recent: recentJobSeekers
    };

    console.log('Job seekers statistics:', stats);
    res.status(200).json(stats);
    
  } catch (error) {
    console.error('Error fetching job seekers statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Search job seekers (admin only)
router.get('/jobseekers/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    console.log(`Admin searching job seekers with query: ${query}`);
    
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const db = req.app.locals.db;
    const collection = db.collection('seek_employees');

    // Search by name or email (case insensitive)
    const searchRegex = new RegExp(query.trim(), 'i');
    
    const jobSeekers = await collection.find(
      {
        role: 'jobseeker',
        $or: [
          { fullName: { $regex: searchRegex } },
          { email: { $regex: searchRegex } }
        ]
      },
      {
        projection: {
          _id: 1,
          fullName: 1,
          email: 1,
          role: 1,
          createdAt: 1
        }
      }
    ).sort({ createdAt: -1 }).toArray();

    console.log(`Found ${jobSeekers.length} job seekers matching query: ${query}`);
    res.status(200).json(jobSeekers);
    
  } catch (error) {
    console.error('Error searching job seekers:', error);
    res.status(500).json({ error: 'Failed to search job seekers' });
  }
});

// Bulk delete job seekers (admin only)
router.post('/jobseekers/bulk-delete', async (req, res) => {
  try {
    const { userIds } = req.body;
    console.log(`Admin attempting bulk delete for IDs: ${userIds}`);
    
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'User IDs array is required' });
    }

    // Validate all ObjectIds
    const invalidIds = userIds.filter(id => !ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ error: `Invalid user IDs: ${invalidIds.join(', ')}` });
    }

    const db = req.app.locals.db;
    const collection = db.collection('seek_employees');

    // Convert string IDs to ObjectIds
    const objectIds = userIds.map(id => new ObjectId(id));

    // Delete multiple job seekers
    const result = await collection.deleteMany({
      _id: { $in: objectIds },
      role: 'jobseeker'
    });

    console.log(`Bulk delete completed. Deleted ${result.deletedCount} job seekers`);
    
    res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} job seeker(s)`,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error('Error in bulk delete:', error);
    res.status(500).json({ error: 'Failed to delete job seekers' });
  }
});

module.exports = router;