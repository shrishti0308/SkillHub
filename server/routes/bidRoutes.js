const express = require('express');
const router = express.Router();
const { placeBid, getBidsForJob, acceptBid } = require('../controllers/bidController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Place a bid on a job
router.post('/place', authenticateJWT, placeBid);

// Get all bids for a job
router.get('/:jobId', getBidsForJob);

// Accept a bid (employer)
router.put('/accept/:bidId', authenticateJWT, acceptBid);

const bidController = require('../controllers/bidController');

router.get('/recent-bids', authenticateJWT, bidController.getRecentBids);

// Route to get details of a specific bid (including all bids for the job)
router.get('/:bidId/details', authenticateJWT, bidController.getBidDetails);

module.exports = router;




