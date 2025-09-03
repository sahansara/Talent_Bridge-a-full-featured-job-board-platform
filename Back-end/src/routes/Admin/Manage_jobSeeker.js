const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getJobSeekersCollection, 
  getJobSeekerProjection,
  getJobSeekerFilter,
  handleError,
  logOperation, 
  validateBulkDeleteRequest } = require('./subFunctions/jobSeeker');
// Get all job seekers 
router.get('/jobseekers', async (req, res) => {
  try {
    logOperation('fetching all job seekers', '');

    const collection = getJobSeekersCollection(req.app.locals.db);

    const jobSeekers = await collection.find(
      getJobSeekerFilter(),
      { projection: getJobSeekerProjection() }
    ).sort({ createdAt: -1 }).toArray();

    logOperation('found job seekers', `${jobSeekers.length} records`);
    res.status(200).json(jobSeekers);
    
  } catch (error) {
    handleError(res, error, 'fetch job seekers');
  }
});

// Get single job seeker 
router.get('/jobseekers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    logOperation('fetching job seeker with ID', id);
    
    
    if (!validateObjectId(id, res)) return;

    const collection = getJobSeekersCollection(req.app.locals.db);

    const jobSeeker = await collection.findOne(
      { ...getJobSeekerFilter(), _id: new ObjectId(id) },
      { projection: getJobSeekerProjection() }
    );

    if (!jobSeeker) {
      return res.status(404).json({ error: 'Job seeker not found' });
    }

    logOperation('job seeker found', jobSeeker.fullName);
    res.status(200).json(jobSeeker);
    
  } catch (error) {
    handleError(res, error, 'fetch job seeker');
  }
});

// Bulk delete job seekers
router.post('/jobseekers/bulk-delete', async (req, res) => {
  try {
    const { userIds } = req.body;
    logOperation('attempting bulk delete for IDs', userIds);
    
    
    if (!validateBulkDeleteRequest(userIds, res)) return;

    const collection = getJobSeekersCollection(req.app.locals.db);
    const objectIds = userIds.map(id => new ObjectId(id));

    const result = await collection.deleteMany({
      ...getJobSeekerFilter(),
      _id: { $in: objectIds }
    });

    logOperation('bulk delete completed', `Deleted ${result.deletedCount} job seekers`);
    
    res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} job seeker(s)`,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    handleError(res, error, 'delete job seekers');
  }
});

module.exports = router;