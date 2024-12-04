// controllers/transactionController.js
const Transaction = require("../models/transaction");

// Controller to get recent transactions of the logged-in user
exports.getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID from the JWT token
    const recentTransactions = await Transaction.find({ user: userId })
      .populate("job") // Populate job details if needed
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(10); // Limit to recent 10 transactions (you can adjust this)

    if (!recentTransactions.length) {
      return res
        .status(404)
        .json({ message: "No recent transactions found for this user" });
    }

    res.status(200).json({ recentTransactions });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving recent transactions",
      error: error.message,
    });
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
      return res
        .status(404)
        .json({ message: "No transactions found for this user" });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving transactions",
      error: error.message,
    });
  }
};

exports.getTransactionDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId).populate(
      "job"
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ transaction });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving transaction details",
      error: error.message,
    });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { jobId, amount, transactionType, commission } = req.body;
    const userId = req.user.id;

    const newTransaction = new Transaction({
      user: userId,
      job: jobId,
      amount,
      transactionType,
      commission,
      status: "pending", // Default status
    });

    const savedTransaction = await newTransaction.save();

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: savedTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating transaction",
      error: error.message,
    });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    if (!["pending", "completed", "failed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction status updated successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating transaction status",
      error: error.message,
    });
  }
};
