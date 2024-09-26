import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

// JobDetails Component
const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch job details
        const fetchJobDetails = async () => {
            try {
                const response = await axiosInstance.get(`/jobs/${id}`);
                setJob(response.data);
                // Fetch bids for the job
                const bidsResponse = await axiosInstance.get(`/bids/${id}`);
                setBids(bidsResponse.data);
            } catch (err) {
                setError('Job not found!');
            }
        };

        fetchJobDetails();
    }, [id]);

    const handleBidSubmit = async () => {
        // Handle bid submission
        try {
            const response = await axiosInstance.post(`/bids/place`, {
                amount: bidAmount,
                jobId: id,
            });
            setBids([...bids, response.data]); // Add new bid to the state
            setBidAmount(''); // Clear the input field
        } catch (err) {
            setError('Error submitting bid');
        }
    };

    if (error) return <div className="text-red-500">{error}</div>;
    if (!job) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                <p className="mb-2">{job.description}</p>
                <p className="mb-2">
                    <span className="font-semibold">Budget:</span> ${job.budget.min} - ${job.budget.max}
                </p>
                <p className="mb-2">
                    <span className="font-semibold">Skills Required:</span> {job.skillsRequired.join(', ')}
                </p>
                <p className="mb-4">
                    <span className="font-semibold">Categories:</span> {job.categories.join(', ')}
                </p>

                {/* Bidding Form */}
                <h2 className="text-xl font-bold mt-6">Place a Bid</h2>
                <div className="flex items-center mb-4">
                    <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter your bid amount"
                        className="bg-gray-700 border border-gray-600 rounded-md p-2 flex-grow"
                    />
                    <button
                        onClick={handleBidSubmit}
                        className="bg-blue-600 p-2 rounded-md ml-4 hover:bg-blue-700 transition duration-200"
                    >
                        Submit Bid
                    </button>
                </div>

                {/* Displaying bids */}
                <h2 className="text-xl font-bold mt-6">Bids for this Job</h2>
                {bids.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                        {bids.map(bid => (
                            <li key={bid._id} className="bg-gray-700 p-4 rounded-md shadow-md">
                                <span className="font-semibold">Bid Amount:</span> ${bid.amount} -
                                <span className="ml-2">{bid.status}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No bids yet.</p>
                )}
            </div>
        </div>
    );
};

export default JobDetails;
