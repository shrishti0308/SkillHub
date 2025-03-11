const Bid = require("../models/bid");
const mongoose = require("mongoose");
const Job = require("../models/job");
const Notification = require("../models/notification");
const {
  apiSuccess,
  apiError,
  apiNotFound,
  apiBadRequest,
  apiUnauthorized,
  apiForbidden,
} = require("../middleware/response");

// Place a new bid
const placeBid = async (req, res) => {
  try {
    const { amount, jobId } = req.body;
    const freelancer = req.user.id;

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
        type: "bid",
        title: "New Bid Received",
        message: `A new bid of $${amount} has been placed on your job`,
        relatedId: newBid._id,
        onModel: "Bid",
      });
      await notification.save();
    }

    apiSuccess(res, "Bid placed successfully", { bid: newBid });
  } catch (error) {
    apiError(res, "Error placing bid", error);
  }
};

// Get all bids for a specific job
const getBidsForJob = async (req, res) => {
  try {
    const bids = await Bid.find({ job: req.params.jobId }).populate(
      "freelancer"
    );
    apiSuccess(res, "Bids fetched successfully", { bids });
  } catch (error) {
    apiError(res, "Error fetching bids", error);
  }
};

const acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) {
      return apiNotFound(res, "Bid not found");
    }

    const job = await Job.findById(bid.job);
    if (!job) {
      return apiNotFound(res, "Job not found");
    }

    const currentUserId = req.user.id;
    if (job.employer.toString() !== currentUserId) {
      return apiForbidden(res, "You are not authorized to accept this bid");
    }

    bid.status = "accepted";
    await bid.save();

    job.freelancer = bid.freelancer;
    job.status = "in-progress";
    job.bidAccepted = true;

    await Bid.updateMany(
      { job: job._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    const notification = new Notification({
      recipient: bid.freelancer,
      type: "job_award",
      title: "Bid Accepted",
      message: `Your bid has been accepted for the job: ${job.title}`,
      relatedId: job._id,
      onModel: "Job",
    });
    await notification.save();

    await job.save();
    apiSuccess(res, "Bid accepted successfully", { job });
  } catch (error) {
    apiError(res, "Error accepting bid", error);
  }
};

const getRecentBids = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const freelancerObjectId = new mongoose.Types.ObjectId(freelancerId);

    const recentBids = await Bid.find({ freelancer: freelancerObjectId })
      .populate("job")
      .sort({ createdAt: -1 });

    if (!recentBids.length) {
      return apiNotFound(res, "No recent bids found for this user");
    }

    apiSuccess(res, "Recent bids fetched successfully", { recentBids });
  } catch (error) {
    apiError(res, "Error retrieving recent bids", error);
  }
};

const getBidDetails = async (req, res) => {
  try {
    const { bidId } = req.params;
    const bid = await Bid.findById(bidId)
      .populate("freelancer", "name username")
      .populate("job", "title");

    if (!bid) {
      return apiNotFound(res, "Bid not found");
    }

    apiSuccess(res, "Bid details fetched successfully", { bid });
  } catch (error) {
    apiError(res, "Error fetching bid details", error);
  }
};

const getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId)
      .populate("freelancer", "name username email")
      .populate("job");

    if (!bid) {
      return apiNotFound(res, "Bid not found");
    }

    apiSuccess(res, "Bid fetched successfully", { bid });
  } catch (error) {
    apiError(res, "Error fetching bid", error);
  }
};

const getBidsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bids = await Bid.find({ freelancer: userId })
      .populate("job")
      .populate("freelancer", "name username email")
      .sort({ createdAt: -1 });

    apiSuccess(res, "User's bids fetched successfully", {
      count: bids.length,
      bids,
    });
  } catch (error) {
    apiError(res, "Error fetching user's bids", error);
  }
};

const deleteBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    if (!req.user || !req.user.id) {
      return apiUnauthorized(res, "User not authenticated");
    }

    if (!mongoose.Types.ObjectId.isValid(bidId)) {
      return apiBadRequest(res, "Invalid bid ID");
    }

    const bid = await Bid.findById(bidId);

    if (!bid) {
      return apiNotFound(res, "Bid not found");
    }

    if (bid.freelancer.toString() !== req.user.id) {
      return apiForbidden(res, "Not authorized to delete this bid");
    }

    await bid.deleteOne();
    apiSuccess(res, "Bid deleted successfully");
  } catch (error) {
    apiError(res, "Error deleting bid", error);
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
  deleteBid,
};
