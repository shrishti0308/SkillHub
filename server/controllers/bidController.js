const Bid = require('../models/bid');
const mongoose = require('mongoose');
const Job = require('../models/job') 


// Place a new bid
const placeBid = async (req, res) => {
    try {
        const { amount, jobId } = req.body;
        const freelancer = req.user._id; // Assuming authenticated user

        const newBid = new Bid({
            amount,
            job: jobId,
            freelancer,
        });

        await newBid.save();
        res.status(201).json(newBid);
    } catch (error) {
        res.status(500).json({ error: 'Error placing bid' });
    }
};

// Get all bids for a specific job
const getBidsForJob = async (req, res) => {
    try {
        const bids = await Bid.find({ job: req.params.jobId }).populate('freelancer');
        res.status(200).json(bids);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching bids' });
    }
};

// Accept a bid
const acceptBid = async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.bidId);
        if (!bid) {
            return res.status(404).json({ error: 'Bid not found' });
        }

        // Update job status and freelancer
        const job = await Job.findById(bid.job);
        job.freelancer = bid.freelancer;
        job.status = 'in-progress';
        job.bidAccepted = true;

        await job.save();
        res.status(200).json({ message: 'Bid accepted', job });
    } catch (error) {
        res.status(500).json({ error: 'Error accepting bid' });
    }
};

const getRecentBids = async (req, res) => {
  try {
    const freelancerId = req.user.id; 

    const freelancerObjectId = new mongoose.Types.ObjectId(freelancerId);

    const recentBids = await Bid.find({ freelancer: freelancerObjectId }); 

    if (!recentBids.length) {
      return res.status(404).json({ message: 'No recent bids found for this user' });
    }

    res.status(200).json({ recentBids });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recent bids', error: error.message });
  }
};


// Controller to get bid details by ID
const getBidDetails = async (req, res) => {
    try {
        const { bidId } = req.params;
        
        // Fetch bid details from DB
        const bid = await Bid.findById(bidId)
            .populate('freelancer', 'name username') // Populate freelancer info
            .populate('job', 'title'); // Populate job info
            
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        res.status(200).json({ bid });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    placeBid,
    getBidsForJob,
    acceptBid,
    getRecentBids,
    getBidDetails
};
