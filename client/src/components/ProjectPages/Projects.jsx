import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRecentProjects, selectRecentProjects } from "../../redux/reducers/dashboard/projectsSlice";
import Sidebar from "../Dashboard/Dashboardcomponents/Sidebar";
import { selectIsSidebarMinimized } from "../../redux/reducers/dashboard/sidebarSlice";
import axiosInstance from "../../api/axiosInstance";
import ProjectDetails from "./ProjectComponents/ProjectDetails";

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectRecentProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const isSidebarMinimized = useSelector(selectIsSidebarMinimized);
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

  const handleRowClick = (project) => {
    if (selectedProject && selectedProject._id === project._id) {
      setSelectedProject(null); // Toggle off if same project is clicked
    } else {
      setSelectedProject(project); // Select new project
    }
  };

  if (loading) {
    return (
      <div className="flex flex-grow p-5 top-16 ml-10 transition-all duration-300">
        <Sidebar />
        <div className="w-10/12 mr-6">
          <div className="text-gray-400">Loading projects...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-grow p-5 top-16 ml-10 transition-all duration-300">
        <Sidebar />
        <div className="w-10/12 mr-6">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-grow p-5 top-16 ${
        isSidebarMinimized ? "ml-5" : "ml-10"
      } transition-all duration-300`}
    >
      <Sidebar />
      <div className="w-10/12 mr-6">
        <h2>Your Projects</h2>
        <div className="w-full">
          <table className="table-auto w-full text-left text-sm bg-gray-800 text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Budget</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects && projects.length !== 0 ? (
                projects.map((project) => (
                  <React.Fragment key={project._id}>
                    <tr
                      className={`hover:bg-gray-700 cursor-pointer transition-colors ${
                        selectedProject?._id === project._id ? "bg-gray-700" : ""
                      }`}
                      onClick={() => handleRowClick(project)}
                    >
                      <td className="px-4 py-3">{project.title}</td>
                      <td className="px-4 py-3">
                        ${project.budget?.min} - ${project.budget?.max}
                      </td>
                      <td className="px-4 py-3">
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
                      </td>
                    </tr>
                    {selectedProject?._id === project._id && (
                      <tr>
                        <td colSpan="3" className="p-0">
                          <ProjectDetails project={selectedProject} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-center text-gray-400">
                    No projects found
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

export default Projects;