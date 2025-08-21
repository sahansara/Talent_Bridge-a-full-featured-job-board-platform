const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const {COLLECTIONS , STATUS_CODES,MESSAGES} = require ( '../../config/constants');



// Get all Employers (admin only)
router.get('/Company', async (req, res) => {
  try {
    console.log('Admin fetching all Employers');
    
    

    const db = req.app.locals.db;
    const collection = db.collection(COLLECTIONS.ROLE.EMPLOYER);

    // Fetch all Employers but exclude sensitive fields
    const employer = await collection.find(
      { role: 'employer' }, 
      {
        projection: {
          _id: 1,
          employerName: 1,
          email: 1,
          contactNumber: 1,
          employerWebsite: 1,
          role: 1,
          createdAt: 1
          // Exclude password, cv_Upload, and image fields
        }
      }
    ).sort({ createdAt: -1 }).toArray(); // Sort by newest first

    console.log(`Found ${employer.length} Employers`);
    
    res.status(STATUS_CODES.SUCCESS).json(employer);
    
  } catch (error) {
    console.error('Error fetching Employers:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch Employers' });
  }
});

// Delete employer (admin only)
router.delete('/Company/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Admin attempting to delete employer with ID: ${id}`);
    
   

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid employer ID' });
    }

    const db = req.app.locals.db;
    const collection = db.collection(COLLECTIONS.ROLE.EMPLOYER);

    // First check if the employer exists       
    const existingemployer = await collection.findOne({ 
      _id: new ObjectId(id),
      role: 'employer' 
    });

    if (!existingemployer) {
      return res.status(404).json({ error: ' employer not found' });
    }

    // Delete the employer
    const result = await collection.deleteOne({ 
      _id: new ObjectId(id),
      role: 'employer' 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'employer not found or already deleted' });
    }

    console.log(`employer deleted successfully: ${existingemployer.employerName} (${existingemployer.email})`);
    
    res.status(200).json({ 
      message: 'employer deleted successfully',
      deletedUser: {
        _id: existingemployer._id,
        employerName: existingemployer.employerName,
        email: existingemployer.email
      }
    });
    
  } catch (error) {
    console.error('Error deleting employer:', error);
    res.status(500).json({ error: 'Failed to delete employer' });
  }
});

module.exports = router;