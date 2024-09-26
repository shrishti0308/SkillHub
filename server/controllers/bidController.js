const Bid = require('../models/bid');
const Job = require('../models/job');

// Controller to get recent bids of the logged-in user for recent jobs
exports.getRecentBids = async (req, res) => {
  try {
    const freelancerId = req.user._id; // Get the logged-in user's ID from JWT token
    const recentBids = await Bid.find({ freelancer: freelancerId })
      .populate('job') // Populate job details
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(10); // Limit to recent 10 bids (you can adjust this)

    if (!recentBids.length) {
      return res.status(404).json({ message: 'No recent bids found for this user' });
    }

    res.status(200).json({ recentBids });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recent bids', error: error.message });
  }
};
