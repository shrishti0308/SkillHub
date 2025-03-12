const express = require("express");
const router = express.Router();
const {
  placeBid,
  getBidsForJob,
  acceptBid,
  getRecentBids,
  getBidDetails,
  getBidById,
  getBidsByUserId,
  deleteBid,
} = require("../controllers/bidController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// Public routes (no authentication required)
// Get all bids for a job
router.get("/:jobId", getBidsForJob);

// All routes below this middleware require authentication
router.use(authenticateJWT);

// Protected routes
// Place a bid on a job
router.post("/place", placeBid);

// Accept a bid (employer)
router.put("/accept/:bidId", acceptBid);

// Get recent bids
router.get("/recent/bid", getRecentBids);

// Get a specific bid by ID
router.get("/bid/:bidId", getBidById);

// Get all bids by user ID
router.get("/user/:userId", getBidsByUserId);

// Route to get details of a specific bid (including all bids for the job)
router.get("/:bidId/details", getBidDetails);

// Delete a bid
router.delete("/:bidId", deleteBid);

module.exports = router;
