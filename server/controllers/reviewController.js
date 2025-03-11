const Review = require("../models/review");
const User = require("../models/user");
const Notification = require("../models/notification");
const {
  apiSuccess,
  apiError,
  apiNotFound,
  apiBadRequest,
} = require("../middleware/response");

// Add a review
exports.addReview = async (req, res) => {
  const { reviewedUser, rating, comment } = req.body;
  const reviewer = req.user.id;

  if (reviewedUser === reviewer) {
    return apiBadRequest(res, "Cannot review yourself");
  }

  try {
    const existingReview = await Review.findOne({ reviewer, reviewedUser });
    if (existingReview) {
      return apiBadRequest(res, "You have already reviewed this user");
    }

    const newReview = new Review({
      reviewer,
      reviewedUser,
      rating,
      comment,
    });

    await newReview.save();

    // Create notification for the reviewed user
    const notification = new Notification({
      recipient: reviewedUser,
      type: "review",
      title: "New Review Received",
      message: `You have received a ${rating}-star review`,
      relatedId: newReview._id,
      onModel: "Review",
    });
    await notification.save();

    apiSuccess(res, "Review added successfully", { review: newReview });
  } catch (error) {
    apiError(res, "Error adding review", error);
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const reviewer = req.user.id;

  try {
    const review = await Review.findOne({ _id: reviewId, reviewer });
    if (!review) {
      return apiNotFound(res, "Review not found or you are not the reviewer");
    }

    review.rating = rating;
    review.comment = comment;
    review.updatedAt = Date.now();

    await review.save();
    apiSuccess(res, "Review updated successfully", { review });
  } catch (error) {
    apiError(res, "Error updating review", error);
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const reviewer = req.user.id;

  try {
    const review = await Review.findOneAndDelete({ _id: reviewId, reviewer });
    if (!review) {
      return apiNotFound(res, "Review not found or you are not the reviewer");
    }
    apiSuccess(res, "Review deleted successfully");
  } catch (error) {
    apiError(res, "Error deleting review", error);
  }
};

// Get all reviews for a user
exports.getAllReviewsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await Review.find({ reviewedUser: userId }).populate(
      "reviewer",
      "name username info.profilePic"
    );
    apiSuccess(res, "Reviews fetched successfully", { reviews });
  } catch (error) {
    apiError(res, "Error fetching reviews", error);
  }
};

// Get all reviews by a user
exports.getAllReviewsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await Review.find({ reviewer: userId }).populate(
      "reviewedUser",
      "name"
    );
    apiSuccess(res, "Reviews fetched successfully", { reviews });
  } catch (error) {
    apiError(res, "Error fetching reviews", error);
  }
};

// Get a specific review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate("reviewer", "name username email")
      .populate("reviewedUser", "name username email");

    if (!review) {
      return apiNotFound(res, "Review not found");
    }

    apiSuccess(res, "Review fetched successfully", { data: review });
  } catch (error) {
    apiError(res, "Error fetching review", error);
  }
};
