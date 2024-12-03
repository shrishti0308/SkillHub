import React, { useState } from "react";
import ReactStars from "react-stars";

const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  rating,
  setRating,
  comment,
  setComment,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="review-modal"
      className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50 overflow-y-auto h-screen"
      aria-hidden={!isOpen}
    >
      <div className="relative w-full max-w-2xl p-4 h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-600 rounded-t">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add Your Review
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-2 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Rating
              </label>
              <ReactStars
                count={5}
                onChange={setRating}
                size={30}
                value={rating}
                color2={"#ffd700"}
                className="w-auto"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Comment
              </label>
              <textarea
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment..."
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end p-5 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              className="text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={onSubmit}
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
