const Review = require("../models/review");
const User = require("../models/user");
const Notification = require("../models/notification");

// Add a review
exports.addReview = async (req, res) => {
  const { reviewedUser, rating, comment } = req.body;
  const reviewer = req.user.id;

  if (reviewedUser === reviewer) {
    return res
      .status(400)
      .json({ success: false, message: "Cannot review yourself" });
  }

  try {
    const existingReview = await Review.findOne({ reviewer, reviewedUser });
    if (existingReview)
      return res
        .status(400)
        .json({
          success: false,
          message: "You have already reviewed this user",
        });

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
      type: 'review',
      title: 'New Review Received',
      message: `You have received a ${rating}-star review`,
      relatedId: newReview._id,
      onModel: 'Review'
    });
    await notification.save();

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error adding review", error });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const reviewer = req.user.id;

  try {
    const review = await Review.findOne({ _id: reviewId, reviewer });
    if (!review)
      return res
        .status(404)
        .json({
          success: false,
          message: "Review not found or you are not the reviewer",
        });

    review.rating = rating;
    review.comment = comment;
    review.updatedAt = Date.now(); // Update the timestamp

    await review.save();
    res.status(200).json({ success: true, review });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating review", error });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const reviewer = req.user.id;

  try {
    const review = await Review.findOneAndDelete({ _id: reviewId, reviewer });
    if (!review)
      return res
        .status(404)
        .json({
          success: false,
          message: "Review not found or you are not the reviewer",
        });
    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting review", error });
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
    console.log(reviews)
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching reviews", error });
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
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching reviews", error });
  }
};

// Get a specific review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId)
      .populate('reviewer', 'name username email')
      .populate('reviewedUser', 'name username email');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message,
    });
  }
};
