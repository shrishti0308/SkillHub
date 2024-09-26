// controllers/transactionController.js
const Transaction = require('../models/transaction');

// Controller to get recent transactions of the logged-in user
exports.getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user._id; // Get the logged-in user's ID from the JWT token
    const recentTransactions = await Transaction.find({ user: userId })
      .populate('job') // Populate job details if needed
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(10); // Limit to recent 10 transactions (you can adjust this)

    if (!recentTransactions.length) {
      return res.status(404).json({ message: 'No recent transactions found for this user' });
    }

    res.status(200).json({ recentTransactions });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recent transactions', error: error.message });
  }
};
