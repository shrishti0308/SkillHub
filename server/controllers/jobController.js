const Job = require("../models/job");
const Bid = require("../models/bid");
const Notification = require("../models/notification");
const User = require("../models/user");
const {
  apiSuccess,
  apiError,
  apiNotFound,
  apiBadRequest,
} = require("../middleware/response");

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
      role: "freelancer",
      skills: { $in: skillsRequired },
    });

    // Create notifications for matching freelancers
    const notifications = matchingFreelancers.map((freelancer) => ({
      recipient: freelancer._id,
      type: "job",
      title: "New Job Matching Your Skills",
      message: `New job posted: ${title} - Budget: $${budget}`,
      relatedId: newJob._id,
      onModel: "Job",
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    apiSuccess(res, "Job created successfully", { job: newJob });
  } catch (error) {
    apiError(res, "Error creating job", error);
  }
};

// Get jobs for marketplace
const getMarketplaceJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" });
    apiSuccess(res, "Jobs fetched successfully", { jobs });
  } catch (error) {
    apiError(res, "Error fetching jobs", error);
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer freelancer"
    );
    if (!job) {
      return apiNotFound(res, "Job not found");
    }
    apiSuccess(res, "Job fetched successfully", { job });
  } catch (error) {
    apiError(res, "Error fetching job", error);
  }
};

// Update job status
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return apiNotFound(res, "Job not found");
    }
    job.status = req.body.status || job.status;
    await job.save();
    apiSuccess(res, "Job updated successfully", { job });
  } catch (error) {
    apiError(res, "Error updating job", error);
  }
};

// Get filtered jobs
const getFilteredJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let filter = { status: "open" };

    if (userRole === "freelancer" || userRole === "hybrid") {
      filter.employer = { $ne: userId };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    apiSuccess(res, "Jobs fetched successfully", { jobs });
  } catch (error) {
    apiError(res, "Error retrieving jobs", error);
  }
};

// Get job by ID with auth check
const getJobByIdAuthCheck = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate("employer freelancer");

    if (!job) {
      return apiNotFound(res, "Job not found");
    }

    apiSuccess(res, "Job fetched successfully", { job });
  } catch (error) {
    apiError(res, "Error retrieving job", error);
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
      return apiNotFound(res, "Job not found");
    }

    if (job.status !== "open") {
      return apiBadRequest(res, "Job is not open for bids");
    }

    const newBid = new Bid({
      amount,
      job: jobId,
      freelancer: freelancerId,
    });

    await newBid.save();
    apiSuccess(res, "Bid placed successfully", { bid: newBid });
  } catch (error) {
    apiError(res, "Error placing bid", error);
  }
};

// Get all jobs posted by a specific user
const getJobsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const jobs = await Job.find({ employer: userId })
      .populate("employer", "name username email")
      .populate("freelancer", "name username email")
      .sort({ createdAt: -1 });

    apiSuccess(res, "User's jobs fetched successfully", {
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    apiError(res, "Error fetching user's jobs", error);
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
};
