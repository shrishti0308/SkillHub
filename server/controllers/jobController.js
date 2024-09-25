const Job = require('../models/job');

exports.getFilteredJobs = async (req, res) => {
    try {
        const userId = req.user._id;  
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
