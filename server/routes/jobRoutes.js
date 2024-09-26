const express = require('express');
const router = express.Router();
const { createJob, getMarketplaceJobs, getJobById, updateJob ,getFilteredJobs, getJobByIdAuthCheck, createBid} = require('../controllers/jobController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Create a job (employer)
router.post('/create', createJob);

// Get all jobs for marketplace
router.get('/marketplace', getMarketplaceJobs);

// Get a specific job by ID
router.get('/:id', getJobById);

// Update job status (e.g., when the job is completed)
router.put('/:id', updateJob);

// Route to get filtered jobs
router.get('/jobs', authenticateJWT, getFilteredJobs);

// Route to get a specific job by ID
router.get('/user/:id', authenticateJWT, getJobByIdAuthCheck);

// Route to place a bid on a job
router.post('/:jobId/bid', authenticateJWT, createBid);

module.exports = router;
