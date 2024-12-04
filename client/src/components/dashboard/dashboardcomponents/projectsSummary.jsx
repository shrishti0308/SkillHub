import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  setRecentProjects, 
  selectRecentProjects,
  setMyJobPosts,
  selectMyJobPosts 
} from "../../../redux/reducers/dashboard/projectsSlice";
import { selectRole } from "../../../redux/Features/user/authSlice";
import { selectUserProfile } from "../../../redux/Features/user/ProfileSlice";
import axiosInstance from "../../../api/axiosInstance";

const ProjectsSummary = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectRecentProjects);
  const myJobPosts = useSelector(selectMyJobPosts);
  const userRole = useSelector(selectRole);
  const userProfile = useSelector(selectUserProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEmployer = userRole === "enterprise" || userRole === "hybrid";
  const isFreelancer = userRole === "freelancer" || userRole === "hybrid";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch recent projects for freelancers and hybrid users
        if (isFreelancer) {
          const projectsResponse = await axiosInstance.get("/project/recent-projects");
          dispatch(setRecentProjects(projectsResponse.data.recentProjects));
        }

        // Fetch job posts for employers and hybrid users
        if (isEmployer && userProfile?._id) {
          const jobsResponse = await axiosInstance.get(`/jobs/user/${userProfile._id}`);
          dispatch(setMyJobPosts(jobsResponse.data.data));
        }
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      }
      setLoading(false);
    };

    fetchData();
  }, [dispatch, isEmployer, isFreelancer, userProfile?._id]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl font-semibold mb-6">Dashboard Summary</h2>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl font-semibold mb-6">Dashboard Summary</h2>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* Recent Projects Section - For Freelancers and Hybrid */}
      {isFreelancer && projects && projects.length > 0 && (
        <div className="w-full bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project._id} className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === "completed"
                      ? "bg-green-900 text-green-200"
                      : "bg-yellow-900 text-yellow-200"
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-300 mb-3">{project.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Budget: ${project.budget?.min} - ${project.budget?.max}</span>
                  <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Posts Section - For Enterprise and Hybrid */}
      {isEmployer && myJobPosts && myJobPosts.length > 0 && (
        <div className="w-full bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">My Job Posts</h3>
          <div className="space-y-4">
            {myJobPosts.slice(0, userRole === "hybrid" ? 3 : 5).map((job) => (
              <div key={job._id} className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-white">{job.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    job.status === "open"
                      ? "bg-green-900 text-green-200"
                      : "bg-yellow-900 text-yellow-200"
                  }`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-gray-300 mb-3">{job.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Budget: ${job.budget?.min} - ${job.budget?.max}</span>
                  <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!isFreelancer && !isEmployer) && (
        <div className="text-center py-4 text-gray-400">
          No data to display
        </div>
      )}
    </div>
  );
};

export default ProjectsSummary;
