import React, { useState, useEffect } from "react";
import { FaSearch, FaSort } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole } from "../../redux/Features/user/authSlice";

const Marketplace = () => {
  const userRole = useSelector(selectRole);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("latest");

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get("/jobs/marketplace");
      // Sort jobs by createdAt date
      const sortedJobs = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setJobs(sortedJobs);
      setLoading(false);

      const allCategories = new Set();
      response.data.forEach((job) => {
        job.categories.forEach((category) => allCategories.add(category));
      });
      setCategories([...allCategories]);
    } catch (err) {
      setError("Error fetching jobs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const isNewJob = (createdAt) => {
    const jobDate = new Date(createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return jobDate >= sevenDaysAgo;
  };

  const sortJobs = (jobs) => {
    switch (sortBy) {
      case "latest":
        return [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return [...jobs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "budget-high":
        return [...jobs].sort((a, b) => (b.budget?.max || 0) - (a.budget?.max || 0));
      case "budget-low":
        return [...jobs].sort((a, b) => (a.budget?.min || 0) - (b.budget?.min || 0));
      default:
        return jobs;
    }
  };

  const filteredJobs = sortJobs(jobs.filter((job) => {
    const jobMin = job.budget?.min || 0;
    const jobMax = job.budget?.max || 0;
    const min = budgetMin ? parseInt(budgetMin) : 0;
    const max = budgetMax ? parseInt(budgetMax) : Infinity;

    return (
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory ? job.categories.includes(selectedCategory) : true) &&
      ((jobMin <= min && jobMin <= max) || min === 0) &&
      ((jobMax >= min && jobMax <= max) || max === Infinity)
    );
  }));

  return (
    <div className="relative min-h-screen text-white p-8 overflow-hidden ">
      {/* Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-700 opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto max-w-7xl">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-bold mb-10 text-center text-white"
        >
          Marketplace
        </motion.h1>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Search Bar */}
          <div className="flex items-center justify-center">
            <div className="relative w-2/3">
              <input
                type="text"
                placeholder="Search jobs..."
                className="bg-gray-800 border border-gray-700 rounded-lg px-6 py-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-white pl-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="bg-gray-800 border border-gray-700 rounded-lg px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget-high">Highest Budget</option>
              <option value="budget-low">Lowest Budget</option>
            </select>

            <input
              type="number"
              placeholder="Min Budget"
              className="bg-gray-800 border border-gray-700 rounded-lg px-6 py-3 w-36 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Budget"
              className="bg-gray-800 border border-gray-700 rounded-lg px-6 py-3 w-36 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center text-2xl bg-red-500/10 rounded-lg p-4 mt-8">
            {error}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12"
          >
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="border border-gray-700 rounded-lg p-8 bg-gray-800 hover:bg-gray-800/80 transition duration-300 flex flex-col relative">
                  {/* New Badge */}
                  {isNewJob(job.createdAt) && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-500 text-white">
                        New
                      </span>
                    </div>
                  )}

                  {/* Job Title */}
                  <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h2>

                  {/* Job Description */}
                  <p className="mt-4 text-gray-300 overflow-hidden text-ellipsis" style={{display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical'}}>
                    {job.description}
                  </p>

                  {/* Budget Section */}
                  <div className="mt-6 flex items-center text-blue-200">
                    <p className="font-semibold">
                      Budget:{" "}
                      <span className="text-yellow-300">
                        ₹{(job.budget?.min || 0).toLocaleString()} - ₹{(job.budget?.max || 0).toLocaleString()}
                      </span>
                    </p>
                  </div>

                  {/* Skills Required */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-blue-300 mb-2">Skills Required:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-300 mb-2">Categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-300"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bid Now/View Details Button */}
                  <Link
                    to={`/jobs/${job._id}`}
                    className="mt-6 inline-flex items-center justify-center w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 text-lg font-semibold"
                  >
                    {userRole === "enterprise" ? "View Details" : "Bid Now"}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
