const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Get all Employers (admin only)
router.get('/Employers', async (req, res) => {
  try {
    console.log('Admin fetching all Employers');
    
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const db = req.app.locals.db;
    const collection = db.collection('Companies');

    // Fetch all Employers but exclude sensitive fields
    const Company = await collection.find(
      { role: 'Company' }, 
      {
        projection: {
          _id: 1,
          companyName: 1,
          email: 1,
          contactNumber: 1,
          companyWebsite: 1,
          role: 1,
          createdAt: 1
          // Exclude password, cv_Upload, and image fields
        }
      }
    ).sort({ createdAt: -1 }).toArray(); // Sort by newest first

    console.log(`Found ${Company.length} Employers`);
    
    res.status(200).json(Company);
    
  } catch (error) {
    console.error('Error fetching Employers:', error);
    res.status(500).json({ error: 'Failed to fetch Employers' });
  }
});

// Delete Company (admin only)
router.delete('/Company/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Admin attempting to delete Company with ID: ${id}`);
    
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Company ID' });
    }

    const db = req.app.locals.db;
    const collection = db.collection('Companies');

    // First check if the Company exists
    const existingCompany = await collection.findOne({ 
      _id: new ObjectId(id),
      role: 'Company' 
    });

    if (!existingCompany) {
      return res.status(404).json({ error: ' Company not found' });
    }

    // Delete the Company
    const result = await collection.deleteOne({ 
      _id: new ObjectId(id),
      role: 'Company' 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Company not found or already deleted' });
    }

    console.log(`Company deleted successfully: ${existingCompany.companyName} (${existingCompany.email})`);
    
    res.status(200).json({ 
      message: 'Company deleted successfully',
      deletedUser: {
        _id: existingCompany._id,
        companyName: existingCompany.companyName,
        email: existingCompany.email
      }
    });
    
  } catch (error) {
    console.error('Error deleting Company:', error);
    res.status(500).json({ error: 'Failed to delete Company' });
  }
});

module.exports = router;