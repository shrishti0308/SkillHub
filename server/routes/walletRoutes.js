// routes/walletRoutes.js
const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// GET wallet balance of the logged-in user
router.get("/balance", authenticateJWT, walletController.getWalletBalance);

module.exports = router;
