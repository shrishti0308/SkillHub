const Job = require('../models/Job');

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
