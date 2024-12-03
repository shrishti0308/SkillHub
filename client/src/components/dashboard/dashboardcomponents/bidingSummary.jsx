import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../../api/axiosInstance';
import { setBids, selectBidsForUser } from '../../../redux/reducers/dashboard/bidingSlice';
import { selectRecentJobs } from '../../../redux/Features/dashboard/jobsSlice';

const BiddingSummary = () => {
    const dispatch = useDispatch();
    const bids = useSelector(selectBidsForUser);
    const jobs = useSelector(selectRecentJobs);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const response = await axiosInstance.get('/recent-bids');
                dispatch(setBids(response.data.recentBids));
                setStatus('succeeded');
            } catch (error) {
                console.error('Error fetching bids:', error);
                setError(error.message || 'Failed to fetch bids');
                setStatus('failed');
            }
        };

        fetchBids();
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-semibold">Loading...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-xl">Error: {error}</p>
            </div>
        );
    }

    // Function to get job title from the map
    const findJobTitle = (jobId) => {
        const recentJobs = jobs.jobs;
        console.log("finding for job title");
        console.log(recentJobs);
        let ans = 'Unknown';
        Object.values(recentJobs).forEach(job => {
            if (job._id == jobId) {
                ans = job.title;
            }
        });
        return ans;
    };

    return (
        <div className="bg-dark p-6">
            <h2 className="text-xl font-bold text-light mb-8">Latest Bids</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bids.map((bid) => (
                    <div key={bid._id} className="bg-gray p-5 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
                        <h3 className="text-xl font-semibold text-cyan-blue mb-3">
                            {findJobTitle(bid.job)}
                            {/* {bid.job} */}
                        </h3>
                        <p className="text-light mb-2">Bid Amount: <span className="font-medium text-light">${bid.amount}</span></p>
                        <p className="text-light mb-4">Status:
                            <span className={`ml-2 inline-block px-3 py-2 border text-sm font-medium ${bid.status === 'accepted' ? 'text-emerald-100 border-emerald-600' : 'border-yellow-100 text-yellow-600'
                                }`}>
                                {bid.status}
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BiddingSummary;
