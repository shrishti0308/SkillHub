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
// Place a bid on a job
exports.createBid = async (req, res) => {
  try {
      const { amount } = req.body;
      const { jobId } = req.params;
      const freelancerId = req.user.id; 

      const job = await Job.findById(jobId);

      if (!job) {
          return res.status(404).json({ message: 'Job not found' });
      }

      if (job.status !== 'open') {
          return res.status(400).json({ message: 'Job is not open for bids' });
      }

      const newBid = new Bid({
          amount,
          job: jobId,
          freelancer: freelancerId,
      });

      await newBid.save();

      res.status(201).json({ message: 'Bid placed successfully', bid: newBid });
  } catch (err) {
      res.status(500).json({ message: 'Error placing bid', error: err.message });
  }
};

