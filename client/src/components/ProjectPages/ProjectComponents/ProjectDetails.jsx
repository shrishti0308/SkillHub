import React from "react";

const ProjectDetails = ({ project }) => {
  return (
    <div className="p-4 bg-gray-900">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">{project.title}</h3>
          <p className="text-gray-400 mb-2">{project.description}</p>
          
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Required Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {project.skillsRequired?.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {project.categories?.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 rounded-full text-xs"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Project Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Budget:</span>
                <span>${project.budget?.min} - ${project.budget?.max}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span
                  className={`px-2 py-1 ${
                    project.status === "in-progress"
                      ? "text-emerald-500"
                      : project.status === "completed"
                      ? "text-indigo-500"
                      : "text-red-500"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created:</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated:</span>
                <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bid Accepted:</span>
                <span>{project.bidAccepted ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;