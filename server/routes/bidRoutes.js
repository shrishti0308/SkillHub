const express = require('express');
const router = express.Router();
const { placeBid, getBidsForJob, acceptBid } = require('../controllers/bidController');

// Place a bid on a job
router.post('/place', placeBid);

// Get all bids for a job
router.get('/:jobId', getBidsForJob);

// Accept a bid (employer)
router.put('/accept/:bidId', acceptBid);

module.exports = router;
