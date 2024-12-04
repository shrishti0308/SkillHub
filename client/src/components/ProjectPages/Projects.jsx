import React, { useState, useEffect, useMemo } from "react";
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
import { FiSearch, FiFilter, FiDollarSign, FiClock } from 'react-icons/fi';

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

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [budgetRange, setBudgetRange] = useState("all");

  const isEmployer = userRole === "enterprise" || userRole === "hybrid";
  const isFreelancer = userRole === "freelancer" || userRole === "hybrid";

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        if (isFreelancer) {
          const response = await axiosInstance.get("/project/recent-projects");
          dispatch(setRecentProjects(response.data.recentProjects));
        }

        if (isEmployer && userProfile?._id) {
          const jobsResponse = await axiosInstance.get(`/jobs/user/${userProfile._id}`);
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

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    const itemsToFilter = isFreelancer ? projects : myJobPosts;
    
    return itemsToFilter?.filter((item) => {
      // Search by title
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus = filterStatus === "all" || item.status === filterStatus;

      // Filter by budget range
      let matchesBudget = true;
      if (budgetRange !== "all") {
        const minBudget = item.budget?.min || 0;
        const maxBudget = item.budget?.max || 0;
        const avgBudget = (minBudget + maxBudget) / 2;

        switch (budgetRange) {
          case "0-500":
            matchesBudget = avgBudget <= 500;
            break;
          case "501-1000":
            matchesBudget = avgBudget > 500 && avgBudget <= 1000;
            break;
          case "1001-5000":
            matchesBudget = avgBudget > 1000 && avgBudget <= 5000;
            break;
          case "5000+":
            matchesBudget = avgBudget > 5000;
            break;
          default:
            matchesBudget = true;
        }
      }

      return matchesSearch && matchesStatus && matchesBudget;
    });
  }, [projects, myJobPosts, searchTerm, filterStatus, budgetRange, isFreelancer]);

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

        {/* Search and Filter Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {isFreelancer ? "Projects" : "My Job Posts"}
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by project title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
            >
              <FiFilter />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="bg-gray-700 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Budget Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Range
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Budgets</option>
                  <option value="0-500">$0 - $500</option>
                  <option value="501-1000">$501 - $1,000</option>
                  <option value="1001-5000">$1,001 - $5,000</option>
                  <option value="5000+">$5,000+</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Projects/Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects && filteredProjects.length > 0 ? (
            filteredProjects.map((item) => (
              <div
                key={item._id}
                className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl hover:bg-gray-700 ${
                  selectedProject?._id === item._id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleRowClick(item, isFreelancer ? "project" : "job")}
              >
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 truncate">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-300">
                      <FiDollarSign className="mr-1" />
                      ${item.budget?.min} - ${item.budget?.max}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1 text-gray-400" />
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "completed"
                            ? "bg-green-900 text-green-200"
                            : item.status === "in-progress"
                            ? "bg-blue-900 text-blue-200"
                            : "bg-yellow-900 text-yellow-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedProject?._id === item._id && (
                  <div className="border-t border-gray-700 p-4 bg-gray-900">
                    <ProjectDetails project={item} bids={selectedJobBids} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">
              No projects found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
