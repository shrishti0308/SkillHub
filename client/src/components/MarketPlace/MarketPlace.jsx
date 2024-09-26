import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance';

const Marketplace = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [budgetMin, setBudgetMin] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]); // State for storing categories
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = async () => {
        try {
            const response = await axiosInstance.get('/jobs/marketplace');
            setJobs(response.data);
            setLoading(false);

            // Extract unique categories from fetched jobs
            const allCategories = new Set();
            response.data.forEach(job => {
                job.categories.forEach(category => allCategories.add(category));
            });
            setCategories([...allCategories]);
        } catch (err) {
            setError('Error fetching jobs');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const jobMin = job.budget.min;
        const jobMax = job.budget.max;
        const min = budgetMin ? parseInt(budgetMin) : 0;
        const max = budgetMax ? parseInt(budgetMax) : Infinity;

        return (
            (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategory ? job.categories.includes(selectedCategory) : true) &&
            ((jobMin <= min && jobMin <= max) || min === 0) &&
            ((jobMax >= min && jobMax <= max) || max === Infinity)
        );
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-6 text-center">Marketplace</h1>

            {/* Search Bar */}
            <div className="flex items-center justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    className="bg-gray-800 border border-gray-600 rounded-md p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="ml-2 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="mb-4 flex justify-center">
                <select
                    className="bg-gray-800 border border-gray-600 rounded-md p-2 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>

            {/* Budget Range Filter */}
            <div className="mb-4 flex justify-center space-x-4">
                <input
                    type="number"
                    placeholder="Min Budget"
                    className="bg-gray-800 border border-gray-600 rounded-md p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Budget"
                    className="bg-gray-800 border border-gray-600 rounded-md p-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                />
            </div>

            {/* Job Listings */}
            {loading ? (
                <p className="text-center text-xl">Loading jobs...</p>
            ) : error ? (
                <p className="text-red-500 text-center text-xl">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map(job => (
                        <div key={job._id} className="border border-gray-700 rounded-md p-4 bg-gray-800 transition-transform transform hover:scale-105">
                            <h2 className="text-xl font-semibold hover:text-blue-400 transition">{job.title}</h2>
                            <p className="text-gray-400">{job.description}</p>
                            <p className="mt-2 font-semibold">Budget: <span className="text-blue-400">${job.budget.min} - ${job.budget.max}</span></p>
                            <p className="mt-2">Skills Required: <span className="text-blue-400">{job.skillsRequired.join(', ')}</span></p>
                            <p className="mt-2">Categories: <span className="text-blue-400">{job.categories.join(', ')}</span></p>
                            <a href={`/jobs/${job._id}`} className="mt-4 inline-block text-blue-500 hover:underline">View Details</a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Marketplace;
