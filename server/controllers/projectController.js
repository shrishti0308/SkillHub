const Job = require("../models/job");
const { apiSuccess, apiError } = require("../middleware/response");

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
      apiError(res, "No recent projects found for this freelancer");
    }

    // res.status(200).json({ recentProjects });
    apiSuccess(res, "Recent projects retrieved successfully", {
      recentProjects,
    });
  } catch (error) {
    apiError(res, "Error retrieving recent projects", error);
  }
};
