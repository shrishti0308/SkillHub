import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import { selectRole, selectUsername } from '../../redux/Features/user/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');

    const role = useSelector(selectRole);
    const username = useSelector(selectUsername);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axiosInstance.get(`/jobs/${id}`);
                setJob(response.data);
                const bidsResponse = await axiosInstance.get(`/bids/${id}`);
                setBids(bidsResponse.data);
            } catch (err) {
                setError('Job not found!');
            }
        };

        fetchJobDetails();
    }, [id]);

    const handleBidSubmit = async () => {
        try {
            await axiosInstance.post(`/bids/place`, {
                amount: bidAmount,
                jobId: id,
            });
            setBidAmount('');
            location.reload();
        } catch (err) {
            setError('Error submitting bid');
        }
    };

    const handleAcceptBid = async (bidId) => {
        try {
            await axiosInstance.put(`/bids/accept/${bidId}`);
            location.reload();
        } catch (err) {
            setError('Error accepting bid');
        }
    };

    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!job) return <div className="text-center">Loading...</div>;

    // Get the accepted bid if it exists
    const acceptedBid = bids.find(bid => bid.status === 'accepted');

    return (
        <div className="min-h-screen  text-white p-8 flex flex-col items-center">
            <div className="max-w-3xl w-full bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-4 border-b border-gray-700 pb-2">{job.title}</h1>
                <p className="text-lg mb-4">{job.description}</p>
                <div className="flex justify-between mb-4">
                    <div>
                        <span className="font-semibold">Budget:</span> ₹{job.budget.min} - ₹{job.budget.max}
                    </div>
                </div>

                {/* Skills and Categories Bubbles */}
                <div className="mb-4">
                    <span className="font-semibold">Skills Required:</span>
                    <div className="flex flex-wrap mt-2">
                        {job.skillsRequired.map((skill, index) => (
                            <span key={index} className="bg-gray-500 text-white rounded-full px-3 py-1 text-sm mr-2 mb-2">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <span className="font-semibold">Categories:</span>
                    <div className="flex flex-wrap mt-2">
                        {job.categories.map((category, index) => (
                            <span key={index} className="bg-gray-600 text-white rounded-full px-3 py-1 text-sm mr-2 mb-2">
                                {category}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center mb-4 border-t border-gray-700 pt-4">
                    {job.employer.info.profilePic ? (
                        <img
                            src={`http://localhost:3000/public${job.employer.info.profilePic}`}
                            alt={`${job.employer.name}'s profile`}
                            className="w-12 h-12 rounded-full mr-3"
                        />
                    ) : (
                        <FontAwesomeIcon icon={faUserCircle} className="w-12 h-12 text-gray-500 mr-3" />
                    )}
                    <a href={`/user/${job.employer.username}`} className="text-blue-400 hover:underline">
                        {job.employer.name}
                    </a>
                </div>

                {/* Display accepted bid if it exists */}
                {acceptedBid && (
                    <div className="mt-6 mb-4">
                        <h2 className="text-2xl font-bold mb-2">Accepted Bid</h2>
                        <li className="bg-gray-700 p-4 rounded-md flex items-center justify-between">
                            <div className="flex items-center">
                                {acceptedBid.freelancer.info.profilePic ? (
                                    <img
                                        src={`http://localhost:3000/public${acceptedBid.freelancer.info.profilePic}`}
                                        alt={`${acceptedBid.freelancer.name}'s profile`}
                                        className="w-10 h-10 rounded-full mr-2"
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faUserCircle} className="w-10 h-10 text-gray-500 mr-2" />
                                )}
                                <a href={`/user/${acceptedBid.freelancer.username}`} className="text-blue-400 hover:underline">
                                    {acceptedBid.freelancer.name}
                                </a>
                            </div>
                            <div className="flex items-center">
                                <span className="font-semibold mr-2">Bid Amount:</span>
                                <span className="bg-yellow-500 text-black rounded-full px-3 py-1 text-sm mr-2">
                                    ₹{acceptedBid.amount}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gray-500 text-white`}>
                                    {acceptedBid.status.charAt(0).toUpperCase() + acceptedBid.status.slice(1)}
                                </span>
                            </div>
                        </li>
                    </div>
                )}

                {/* Conditional rendering for placing bids */}
                {(role === 'hybrid' || role === 'freelancer') && job.employer.username !== username && !job.bidAccepted && (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-2">Place a Bid</h2>
                        <div className="flex items-center mb-4">
                            <input
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder="Enter your bid amount"
                                className="bg-gray-700 border border-gray-600 rounded-md p-2 flex-grow mr-2"
                            />
                            <button
                                onClick={handleBidSubmit}
                                className="bg-blue-600 p-2 rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Submit Bid
                            </button>
                        </div>
                    </div>
                )}

                <h2 className="text-2xl font-bold mt-6 border-t border-gray-700 pt-4">Bids for this Job</h2>
                {bids.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                        {bids.filter(bid => bid.status !== 'accepted').map(bid => ( // Exclude accepted bids
                            <li key={bid._id} className="bg-gray-700 p-4 rounded-md flex items-center justify-between">
                                <div className="flex items-center">
                                    {bid.freelancer.info.profilePic ? (
                                        <img
                                            src={`http://localhost:3000/public${bid.freelancer.info.profilePic}`}
                                            alt={`${bid.freelancer.name}'s profile`}
                                            className="w-10 h-10 rounded-full mr-2"
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faUserCircle} className="w-10 h-10 text-gray-500 mr-2" />
                                    )}
                                    <a href={`/user/${bid.freelancer.username}`} className="text-blue-400 hover:underline">
                                        {bid.freelancer.name}
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold mr-2">Bid Amount:</span>
                                    <span className="bg-yellow-500 text-black rounded-full px-3 py-1 text-sm mr-2">
                                        ₹{bid.amount}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bid.status === 'pending' ? 'bg-yellow-600 text-black' : 'bg-red-600 text-white'}`}>
                                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                    </span>
                                    {job.employer.username === username && bid.status === 'pending' && !job.bidAccepted && (
                                        <button
                                            onClick={() => handleAcceptBid(bid._id)}
                                            className="bg-gray-600 text-white rounded-md px-3 py-1 ml-4 hover:bg-green-700 transition duration-200"
                                        >
                                            Accept
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="mt-4">No bids placed for this job yet.</div>
                )}
            </div>
        </div>
    );
};

export default JobDetails;
