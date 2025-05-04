const Job = require("../models/job");
const Bid = require("../models/bid");
const Notification = require("../models/notification");
const User = require("../models/user");
const solrService = require('../services/solrService');

// Create a new job
const createJob = async (req, res) => {
  try {
    const { title, description, budget, categories, skillsRequired } = req.body;
    const employer = req.user.id;

    const newJob = new Job({
      title,
      description,
      budget,
      employer,
      categories,
      skillsRequired,
    });

    await newJob.save();

    // Find freelancers with matching skills and notify them
    const matchingFreelancers = await User.find({
      role: 'freelancer',
      skills: { $in: skillsRequired }
    });

    // Create notifications for matching freelancers
    const notifications = matchingFreelancers.map(freelancer => ({
      recipient: freelancer._id,
      type: 'job',
      title: 'New Job Matching Your Skills',
      message: `New job posted: ${title} - Budget: $${budget}`,
      relatedId: newJob._id,
      onModel: 'Job'
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json(newJob);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating job" });
  }
};

// Get jobs for marketplace
const getMarketplaceJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" }); // Fetch only open jobs
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching jobs" });
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer freelancer"
    );
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job" });
  }
};

// Update job status
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    job.status = req.body.status || job.status;
    await job.save();
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: "Error updating job" });
  }
};

// Get recent jobs
const getFilteredJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let filter = { status: "open" };

    if (userRole === "freelancer" || userRole === "hybrid") {
      filter.employer = { $ne: userId };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ jobs });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving jobs", error: err.message });
  }
};

// Get a particular job by ID
const getJobByIdAuthCheck = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate("employer freelancer");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ job });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving job", error: err.message });
  }
};

// Place a bid on a job
const createBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const { jobId } = req.params;
    const freelancerId = req.user.id;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status !== "open") {
      return res.status(400).json({ message: "Job is not open for bids" });
    }

    const newBid = new Bid({
      amount,
      job: jobId,
      freelancer: freelancerId,
    });

    await newBid.save();

    res.status(201).json({ message: "Bid placed successfully", bid: newBid });
  } catch (err) {
    res.status(500).json({ message: "Error placing bid", error: err.message });
  }
};

// Get all jobs posted by a specific user
const getJobsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const jobs = await Job.find({ employer: userId })
      .populate('employer', 'name username email')
      .populate('freelancer', 'name username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user's jobs",
      error: error.message,
    });
  }
};

// Search jobs with Solr
const searchJobsSolr = async (req, res) => {
  try {
    const { query, status, categories, skills, minBudget, maxBudget, limit, page, sort } = req.query;
    
    // Build filters object
    const filters = {};
    if (status) filters.status = status;
    if (categories) {
      const categoriesArray = Array.isArray(categories) ? categories : categories.split(',');
      filters.categories = categoriesArray;
    }
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
      filters.skillsRequired = skillsArray;
    }
    if (minBudget) filters['budget_min:[' + parseInt(minBudget) + ' TO *]'] = '';
    if (maxBudget) filters['budget_max:[* TO ' + parseInt(maxBudget) + ']'] = '';
    
    // Calculate pagination
    const start = page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 10) : 0;
    
    const searchOptions = {
      start,
      limit: limit ? parseInt(limit) : 10,
      filters,
      sort: sort || 'createdAt desc'
    };
    
    const result = await solrService.searchJobs(query || '*:*', searchOptions);
    
    res.status(200).json({
      success: true,
      count: result.numFound,
      jobs: result.docs
    });
  } catch (error) {
    console.error('Error searching jobs with Solr:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching jobs',
      error: error.message
    });
  }
};

module.exports = {
  createJob,
  getMarketplaceJobs,
  getJobById,
  updateJob,
  getFilteredJobs,
  getJobByIdAuthCheck,
  createBid,
  getJobsByUserId,
  searchJobsSolr
};
