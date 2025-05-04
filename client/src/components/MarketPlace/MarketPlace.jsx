import React, { useState, useEffect } from "react";
import { FaSearch, FaSort, FaFilter } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole } from "../../redux/Features/user/authSlice";
import { searchJobs } from "../../api/searchService"; // Import the search service

const Marketplace = () => {
  const userRole = useSelector(selectRole);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [jobs, setJobs] = useState([]);
  // Start with default categories
  const [categories, setCategories] = useState([
    "Web Development", 
    "Mobile Development", 
    "Design", 
    "Marketing", 
    "Writing", 
    "Admin Support"
  ]); // Default categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  
  // New state to track form values separately from search params
  const [formValues, setFormValues] = useState({
    searchTerm: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    sortBy: "latest"
  });

  // Modified to use searchJobs from searchService
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Build search params
      const searchParams = {
        query: searchTerm || "*:*",
        limit,
        page,
      };
      
      // Add filters if they exist
      if (selectedCategory) searchParams.categories = selectedCategory;
      if (budgetMin) searchParams.minBudget = parseInt(budgetMin);
      if (budgetMax) searchParams.maxBudget = parseInt(budgetMax);
      
      // Add sort parameter - using fields that exist in Solr schema
      switch (sortBy) {
        case "latest":
          searchParams.sort = "_version_ desc"; // Use _version_ as a proxy for creation time
          break;
        case "oldest":
          searchParams.sort = "_version_ asc";
          break;
        case "budget-high":
          searchParams.sort = "budget_max desc";
          break;
        case "budget-low":
          searchParams.sort = "budget_min asc";
          break;
        default:
          searchParams.sort = "_version_ desc";
      }
      
      // Use the searchJobs function from searchService
      const response = await searchJobs(searchParams);
      
      if (response.success === false) {
        throw new Error(response.message);
      }
      
      setJobs(response.jobs || []);
      setLoading(false);
    } catch (err) {
      setError("Error fetching jobs: " + (err.message || "Unknown error"));
      setLoading(false);
    }
  };

  // Fetch categories by extracting unique categories from jobs and combining with defaults
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/jobs/jobs/filtered");
      if (response.data && Array.isArray(response.data.jobs)) {
        // Start with a Set containing the default categories
        const allCategories = new Set(categories);
        
        // Add any new categories from jobs
        response.data.jobs.forEach((job) => {
          if (job.categories && Array.isArray(job.categories)) {
            job.categories.forEach((category) => allCategories.add(category));
          }
        });
        
        // Update categories state with the combined unique categories
        setCategories(Array.from(allCategories));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Keep using default categories if there's an error
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories once when component mounts
    fetchJobs(); // Initial fetch of jobs
  }, [page]); // Only re-fetch when page changes

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Handle search button click - updated to use form values directly
  const handleSearch = () => {
    // Update the search parameters directly from formValues
    const searchParams = {
      query: formValues.searchTerm || "*:*",
      limit,
      page: 1, // Reset to first page
    };
    
    // Add filters if they exist
    if (formValues.category) searchParams.categories = formValues.category;
    if (formValues.budgetMin) searchParams.minBudget = parseInt(formValues.budgetMin);
    if (formValues.budgetMax) searchParams.maxBudget = parseInt(formValues.budgetMax);
    
    // Add sort parameter - using fields that exist in Solr schema
    switch (formValues.sortBy) {
      case "latest":
        searchParams.sort = "_version_ desc";
        break;
      case "oldest":
        searchParams.sort = "_version_ asc";
        break;
      case "budget-high":
        searchParams.sort = "budget_max desc";
        break;
      case "budget-low":
        searchParams.sort = "budget_min asc";
        break;
      default:
        searchParams.sort = "_version_ desc";
    }
    
    // Set loading state
    setLoading(true);
    
    // Call searchJobs directly with the form values
    searchJobs(searchParams)
      .then(response => {
        if (response.success === false) {
          throw new Error(response.message);
        }
        
        // Update state with search results
        setJobs(response.jobs || []);
        setSearchTerm(formValues.searchTerm);
        setSelectedCategory(formValues.category);
        setBudgetMin(formValues.budgetMin);
        setBudgetMax(formValues.budgetMax);
        setSortBy(formValues.sortBy);
        setPage(1);
        setLoading(false);
      })
      .catch(err => {
        setError("Error fetching jobs: " + (err.message || "Unknown error"));
        setLoading(false);
      });
  };

  const isNewJob = (createdAt) => {
    if (!createdAt) return false;
    
    // Handle array format
    const dateStr = Array.isArray(createdAt) ? createdAt[0] : createdAt;
    
    const jobDate = new Date(dateStr);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return jobDate >= sevenDaysAgo;
  };

  // For pagination
  const handleNextPage = () => {
    setPage(prev => prev + 1);
  };
  
  const handlePrevPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  // Use jobs directly instead of filteredJobs
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
          className="bg-gray-800 p-6 rounded-xl mb-8 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                name="searchTerm"
                placeholder="Search jobs..."
                className="bg-gray-700 border border-gray-600 rounded-lg px-6 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white pl-12"
                value={formValues.searchTerm}
                onChange={handleInputChange}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Category Select */}
            <select
              name="category"
              className="bg-gray-700 border border-gray-600 rounded-lg px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formValues.category}
              onChange={handleInputChange}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Budget Inputs */}
            <input
              type="number"
              name="budgetMin"
              placeholder="Min Budget"
              className="bg-gray-700 border border-gray-600 rounded-lg px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formValues.budgetMin}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="budgetMax"
              placeholder="Max Budget"
              className="bg-gray-700 border border-gray-600 rounded-lg px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formValues.budgetMax}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-between items-center">
            {/* Sort Select */}
            <select
              name="sortBy"
              className="bg-gray-700 border border-gray-600 rounded-lg px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formValues.sortBy}
              onChange={handleInputChange}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget-high">Highest Budget</option>
              <option value="budget-low">Lowest Budget</option>
            </select>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2"
            >
              <FaSearch /> Search Jobs
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white truncate">
                      {Array.isArray(job.title) ? job.title[0] : job.title}
                    </h3>
                    {isNewJob(job.created_at) && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {Array.isArray(job.description) ? job.description[0] : job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(job.categories) && job.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-green-400 font-bold">
                      ${Array.isArray(job.budget_min) ? job.budget_min[0] : job.budget_min} - 
                      ${Array.isArray(job.budget_max) ? job.budget_max[0] : job.budget_max}
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div className="text-center py-10">
              <p className="text-xl text-gray-400">No jobs found matching your criteria</p>
            </div>
          )
        )}

        {/* Pagination */}
        {!loading && !error && jobs.length > 0 && (
          <div className="flex justify-center mt-10 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg ${
                page === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } transition-colors duration-300`}
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-700 rounded-lg text-white">
              Page {page}
            </span>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
