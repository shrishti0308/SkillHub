const Job = require("../models/job");

// Controller to get recent projects for the logged-in freelancer
exports.getRecentProjects = async (req, res) => {
  try {
    const userId = req.user.id; // Get logged-in freelancer's ID from JWT token

    // Find jobs where the freelancer is the logged-in user and the job is either in-progress or closed
    const recentProjects = await Job.find({
      freelancer: userId,
      status: { $in: ["in-progress", "closed"] }, // Filter for in-progress or closed status
    })
      .sort({ updatedAt: -1 }) // Sort by most recent update
      .limit(10); // Limit to the 10 most recent projects

    if (!recentProjects.length) {
      return res
        .status(404)
        .json({ message: "No recent projects found for this freelancer" });
    }

    res.status(200).json({ recentProjects });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving recent projects",
        error: error.message,
      });
  }
};
