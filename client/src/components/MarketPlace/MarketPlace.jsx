import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance';

const Marketplace = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [budgetMin, setBudgetMin] = useState('');
    const [budgetMax, setBudgetMax] = useState('');
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = async () => {
        try {
            const response = await axiosInstance.get('/jobs/marketplace');
            setJobs(response.data);
            setLoading(false);

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
        <div className="relative min-h-screen text-white p-8 overflow-hidden">
            {/* Gradient Background with Animated Blobs */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-800 via-gray-900 to-black overflow-hidden">
                {/* Animated Blob Shapes */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-700 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-pink-500 opacity-30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                <h1 className="text-5xl font-bold mb-10 text-center text-blue-400">Marketplace</h1>

                {/* Search Bar */}
                <div className="flex items-center justify-center mb-8">
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        className="bg-gray-800 border border-gray-700 rounded-full px-4 py-3 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="ml-3 p-3 rounded-full bg-blue-500 hover:bg-blue-600 transition focus:outline-none">
                        <FaSearch className="text-white" />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center space-x-4 mb-8">
                    {/* Category Filter */}
                    <select
                        className="bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                    {/* Budget Range Filters */}
                    <input
                        type="number"
                        placeholder="Min Budget"
                        className="bg-gray-800 border border-gray-700 rounded-full px-4 py-2 w-32 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max Budget"
                        className="bg-gray-800 border border-gray-700 rounded-full px-4 py-2 w-32 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value)}
                    />
                </div>

                {/* Job Listings */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500 text-center text-2xl">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredJobs.map(job => (
                            <div
                                key={job._id}
                                className="border border-gray-700 rounded-lg p-6 bg-gray-800 shadow-lg transition transform hover:-translate-y-2 hover:shadow-xl"
                            >
                                <h2 className="text-2xl font-semibold text-blue-400 hover:text-blue-500 transition">
                                    {job.title}
                                </h2>
                                <p className="text-gray-400 mt-2">{job.description}</p>
                                <p className="mt-4 font-semibold text-lg">
                                    Budget: <span className="text-blue-400">${job.budget.min} - ${job.budget.max}</span>
                                </p>
                                <p className="mt-2">
                                    Skills Required: <span className="text-blue-400">{job.skillsRequired.join(', ')}</span>
                                </p>
                                <p className="mt-2">
                                    Categories: <span className="text-blue-400">{job.categories.join(', ')}</span>
                                </p>
                                <a
                                    href={`/jobs/${job._id}`}
                                    className="mt-6 inline-block text-blue-500 hover:underline text-lg"
                                >
                                    View Details
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
