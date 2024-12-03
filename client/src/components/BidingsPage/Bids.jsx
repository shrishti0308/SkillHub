import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBidsForUser,
  setBids,
} from "../../redux/reducers/dashboard/bidingSlice";
import axiosInstance from "../../api/axiosInstance";
import BidDetails from "./BidingComponents/BidDetails";
import Sidebar from "../dashboard/dashboardcomponents/Sidebar";
import { selectIsSidebarMinimized } from "../../redux/reducers/dashboard/sidebarSlice";

const Bids = () => {
  const dispatch = useDispatch();
  const bids = useSelector(selectBidsForUser);
  const [selectedBid, setSelectedBid] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const isSidebarMinimized = useSelector(selectIsSidebarMinimized);

  const [bidsToDisplay, setBidsToDisplay] = useState([]);

  useEffect(() => {
    const fetchUserBids = async () => {
      try {
        const response = await axiosInstance.get("/recent-bids");
        dispatch(setBids(response.data.bids));
        setBidsToDisplay(bids);
        setStatus("succeeded");
      } catch (error) {
        console.error("Error fetching bids:", error);
        setError(error.message || "Failed to fetch bids");
        setStatus("failed");
      }
    };

    fetchUserBids();
  }, [dispatch]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  return (
    <div
      className={`flex  flex-grow p-5 top-16 ${
        isSidebarMinimized ? "left-16" : "left-56"
      } transition-all duration-300 `}
    >
      <Sidebar />
      <div className="a">
        <h2>User Bids</h2>
        <table className="table-auto text-left">
          <thead>
            <tr>
              <th>Job</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bidsToDisplay && bidsToDisplay.length !== 0 ? (
              bidsToDisplay.map((bid) => (
                <tr key={bid._id} onClick={() => setSelectedBid(bid)}>
                  <td>{bid.job.title}</td>
                  <td>${bid.amount}</td>
                  <td>{bid.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No bids found</td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedBid && <BidDetails bid={selectedBid} />}
      </div>
    </div>
  );
};

export default Bids;
