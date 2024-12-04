// routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// GET all transactions of the logged-in user
router.get(
  "/all-transactions",
  authenticateJWT,
  transactionController.getAllTransactions
);

// GET recent transactions of the logged-in user
router.get(
  "/recent-transactions",
  authenticateJWT,
  transactionController.getRecentTransactions
);

// GET transaction details
router.get(
  "/:transactionId",
  authenticateJWT,
  transactionController.getTransactionDetails
);

// POST create a new transaction
router.post("/", authenticateJWT, transactionController.createTransaction);

// PATCH update transaction status
router.patch(
  "/:transactionId/status",
  authenticateJWT,
  transactionController.updateTransactionStatus
);

// GET summary of earnings (wallet balance and recent transactions)
router.get(
  "/earnings-summary",
  authenticateJWT,
  transactionController.getEarningsSummary
);

module.exports = router;
