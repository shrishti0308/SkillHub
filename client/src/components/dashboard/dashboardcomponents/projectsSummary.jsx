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
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Recent Projects</h3>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {projects.slice(0, 3).map((project) => (
              <div key={project._id} className="p-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h4 className="text-white">{project.title}</h4>
                  <span className={`px-2 py-1 rounded text-sm ${
                    project.status === "in-progress"
                      ? "bg-emerald-900 text-emerald-200"
                      : "bg-indigo-900 text-indigo-200"
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-400 mt-2 truncate">{project.description}</p>
                <div className="text-gray-400 mt-2">
                  Budget: ${project.budget?.min} - ${project.budget?.max}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Posts Section - For Enterprise and Hybrid */}
      {isEmployer && myJobPosts && myJobPosts.length > 0 && (
        <div className=" w-full">
          <h3 className="text-lg font-medium mb-4">My Job Posts</h3>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {myJobPosts.slice(0, userRole === "hybrid" ? 3 : 5).map((job) => (
              <div key={job._id} className="p-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h4 className="text-white">{job.title}</h4>
                  <span className={`px-2 py-1 rounded text-sm ${
                    job.status === "open"
                      ? "bg-emerald-900 text-emerald-200"
                      : job.status === "in-progress"
                      ? "bg-indigo-900 text-indigo-200"
                      : "bg-gray-700 text-gray-300"
                  }`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-gray-400 mt-2 truncate">{job.description}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">
                    Budget: ${job.budget?.min} - ${job.budget?.max}
                  </span>
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
