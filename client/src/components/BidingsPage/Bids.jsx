import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectBidsForUser } from "../../redux/reducers/dashboard/bidingSlice";
import BidDetails from "./BidingComponents/BidDetails";
import Sidebar from "../dashboard/dashboardcomponents/Sidebar";
import { selectIsSidebarMinimized } from "../../redux/reducers/dashboard/sidebarSlice";
import { FiSearch, FiFilter } from 'react-icons/fi'; 

const Bids = () => {
  const bids = useSelector(selectBidsForUser);
  const [selectedBid, setSelectedBid] = useState(null);
  const isSidebarMinimized = useSelector(selectIsSidebarMinimized);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAmount, setFilterAmount] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const handleRowClick = (bid) => {
    if (selectedBid && selectedBid._id === bid._id) {
      setSelectedBid(null);
    } else {
      setSelectedBid(bid);
    }
  };

  const filteredBids = useMemo(() => {
    return bids
      ?.filter((bid) => bid.job && bid.job.title)
      .filter((bid) => {
        const matchesSearch = 
          bid.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bid.amount.toString().includes(searchTerm);

        const matchesStatus = 
          filterStatus === "all" || bid.status === filterStatus;

        let matchesAmount = true;
        if (filterAmount === "0-100") {
          matchesAmount = bid.amount <= 100;
        } else if (filterAmount === "101-500") {
          matchesAmount = bid.amount > 100 && bid.amount <= 500;
        } else if (filterAmount === "501-1000") {
          matchesAmount = bid.amount > 500 && bid.amount <= 1000;
        } else if (filterAmount === "1000+") {
          matchesAmount = bid.amount > 1000;
        }

        return matchesSearch && matchesStatus && matchesAmount;
      });
  }, [bids, searchTerm, filterStatus, filterAmount]);

  return (
    <div
      className={`flex flex-grow p-5 top-16 ${
        isSidebarMinimized ? "ml-5" : "ml-10"
      } transition-all duration-300`}
    >
      <Sidebar />
      <div className="w-10/12 mr-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">User Bids</h2>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by project name or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
            >
              <FiFilter />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-700 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount Range
                </label>
                <select
                  value={filterAmount}
                  onChange={(e) => setFilterAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Amounts</option>
                  <option value="0-100">$0 - $100</option>
                  <option value="101-500">$101 - $500</option>
                  <option value="501-1000">$501 - $1000</option>
                  <option value="1000+">$1000+</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="w-full overflow-hidden bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredBids && filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <React.Fragment key={bid._id}>
                    <tr
                      className={`hover:bg-gray-700 cursor-pointer transition-colors ${
                        selectedBid?._id === bid._id ? "bg-gray-700" : ""
                      }`}
                      onClick={() => handleRowClick(bid)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium">{bid.job.title}</div>
                        <div className="text-gray-400 text-xs mt-1">
                          ID: {bid._id.slice(-8)}
                        </div>
                      </td>
                      <td className="px-6 py-4">${bid.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            bid.status === "accepted"
                              ? "bg-green-900 text-green-200"
                              : bid.status === "rejected"
                              ? "bg-red-900 text-red-200"
                              : "bg-yellow-900 text-yellow-200"
                          }`}
                        >
                          {bid.status}
                        </span>
                      </td>
                    </tr>
                    {selectedBid?._id === bid._id && (
                      <tr>
                        <td colSpan="3" className="bg-gray-900">
                          <BidDetails bid={bid} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-400">
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
