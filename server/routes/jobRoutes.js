const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');
const jobController = require('../controllers/jobController');

// Route to get filtered jobs
router.get('/jobs', authenticateJWT, jobController.getFilteredJobs);

// Route to get a specific job by ID
router.get('/:id', authenticateJWT, jobController.getJobById);

// Route to place a bid on a job
router.post('/:jobId/bid', authenticateJWT, jobController.createBid);

module.exports = router;
