const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path"); // Add this to manage file paths
const fs = require("fs");
const mongoose = require("mongoose");
const bid = require("./models/bid");

// Import middleware
const { authenticateJWT } = require("./middlewares/authMiddleware");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const { createCorsMiddleware } = require("./middlewares/corsMiddleware");
const {
  requestLogger,
  errorLogger,
  consoleLogger,
} = require("./middlewares/loggingMiddleware");
const {
  apiLimiter,
  loginLimiter,
  securityHeaders,
} = require("./middlewares/securityMiddleware");
const { sanitizeBody } = require("./middlewares/requestValidationMiddleware");
const adminAuth = require("./middleware/adminAuth");
const { debugAuth } = require("./middleware/debugMiddleware");
const {
  isSuperuser,
  isAdmin,
  hasPermission,
} = require("./middleware/roleCheck");

// Import routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const jobRoutes = require("./routes/jobRoutes");
const bidRoutes = require("./routes/bidRoutes");
const projectRoutes = require("./routes/projectRoutes");
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Connect to MongoDB
connectDB();

// ===== MIDDLEWARE SETUP =====

// 1. Application-level middleware
// Logging middleware
app.use(consoleLogger); // Console logging for all requests
app.use(requestLogger(NODE_ENV === "development")); // File logging for successful requests
app.use(errorLogger(NODE_ENV === "development")); // File logging for error requests

// Security middleware
app.use(securityHeaders); // Custom security headers
app.use(apiLimiter); // Rate limiting for all routes

// CORS middleware
app.use(createCorsMiddleware(NODE_ENV)); // CORS configuration based on environment

// Body parsing middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Disable sanitizeBody for admin routes to prevent interference with permissions
app.use("/admin", express.json(), express.urlencoded({ extended: true }));
// Apply sanitizeBody to all other routes
app.use(/^(?!\/admin).*$/, sanitizeBody);

// Static file serving
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// 2. Router-level middleware
// Apply specific middleware to routes
app.use("/user/login", loginLimiter); // Stricter rate limiting for login route

// 3. Route setup
app.get("/", (req, res) => {
  res.send("Hello, My lord!");
});

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/jobs", jobRoutes);
app.use("/bids", bidRoutes);
app.use("/review", reviewRoutes);
app.use("/notifications", notificationRoutes);
app.use("/project", projectRoutes);
app.use("/wallet", walletRoutes);
app.use("/transaction", transactionRoutes);

// Example of a protected route with authentication middleware
app.get("/recent-bids", authenticateJWT, async (req, res, next) => {
  try {
    const freelancerId = req.user.id;
    const freelancerObjectId = new mongoose.Types.ObjectId(freelancerId);

    const recentBids = await bid.find({ freelancer: freelancerObjectId });

    res.status(200).json({ recentBids });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

// 4. Error handling middleware
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // Handle all other errors

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
