const Bid = require("../models/bid");
const mongoose = require("mongoose");
const Job = require("../models/job");
const Notification = require("../models/notification");

// Place a new bid
const placeBid = async (req, res) => {
  try {
    const { amount, jobId } = req.body;
    const freelancer = req.user.id;
    console.log(jobId);

    const newBid = new Bid({
      amount,
      job: jobId,
      freelancer,
    });

    await newBid.save();
    
    // Get job details to notify the job owner
    const job = await Job.findById(jobId);
    if (job) {
      // Create notification for job owner
      const notification = new Notification({
        recipient: job.employer,
        type: 'bid',
        title: 'New Bid Received',
        message: `A new bid of $${amount} has been placed on your job`,
        relatedId: newBid._id,
        onModel: 'Bid'
      });
      await notification.save();
    }

    res.status(201).json(newBid);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error placing bid" });
  }
};

// Get all bids for a specific job
const getBidsForJob = async (req, res) => {
  try {
    const bids = await Bid.find({ job: req.params.jobId }).populate(
      "freelancer"
    );
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bids" });
  }
};

const acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) {
      return res.status(404).json({ error: "Bid not found" });
    }

    // Find the job associated with the bid
    const job = await Job.findById(bid.job);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if the user trying to accept the bid is the job poster
    const currentUserId = req.user.id;
    if (job.employer.toString() !== currentUserId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to accept this bid." });
    }

    // Update the accepted bid's status
    bid.status = "accepted";
    await bid.save();

    // Update job details
    job.freelancer = bid.freelancer;
    job.status = "in-progress";
    job.bidAccepted = true;

    // Reject all other bids for this job
    await Bid.updateMany(
      { job: job._id, _id: { $ne: bid._id } }, // Find bids for this job, excluding the accepted bid
      { status: "rejected" } // Update their status to 'rejected'
    );

    // Create notification for the freelancer
    const notification = new Notification({
      recipient: bid.freelancer,
      type: 'job_award',
      title: 'Bid Accepted',
      message: `Your bid has been accepted for the job: ${job.title}`,
      relatedId: job._id,
      onModel: 'Job'
    });
    await notification.save();

    await job.save();
    res.status(200).json({ message: "Bid accepted", job });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error accepting bid" });
  }
};

const getRecentBids = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const freelancerObjectId = new mongoose.Types.ObjectId(freelancerId);

    const recentBids = await Bid.find({ freelancer: freelancerObjectId })
      .populate('job') // Populate job details
      .sort({ createdAt: -1 }); // Sort by most recent first

    if (!recentBids.length) {
      return res
        .status(404)
        .json({ message: "No recent bids found for this user" });
    }

    res.status(200).json({ recentBids });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving recent bids", error: error.message });
  }
};

// Controller to get bid details by ID
const getBidDetails = async (req, res) => {
  try {
    const { bidId } = req.params;

    // Fetch bid details from DB
    const bid = await Bid.findById(bidId)
      .populate("freelancer", "name username") // Populate freelancer info
      .populate("job", "title"); // Populate job info

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    res.status(200).json({ bid });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a specific bid by ID
const getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId)
      .populate('freelancer', 'name username email')
      .populate('job');

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bid',
      error: error.message,
    });
  }
};

// Get all bids by a specific user
const getBidsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bids = await Bid.find({ freelancer: userId })
      .populate('job')
      .populate('freelancer', 'name username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user's bids",
      error: error.message,
    });
  }
};

module.exports = {
  placeBid,
  getBidsForJob,
  acceptBid,
  getRecentBids,
  getBidDetails,
  getBidById,
  getBidsByUserId,
};
