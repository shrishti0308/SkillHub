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

module.exports = router;
