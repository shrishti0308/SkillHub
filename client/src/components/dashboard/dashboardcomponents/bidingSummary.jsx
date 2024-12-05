import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../api/axiosInstance";
import { setBids, selectBidsForUser } from "../../../redux/reducers/dashboard/bidingSlice";

const BiddingSummary = () => {
  const dispatch = useDispatch();
  const bids = useSelector(selectBidsForUser);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axiosInstance.get("/bids/recent/bid");
        if (response.data.recentBids) {
          dispatch(setBids(response.data.recentBids));
          setStatus("succeeded");
        } else {
          dispatch(setBids([]));
          setStatus("empty");
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // No bids found is a valid state
          dispatch(setBids([]));
          setStatus("empty");
        } else {
          console.error("Error fetching bids:", error);
          setError(error.response?.data?.message || "Failed to fetch bids");
          setStatus("failed");
        }
      }
    };

    fetchBids();
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="w-full bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Latest Bids</h2>
        <div className="text-gray-400">Loading bids...</div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="w-full bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Latest Bids</h2>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (status === "empty" || !bids || bids.length === 0) {
    return (
      <div className="w-full bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Latest Bids</h2>
        <div className="text-gray-400">No bids found. Start bidding on jobs to see them here!</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Latest Bids</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bids.map((bid) => (
          <div
            key={bid._id}
            className="bg-gray-700/50 p-5 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-white">
                {bid.job?.title || "Job Title Unavailable"}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  bid.status === "accepted"
                    ? "bg-green-900 text-green-200"
                    : bid.status === "rejected"
                    ? "bg-red-900 text-red-200"
                    : "bg-yellow-900 text-yellow-200"
                }`}
              >
                {bid.status}
              </span>
            </div>
            <p className="text-gray-300 mb-3">Bid Amount: ${bid.amount}</p>
            <div className="text-sm text-gray-400">
              {bid.createdAt && (
                <span>Placed: {new Date(bid.createdAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiddingSummary;
