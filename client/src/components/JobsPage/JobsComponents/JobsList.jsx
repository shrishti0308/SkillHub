import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link for navigation
import axiosInstance from "../../../api/axiosInstance";
import {
  selectRecentJobs,
  setRecentJobs,
} from "../../../redux/Features/dashboard/jobsSlice";

const JobsList = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectRecentJobs);

  // Local state to manage jobs to display
  const [jobsToDisplay, setJobsToDisplay] = useState([]);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await axiosInstance.get("/jobs/jobs/filtered");
        console.log(response.data.jobs);

        // Dispatch the data to the global state (redux)
        dispatch(setRecentJobs(response.data.jobs));

        // If more than 5 jobs, slice to get the first 5, else set all jobs
        setJobsToDisplay(
          response.data.jobs.length > 5
            ? response.data.jobs.slice(0, 5)
            : response.data.jobs
        );
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchRecentJobs();
  }, [dispatch]);

  if (jobsToDisplay.length === 0) {
    return <p className="text-white">No jobs available.</p>;
  }

  return (
    <div className="ml-20 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Jobs</h2>

      {/* Table-like layout using grid */}
      <div className="grid grid-cols-4 text-left bg-grey text-cyan-blue font-medium rounded-t-lg">
        <div className="p-3">Job Title</div>
        <div className="p-3">Description</div>
        <div className="p-3">Budget</div>
        <div className="p-3">Status</div>
      </div>

      {/* Map through jobsToDisplay and display entries as buttons */}
      {jobsToDisplay.map((job) => (
        <div
          key={job._id}
          className="grid grid-cols-4 text-left bg-grey text-white border-b border-gray-700 my-2"
        >
          <div className="p-3">
            {/* Link to navigate to JobDetails with jobId */}
            <Link to={`/jobs/${job._id}`}>
              <span className="text-blue-500 hover:underline cursor-pointer">
                {job.title}
              </span>
            </Link>
          </div>
          <div className="p-3">{job.description}</div>
          <div className="p-3">
            ${job.budget.min} - {job.budget.max}
          </div>
          <div className="p-3">
            <span
              className={`px-2 py-1 rounded-full ${
                job.status === "open"
                  ? "border-yellow-500 text-yellow-100"
                  : job.status === "in-progress"
                  ? "border-emerald-500 text-emerald-100"
                  : job.status === "completed"
                  ? "border-indigo-500 text-indigo-100"
                  : "bg-red-500"
              } text-center border text-xs`}
            >
              {job.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobsList;
