import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRecentProjects, selectRecentProjects } from "../../../redux/reducers/dashboard/projectsSlice";
import axiosInstance from "../../../api/axiosInstance";

const ProjectsSummary = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectRecentProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/project/recent-projects");
        console.log(response.data);
        dispatch(setRecentProjects(response.data.recentProjects));
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch projects");
      }
      setLoading(false);
    };

    fetchProjects();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl font-semibold mb-6">Your Projects</h2>
        <div className="text-gray-400">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl font-semibold mb-6">Your Projects</h2>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-xl font-semibold mb-6">Your Projects</h2>

      {/* Header Row */}
      <div className="grid grid-cols-4 text-left bg-grey text-cyan-blue font-medium rounded-t-lg">
        <div className="p-3">Title</div>
        <div className="p-3">Description</div>
        <div className="p-3">Budget</div>
        <div className="p-3">Status</div>
      </div>

      {/* Projects List */}
      <div className="divide-y divide-gray-200">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} className="grid grid-cols-4 text-left bg-grey text-white border-none my-2">
              <div className="p-3 truncate">{project.title}</div>
              <div className="p-3 truncate">{project.description}</div>
              <div className="p-3">${project.budget?.min} - ${project.budget?.max}</div>
              <div className="p-3">
                <span
                  className={`px-2 py-1 ${
                    project.status === "in-progress"
                      ? "border-emerald-500 text-emerald-100"
                      : project.status === "completed"
                      ? "border-indigo-500 text-indigo-100"
                      : "bg-red-500"
                  } text-center border text-xs`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">
            No projects found
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSummary;
