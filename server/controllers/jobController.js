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

