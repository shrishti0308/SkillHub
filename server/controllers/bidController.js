const Bid = require('../models/bid');
const mongoose = require('mongoose'); 

exports.getRecentBids = async (req, res) => {
  try {
    const freelancerId = req.user.id; 
    console.log('Freelancer ID from token:', freelancerId);

    const freelancerObjectId = new mongoose.Types.ObjectId(freelancerId);

    const recentBids = await Bid.find({ freelancer: freelancerObjectId }); 

    console.log('Recent bids found:', recentBids);

    if (!recentBids.length) {
      return res.status(404).json({ message: 'No recent bids found for this user' });
    }

    res.status(200).json({ recentBids });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recent bids', error: error.message });
  }
};
