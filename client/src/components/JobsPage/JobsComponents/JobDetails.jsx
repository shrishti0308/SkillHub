import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../../api/axiosInstance';
import { setJobById, selectJobById, setBidSuccess, resetBidSuccess } from '../../../redux/Features/dashboard/jobsSlice';
import { useParams } from 'react-router-dom';

const JobDetails = () => {
    const { jobId } = useParams();
    const dispatch = useDispatch();
    const job = useSelector(selectJobById);  // Fetch job details from Redux
    const bidSuccess = useSelector((state) => state.jobs.bidSuccess);  // Fetch bid success state from Redux
    const [amount, setAmount] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axiosInstance.get(`/job/user/${jobId}`);
                dispatch(setJobById(response.data.job));  // Set job in Redux state
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        fetchJobDetails();

        // Reset bid success when component mounts
        return () => {
            dispatch(resetBidSuccess());
        };
    }, [dispatch, jobId]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`/job/${jobId}/bid`, { amount: parseFloat(amount) });  // Send bid amount to backend
            dispatch(setBidSuccess(true));  // Set success state in Redux
        } catch (error) {
            console.error('Error submitting bid:', error);
        }
    };

    if (!job) {
        return <p className="text-white">Loading job details...</p>;
    }

    return (
        <div className='p-6'>
            <h1 className="text-2xl font-bold text-white">{job.title}</h1>
            <p className="text-white">{job.description}</p>
            <p className="text-white">Budget: ${job.budget}</p>

            {bidSuccess ? (
                <p className="text-green-500">Your bid has been placed successfully!</p>
            ) : (
                <form onSubmit={handleBidSubmit}>
                    <label className="block text-white mb-2">
                        Bid Amount:
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="ml-2 p-2 rounded text-dark"
                        />
                    </label>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Bid</button>
                </form>
            )}
        </div>
    );
};

export default JobDetails;
