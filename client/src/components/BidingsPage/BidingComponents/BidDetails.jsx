import React from "react";

const BidDetails = ({ bid }) => {
  if (!bid || !bid.job) {
    return null;
  }

  return (
    <div className="bg-gray-900 p-6 mt-2 rounded-lg border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Details Card */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Job Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-sm">Title</label>
              <p className="text-gray-200">{bid.job.title}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Description</label>
              <p className="text-gray-200">{bid.job.description}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Budget Range</label>
              <p className="text-gray-200">
                ${bid.job.budget.min} - ${bid.job.budget.max}
              </p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Status</label>
              <p className="text-gray-200">{bid.job.status}</p>
            </div>
          </div>
        </div>

        {/* Bid Details Card */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Bid Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-sm">Your Bid Amount</label>
              <p className="text-gray-200">${bid.amount}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Bid Status</label>
              <p className={`inline-block px-3 py-1 rounded-full text-sm ${
                bid.status === "accepted"
                  ? "bg-green-900 text-green-200"
                  : "bg-yellow-900 text-yellow-200"
              }`}>
                {bid.status}
              </p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Submitted On</label>
              <p className="text-gray-200">
                {new Date(bid.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidDetails;
