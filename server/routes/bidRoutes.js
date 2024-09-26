const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// GET recent bids of the logged-in user
router.get('/recent-bids', authenticateJWT, bidController.getRecentBids);
// Route to place a bid on a job
router.post('/:jobId/bid', authenticateJWT, bidController.createBid);

module.exports = router;



