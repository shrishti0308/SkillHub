const express = require('express');
const bidController = require('../controllers/bidController');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.get('/recent-bids', authenticateJWT, bidController.getRecentBids);

// Route to get details of a specific bid (including all bids for the job)
router.get('/:bidId/details',authenticateJWT, bidController.getBidDetails);

// // Route to get all bids for a specific job
// router.get('/job/:jobId/bids',authenticateJWT, bidController.getAllBidsForJob);

module.exports = router;




