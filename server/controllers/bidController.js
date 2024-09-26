const Bid = require('../models/bid');
const User = require('../models/user');
const mongoose = require('mongoose'); 

exports.getRecentBids = async (req, res) => {
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

// // Controller to get all bids for a specific job (for comparison)
// exports.getAllBidsForJob = async (req, res) => {
//     const { jobId } = req.params;
//     try {
//         const bids = await Bid.find({ job: jobId }).populate('freelancer', 'name').exec();

//         if (!bids.length) {
//             return res.status(404).json({ success: false, message: 'No bids found for this job' });
//         }

//         res.status(200).json({ success: true, bids });
//     } catch (error) {
//         console.error('Error fetching bids for job:', error);
//         res.status(500).json({ success: false, message: 'Error fetching bids for job', error });
//     }
// };

