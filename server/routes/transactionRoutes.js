// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// GET recent transactions of the logged-in user
router.get('/recent-transactions', authenticateJWT, transactionController.getRecentTransactions);

module.exports = router;
