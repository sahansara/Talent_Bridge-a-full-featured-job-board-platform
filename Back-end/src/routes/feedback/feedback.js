const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const {
  getFeedbackCollection,
    handleError,
    validateRequiredFields,
    validateFeedbackFields,
    processFeedback,
    getFeedbackFilter,
    getFeedbackProjection
} = require('./subFunction');

// Submit user feedback
router.post('/submit', async (req, res) => {
    try {
       
        if (!validateRequiredFields(req.body, res)) return;
    
        
        if (!validateFeedbackFields(req.body, res)) return;
    
        
        const db = req.app.locals.db;
        const feedbackCollection = getFeedbackCollection(db);
    
        
        const result = await processFeedback(req.body, feedbackCollection);
    
        
        res.status(201).json({ 
        message: 'Feedback submitted successfully', 
        result 
        });
    
    } catch (err) {
        
        handleError(res, err, 'submitting feedback');
    }
    });
    
router.get('/all', async (req, res) => {
    try { 
        const db = req.app.locals.db;
        const feedbackCollection = getFeedbackCollection(db);
    
        
        const feedbacks = await getFeedbackFilter(feedbackCollection);
    
        
        res.status(200).json(feedbacks);
    
    } catch (err) {
       
        handleError(res, err, 'fetching feedbacks');
    }           
});


module.exports = router;