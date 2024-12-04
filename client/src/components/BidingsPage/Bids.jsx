import React ,{ useState } from "react";
import { useSelector } from "react-redux";
import { selectBidsForUser } from "../../redux/reducers/dashboard/bidingSlice";
import BidDetails from "./BidingComponents/BidDetails";
import Sidebar from "../dashboard/dashboardcomponents/Sidebar";
import { selectIsSidebarMinimized } from "../../redux/reducers/dashboard/sidebarSlice";

const Bids = () => {
  const bids = useSelector(selectBidsForUser);
  const [selectedBid, setSelectedBid] = useState(null);
  const isSidebarMinimized = useSelector(selectIsSidebarMinimized);

  const handleRowClick = (bid) => {
    if (selectedBid && selectedBid._id === bid._id) {
      setSelectedBid(null); // Toggle off if same bid is clicked
    } else {
      setSelectedBid(bid); // Select new bid
    }
  };

  return (
    <div
      className={`flex flex-grow p-5 top-16 ${
        isSidebarMinimized ? "ml-5" : "ml-10"
      } transition-all duration-300`}
    >
      <Sidebar />
      <div className="w-10/12 mr-6">
        <h2>User Bids</h2>
        <div className="w-full">
          <table className="table-auto w-full text-left text-sm bg-gray-800 text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bids && bids.length !== 0 ? (
                bids
                  .filter((bid) => bid.job && bid.job.title)
                  .map((bid) => (
                    <React.Fragment key={bid._id}>
                      <tr
                        className={`hover:bg-gray-700 cursor-pointer transition-colors ${
                          selectedBid?._id === bid._id ? "bg-gray-700" : ""
                        }`}
                        onClick={() => handleRowClick(bid)}
                      >
                        <td className="px-4 py-3">{bid.job.title}</td>
                        <td className="px-4 py-3">${bid.amount}</td>
                        <td className="px-4 py-3">{bid.status}</td>
                      </tr>
                      {selectedBid?._id === bid._id && (
                        <tr>
                          <td colSpan="3" className="p-0">
                            <BidDetails bid={selectedBid} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-center text-gray-400">
                    No bids found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bids;
