const Job = require('../models/job');
const Bid = require('../models/bid');

// Get recent jobs
exports.getFilteredJobs = async (req, res) => {
    try {
        const userId = req.user.id;  
        const userRole = req.user.role; 

        let filter = { status: 'open' };  

        if (userRole === 'freelancer' || userRole === 'hybrid') {
            filter.employer = { $ne: userId };  
        }

        const jobs = await Job.find(filter).sort({ createdAt: -1 });

        res.status(200).json({ jobs });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving jobs', error: err.message });
    }
};

// Get a particular job by ID
exports.getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id).populate('employer freelancer');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ job });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving job', error: err.message });
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
  
  