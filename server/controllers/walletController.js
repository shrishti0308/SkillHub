// controllers/walletController.js
const User = require('../models/user');

// Controller to get the wallet balance of the logged-in user
exports.getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID from the JWT token
    const user = await User.findById(userId).select('wallet'); // Fetch the wallet balance

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ walletBalance: user.wallet });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving wallet balance', error: error.message });
  }
};
