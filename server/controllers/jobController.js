const Job = require('../models/job');
const Bid = require('../models/bid');


// Create a new job
const createJob = async (req, res) => {
    try {
        const { title, description, budget, categories, skillsRequired } = req.body;
        const employer = req.user._id;

        const newJob = new Job({
            title,
            description,
            budget,
            employer,
            categories,
            skillsRequired,
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ error: 'Error creating job' });
    }
};


// Get jobs for marketplace
const getMarketplaceJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'open' }); // Fetch only open jobs
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching jobs' });
    }
};

// Get job by ID
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employer freelancer');
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching job' });
    }
};

// Update job status
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        job.status = req.body.status || job.status;
        await job.save();
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: 'Error updating job' });
    }
};

module.exports = {
    createJob,
    getMarketplaceJobs,
    getJobById,
    updateJob,
};

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
  
  