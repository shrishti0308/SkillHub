const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const { validateReviewInput } = require('../middlewares/validationMiddleware');

// Add a review
router.post('/', authenticateJWT, validateReviewInput, reviewController.addReview);

// Update a review
router.put('/:reviewId', authenticateJWT, reviewController.updateReview);

// Delete a review
router.delete('/:reviewId', authenticateJWT, reviewController.deleteReview);

// Get all reviews for a user
router.get('/user/:userId', authenticateJWT, reviewController.getAllReviewsForUser);

// Get all reviews by a user
router.get('/by/:userId', authenticateJWT, reviewController.getAllReviewsByUser);

module.exports = router;
