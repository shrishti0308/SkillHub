const express = require('express');
const router = express.Router();
const { createJob, getMarketplaceJobs, getJobById, updateJob } = require('../controllers/jobController');

// Create a job (employer)
router.post('/create', createJob);

// Get all jobs for marketplace
router.get('/marketplace', getMarketplaceJobs);

// Get a specific job by ID
router.get('/:id', getJobById);

// Update job status (e.g., when the job is completed)
router.put('/:id', updateJob);

const { authenticateJWT } = require('../middlewares/authMiddleware');
const jobController = require('../controllers/jobController');

// Route to get filtered jobs
router.get('/jobs', authenticateJWT, jobController.getFilteredJobs);

// Route to get a specific job by ID
router.get('/:id', authenticateJWT, jobController.getJobById);

// Route to place a bid on a job
router.post('/:jobId/bid', authenticateJWT, jobController.createBid);

module.exports = router;
