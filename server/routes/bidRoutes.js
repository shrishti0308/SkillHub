const express = require('express');
const router = express.Router();
const { placeBid, getBidsForJob, acceptBid } = require('../controllers/bidController');

// Place a bid on a job
router.post('/place', placeBid);

// Get all bids for a job
router.get('/:jobId', getBidsForJob);

// Accept a bid (employer)
router.put('/accept/:bidId', acceptBid);

const bidController = require('../controllers/bidController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

router.get('/recent-bids', authenticateJWT, bidController.getRecentBids);

// Route to get details of a specific bid (including all bids for the job)
router.get('/:bidId/details',authenticateJWT, bidController.getBidDetails);

module.exports = router;




