const Review = require("../models/review");
const User = require("../models/user");

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
      "name username"
    );
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
