// controllers/transactionController.js
const Transaction = require("../models/transaction");
const Notification = require("../models/notification");
const {
  apiSuccess,
  apiError,
  apiNotFound,
  apiBadRequest,
} = require("../middleware/response");

// Controller to get recent transactions of the logged-in user
exports.getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID from the JWT token
    const recentTransactions = await Transaction.find({ user: userId })
      .populate("job") // Populate job details if needed
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(10); // Limit to recent 10 transactions (you can adjust this)

    if (!recentTransactions.length) {
      apiNotFound(res, "No recent transactions found for this user");
    }

    apiSuccess(res, "Recent transactions retrieved successfully", {
      recentTransactions,
    });
  } catch (error) {
    apiError(res, "Error retrieving recent transactions", error);
  }
};

// Controller to get all transactions for the logged-in user
exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID from the JWT token
    const transactions = await Transaction.find({ user: userId })
      .populate("job") // Populate job details
      .sort({ createdAt: -1 }); // Sort by most recent

    if (!transactions.length) {
      apiNotFound(res, "No transactions found for this user");
    }

    apiSuccess(res, "Transactions retrieved successfully", { transactions });
  } catch (error) {
    apiError(res, "Error retrieving transactions", error);
  }
};

exports.getTransactionDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId).populate(
      "job"
    );

    if (!transaction) {
      apiNotFound(res, "Transaction not found");
    }

    apiSuccess(res, "Transaction details retrieved successfully", {
      transaction,
    });
  } catch (error) {
    apiError(res, "Error retrieving transaction details", error);
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { amount, transactionType, job, commission } = req.body;
    const userId = req.user.id;

    const newTransaction = new Transaction({
      user: userId,
      amount,
      transactionType,
      job,
      commission,
      status: "pending",
    });

    await newTransaction.save();

    // Create notification for transaction creation
    const notification = new Notification({
      recipient: userId,
      type: "transaction",
      title: "New Transaction Created",
      message: `A new ${transactionType} transaction for $${amount} has been created`,
      relatedId: newTransaction._id,
      onModel: "Transaction",
    });
    await notification.save();

    apiSuccess(res, "Transaction created successfully", {
      transaction: newTransaction,
    });
  } catch (error) {
    apiError(res, "Error creating transaction", error);
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    if (!["pending", "completed", "failed"].includes(status)) {
      return apiBadRequest(res, "Invalid status value");
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return apiNotFound(res, "Transaction not found");
    }

    transaction.status = status;
    await transaction.save();

    // Create notification for status update
    const notification = new Notification({
      recipient: transaction.user,
      type: "transaction",
      title: "Transaction Status Updated",
      message: `Your transaction has been ${status}`,
      relatedId: transaction._id,
      onModel: "Transaction",
    });
    await notification.save();

    apiSuccess(res, "Transaction status updated successfully", { transaction });
  } catch (error) {
    apiError(res, "Error updating transaction status", error);
  }
};

// Fetch recent transactions with populated job details
exports.getEarningsSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the 5 most recent transactions with job details populated
    const recentTransactions = await Transaction.find({ user: userId })
      .populate({
        path: "job", // Path to populate
        select: "title description budget", // Select specific fields
      })
      .sort({ createdAt: -1 })
      .limit(5);

    apiSuccess(res, "Earnings summary retrieved successfully", {
      recentTransactions,
    });
  } catch (error) {
    apiError(res, "Error fetching earnings summary", error);
  }
};
