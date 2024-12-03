const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// GET recent projects for the logged-in freelancer
router.get(
  "/recent-projects",
  authenticateJWT,
  projectController.getRecentProjects
);

module.exports = router;
