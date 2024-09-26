const Bid = require('../models/bid');
const Job = require('../models/job');

// Place a new bid
const placeBid = async (req, res) => {
    try {
        const { amount, jobId } = req.body;
        const freelancer = req.user.id;
        console.log(jobId)

        const newBid = new Bid({
            amount,
            job: jobId,
            freelancer,
        });

        await newBid.save();
        res.status(201).json(newBid);
    } catch (error) {
        console.log(error)
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

module.exports = {
    placeBid,
    getBidsForJob,
    acceptBid,
};
