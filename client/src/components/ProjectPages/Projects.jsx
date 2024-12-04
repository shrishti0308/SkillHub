import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setRecentProjects,
  selectRecentProjects,
  setMyJobPosts,
  selectMyJobPosts,
} from "../../redux/reducers/dashboard/projectsSlice";
import { selectRole } from "../../redux/Features/user/authSlice";
import Sidebar from "../dashboard/dashboardcomponents/Sidebar";
import { selectIsSidebarMinimized } from "../../redux/reducers/dashboard/sidebarSlice";
import axiosInstance from "../../api/axiosInstance";
import ProjectDetails from "./ProjectComponents/ProjectDetails";

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectRecentProjects);
  const myJobPosts = useSelector(selectMyJobPosts);
  const userRole = useSelector(selectRole);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedJobBids, setSelectedJobBids] = useState(null);
  const isSidebarMinimized = useSelector(selectIsSidebarMinimized);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEmployer = userRole === "enterprise" || userRole === "hybrid";

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/project/recent-projects");
        dispatch(setRecentProjects(response.data.recentProjects));

        // Fetch job posts if user is enterprise or hybrid
        if (isEmployer) {
          const jobsResponse = await axiosInstance.get("/jobs/employer/jobs");
          dispatch(setMyJobPosts(jobsResponse.data));
        }

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch projects");
      }
      setLoading(false);
    };

    fetchProjects();
  }, [dispatch, isEmployer]);

  const fetchBidsForJob = async (jobId) => {
    try {
      const response = await axiosInstance.get(`/bids/job/${jobId}`);
      setSelectedJobBids(response.data);
    } catch (err) {
      console.error("Error fetching bids:", err);
      setError("Failed to fetch bids for this job");
    }
  };

  const handleRowClick = async (item, type) => {
    if (type === "project") {
      if (selectedProject && selectedProject._id === item._id) {
        setSelectedProject(null);
      } else {
        setSelectedProject(item);
        setSelectedJobBids(null);
      }
    } else if (type === "job") {
      if (selectedProject && selectedProject._id === item._id) {
        setSelectedProject(null);
        setSelectedJobBids(null);
      } else {
        setSelectedProject(item);
        await fetchBidsForJob(item._id);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-grow p-5 top-16 ml-10 transition-all duration-300">
        <Sidebar />
        <div className="w-10/12 mr-6">
          <div className="text-gray-400">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow p-5 top-16 ml-10 transition-all duration-300">
      <Sidebar />
      <div className={`w-10/12 mr-6 ${isSidebarMinimized ? "ml-16" : ""}`}>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Projects Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Projects
          </h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {projects.map((project) => (
              <div key={project._id}>
                <div
                  className="cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => handleRowClick(project, "project")}
                >
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg text-white">{project.title}</h3>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          project.status === "in-progress"
                            ? "bg-emerald-900 text-emerald-200"
                            : "bg-indigo-900 text-indigo-200"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mt-2">{project.description}</p>
                  </div>
                </div>
                {selectedProject && selectedProject._id === project._id && (
                  <div className="p-4 bg-gray-900">
                    <ProjectDetails project={project} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Job Posts Section (Only for enterprise/hybrid users) */}
        {isEmployer && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              My Job Posts
            </h2>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {myJobPosts.map((job) => (
                <div key={job._id}>
                  <div
                    className="cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => handleRowClick(job, "job")}
                  >
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg text-white">{job.title}</h3>
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            job.status === "open"
                              ? "bg-emerald-900 text-emerald-200"
                              : job.status === "in-progress"
                              ? "bg-indigo-900 text-indigo-200"
                              : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-2">{job.description}</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-400">
                          Budget: ${job.budget?.min} - ${job.budget?.max}
                        </span>
                        <span className="text-gray-400">
                          Bids: {job.bids?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedProject && selectedProject._id === job._id && (
                    <div className="p-4 bg-gray-900">
                      <ProjectDetails project={job} />
                      {/* Bids Section */}
                      {selectedJobBids && (
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold text-white mb-3">
                            Bids
                          </h4>
                          <div className="space-y-3">
                            {selectedJobBids.map((bid) => (
                              <div
                                key={bid._id}
                                className="bg-gray-800 p-3 rounded"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-white">
                                      {bid.freelancer.username}
                                    </span>
                                    <span className="text-gray-400 ml-4">
                                      Amount: ${bid.amount}
                                    </span>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded text-sm ${
                                      bid.status === "pending"
                                        ? "bg-yellow-900 text-yellow-200"
                                        : bid.status === "accepted"
                                        ? "bg-emerald-900 text-emerald-200"
                                        : "bg-red-900 text-red-200"
                                    }`}
                                  >
                                    {bid.status}
                                  </span>
                                </div>
                                {bid.proposalText && (
                                  <p className="text-gray-400 mt-2">
                                    {bid.proposalText}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
