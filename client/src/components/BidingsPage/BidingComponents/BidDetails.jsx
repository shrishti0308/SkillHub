import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectBidDetails, setBidDetails } from '../../../redux/reducers/dashboard/bidingSlice';
import axiosInstance from '../../../api/axiosInstance';

const BidDetails = ({ bid }) => {
    const dispatch = useDispatch();
    const bidDetails = useSelector(selectBidDetails);

    useEffect(() => {
        const fetchBidDetails = async () => {
            try {
                const response = await axiosInstance.get(`/bids/${bid.job._id}/bids`);
                dispatch(setBidDetails(response.data));
            } catch (error) {
                console.error('Error fetching bid details:', error);
            }
        };

        fetchBidDetails();
    }, [bid, dispatch]);

    if (!bidDetails) {
        return <p>Loading bid details...</p>;
    }

    return (
        <div className="bid-details">
            <h3>Bid Details for Job: {bid.job.title}</h3>
            <table className="table-auto w-full text-left">
                <thead>
                    <tr>
                        <th>Freelancer</th>
                        <th>Bid Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {bidDetails.map((bidDetail) => (
                        <tr key={bidDetail._id}>
                            <td>{bidDetail.freelancer.name}</td>
                            <td>${bidDetail.amount}</td>
                            <td>{bidDetail.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BidDetails;
