// controllers/walletController.js
const User = require("../models/user");
const { apiSuccess, apiError, apiNotFound } = require("../middleware/response");

// Controller to get the wallet balance of the logged-in user
exports.getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID from the JWT token
    const user = await User.findById(userId).select("wallet"); // Fetch the wallet balance

    if (!user) {
      return apiNotFound(res, "User not found");
    }

    return apiSuccess(res, "Wallet balance retrieved successfully", {
      walletBalance: user.wallet,
    });
  } catch (error) {
    return apiError(res, "Error retrieving wallet balance", error);
  }
};
