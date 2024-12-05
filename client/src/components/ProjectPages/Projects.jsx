import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setRecentProjects,
  selectRecentProjects,
  setMyJobPosts,
  selectMyJobPosts,
} from "../../redux/reducers/dashboard/projectsSlice";
import { selectRole } from "../../redux/Features/user/authSlice";
import { selectUserProfile } from "../../redux/Features/user/ProfileSlice";
import Sidebar from "../dashboard/dashboardcomponents/Sidebar";
import { selectIsSidebarMinimized } from "../../redux/reducers/dashboard/sidebarSlice";
import axiosInstance from "../../api/axiosInstance";
import ProjectDetails from "./ProjectComponents/ProjectDetails";

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectRecentProjects);
  const myJobPosts = useSelector(selectMyJobPosts);
  const userRole = useSelector(selectRole);
  const userProfile = useSelector(selectUserProfile);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedJobBids, setSelectedJobBids] = useState(null);
  const isSidebarMinimized = useSelector(selectIsSidebarMinimized);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({
    jobId: null,
    status: null,
  });
  const [projectSearch, setProjectSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");

  const isEmployer = userRole === "enterprise" || userRole === "hybrid";
  const isFreelancer = userRole === "freelancer" || userRole === "hybrid";

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        // Only fetch projects for freelancers and hybrid users
        if (isFreelancer) {
          const response = await axiosInstance.get("/project/recent-projects");
          dispatch(setRecentProjects(response.data.recentProjects));
        }

        // Fetch job posts for employers and hybrid users
        if (isEmployer && userProfile?._id) {
          const jobsResponse = await axiosInstance.get(
            `/jobs/user/${userProfile._id}`
          );
          dispatch(setMyJobPosts(jobsResponse.data.data));
        }

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch projects");
      }
      setLoading(false);
    };

    fetchProjects();
  }, [dispatch, isEmployer, isFreelancer, userProfile?._id]);

  const fetchBidsForJob = async (jobId) => {
    try {
      const response = await axiosInstance.get(`/bids/${jobId}`);
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

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      await axiosInstance.put(`/jobs/${jobId}`, { status: newStatus });
      // Update the job status in the local state
      const updatedJobs = myJobPosts.map((job) =>
        job._id === jobId ? { ...job, status: newStatus } : job
      );
      dispatch(setMyJobPosts(updatedJobs));
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to update job status to ${newStatus}`
      );
    }
  };

  const handleStatusUpdateClick = (e, jobId, status) => {
    e.stopPropagation();
    setConfirmAction({ jobId, status });
    setShowConfirmModal(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (confirmAction.jobId && confirmAction.status) {
      await handleStatusUpdate(confirmAction.jobId, confirmAction.status);
      setShowConfirmModal(false);
      setConfirmAction({ jobId: null, status: null });
    }
  };

  const handleCancelStatusUpdate = () => {
    setShowConfirmModal(false);
    setConfirmAction({ jobId: null, status: null });
  };

  // Filter projects based on search
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
    project.description.toLowerCase().includes(projectSearch.toLowerCase())
  );

  // Filter jobs based on search
  const filteredJobs = myJobPosts.filter(job =>
    job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
    job.description.toLowerCase().includes(jobSearch.toLowerCase())
  );

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
    <>
      <div className="flex flex-grow p-5 top-16 ml-10 transition-all duration-300">
        <Sidebar />
        <div className={`w-10/12 mr-6 ${isSidebarMinimized ? "ml-16" : ""}`}>
          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* Projects Section - Only show for freelancers and hybrid users */}
          {isFreelancer && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Recent Projects <span className="text-sm text-gray-400">({filteredProjects.length})</span>
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                {filteredProjects.map((project) => (
                  <div key={project._id}>
                    <div
                      className="cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleRowClick(project, "project")}
                    >
                      <div className="p-4 border-b border-gray-700">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg text-white">
                            {project.title}
                          </h3>
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
                        <p className="text-gray-400 mt-2">
                          {project.description}
                        </p>
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
          )}

          {/* Job Posts Section - Only show for enterprise and hybrid users */}
          {isEmployer && (
            <div className={`${isFreelancer ? "mt-8" : ""}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  My Job Posts <span className="text-sm text-gray-400">({filteredJobs.length})</span>
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                {filteredJobs.map((job) => (
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
                          <div className="space-x-2">
                            <Link
                              to={`/jobs/${job._id}`}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                              onClick={(e) => e.stopPropagation()}
                            >
                              More Details
                            </Link>
                            {job.status === "open" && (
                              <button
                                onClick={(e) =>
                                  handleStatusUpdateClick(e, job._id, "closed")
                                }
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                              >
                                Close Job
                              </button>
                            )}
                            {job.status === "in-progress" && (
                              <button
                                onClick={(e) =>
                                  handleStatusUpdateClick(
                                    e,
                                    job._id,
                                    "completed"
                                  )
                                }
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                              >
                                Mark Completed
                              </button>
                            )}
                          </div>
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
                                      <Link
                                        to={`/user/${bid.freelancer.username}`}
                                        className="text-white"
                                      >
                                        {bid.freelancer.username}
                                      </Link>
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Confirm Action
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to mark this job as {confirmAction.status}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelStatusUpdate}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusUpdate}
                className={`px-4 py-2 rounded text-white ${
                  confirmAction.status === "completed"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
