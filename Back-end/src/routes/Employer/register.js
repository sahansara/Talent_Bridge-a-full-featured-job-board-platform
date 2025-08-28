const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const {
  getEmployerCollection,
  handleError,
  createUploadMiddleware,
  logRegistrationRequest,
  validateEmployerRegistration,
  processEmployerRegistration
} = require('./subFunctions/EMregister'); 


const upload = createUploadMiddleware();

// POST /employer_register - Register new employer
router.post('/register', upload.fields([
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    // Log registration request for debugging
    logRegistrationRequest(req.body);

    // Validate all required fields and formats
    if (!validateEmployerRegistration(req.body, res)) return;

    // Get database collection
    const db = req.app.locals.db;
    const employerCollection = getEmployerCollection(db);

    // Process registration with all validations and data preparation
    const result = await processEmployerRegistration(req.body, req.files, employerCollection);

    // Return success response
    res.status(201).json({ 
      message: 'User registered successfully', 
      result 
    });

  } catch (err) {
    // Handle specific error types
    if (err.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Handle general errors
    handleError(res, err, 'registering user');
  }
});

module.exports = router;