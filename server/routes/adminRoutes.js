const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");
const {
  isSuperuser,
  isAdmin,
  hasPermission,
} = require("../middleware/roleCheck");
const { debugAuth } = require("../middleware/debugMiddleware");

// Public routes
router.post("/login", adminController.login);

// Debug route to test authentication
router.get("/debug-auth", adminAuth, debugAuth, (req, res) => {
  res.json({
    message: "Authentication successful",
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      permissions: req.admin.permissions || [],
    },
  });
});

// Protected routes
router.use(adminAuth); // Apply admin authentication middleware to all routes below
router.use(debugAuth); // Add debug middleware to log authentication info

// Get current admin
router.get("/current", adminController.getCurrentAdmin);

// User Management Routes
router.get("/users", hasPermission("manageUsers"), adminController.getAllUsers);
router.put(
  "/users/:id",
  hasPermission("manageUsers"),
  adminController.updateUser
);
router.delete(
  "/users/:id",
  hasPermission("manageUsers"),
  adminController.deleteUser
);

// Job Management Routes
router.get("/jobs", hasPermission("manageJobs"), adminController.getAllJobs);
router.delete(
  "/jobs/:id",
  hasPermission("manageJobs"),
  adminController.deleteJob
);
router.put("/jobs/:id", hasPermission("manageJobs"), adminController.updateJob);

// Reports and Analytics Routes
router.get(
  "/reports",
  hasPermission("viewReports"),
  adminController.getReports
);
router.get(
  "/reports/statistics",
  hasPermission("viewReports"),
  adminController.getStatistics
);
router.get(
  "/reports/activities",
  hasPermission("viewReports"),
  adminController.getRecentActivities
);

// Superuser only routes
router.post("/create", isSuperuser, adminController.createAdmin);
router.get("/all", isSuperuser, adminController.getAllAdmins);
router.delete("/:id", isSuperuser, adminController.deleteAdmin);
router.patch(
  "/:id/permissions",
  isSuperuser,
  adminController.updatePermissions
);

// Admin and Superuser routes
router.get("/:id", isAdmin, adminController.getAdminById);
router.patch("/:id", isAdmin, adminController.updateAdmin);

module.exports = router;
