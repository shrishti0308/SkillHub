import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../../api/axiosInstance';
import { setJobById, selectJobById } from '../../../redux/reducers/dashboard/jobsSlice';
import { useParams } from 'react-router-dom';

const JobDetails = () => {
    const { jobId } = useParams();
    const dispatch = useDispatch();
    const job = useSelector(selectJobById);
    const [bidAmount, setBidAmount] = useState('');
    const [bidSuccess, setBidSuccess] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axiosInstance.get(`/job/${jobId}`);
                dispatch(setJobById(response.data.job));
            } catch (error) {
                console.error('Error fetching job details:', error);
            }
        };

        fetchJobDetails();
    }, [dispatch, jobId]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`/job/jobs/${jobId}/bid`, { bidAmount });
            setBidSuccess(true); // Set bid success state
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
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
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
