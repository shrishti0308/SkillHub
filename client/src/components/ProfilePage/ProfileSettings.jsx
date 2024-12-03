import React, { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfile,
  updateUserProfileThunk,
  selectUserProfile,
  addSkill,
  removeSkill,
  addExperience,
  removeExperience,
  addPreviousWork,
  removePreviousWork,
  updatePreviousWork,
} from "../../redux/Features/user/ProfileSlice";
import ImageUpload from "./ProfileComponents/ImageUpload";
import axiosInstance from "../../api/axiosInstance";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPath, setProfilePicPath] = useState(null);

  const [formData, setFormData] = useState({
    name: userProfile.name || "",
    email: userProfile.email || "",
    bio: userProfile.bio || "",
    skills: userProfile.info?.skills || [""],
    portfolio: userProfile.info?.portfolio || "",
    experience: userProfile.info?.experience || [""],
    previousWorks: userProfile.previousWorks || [
      { title: "", description: "", link: "" },
    ],
    newSkill: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      await dispatch(fetchUserProfile());
    };
    fetchProfile();
  }, [dispatch]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        bio: userProfile.bio,
        skills: userProfile.info.skills,
        portfolio: userProfile.info.portfolio,
        experience: userProfile.info.experience,
        previousWorks: userProfile.previousWorks,
      });
      setProfilePicPath(userProfile.info.profilePic);
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfileThunk(formData));
      if (profilePic) {
        const formDataPic = new FormData();
        formDataPic.append("profilePic", profilePic);
        await axiosInstance.post("/user/upload-profile-pic", formDataPic, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      location.reload(); // Consider using state management instead of reloading
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
    }
  };

  const handleAddSkill = () => {
    if (formData.newSkill.trim()) {
      dispatch(addSkill(formData.newSkill));
      setFormData({ ...formData, newSkill: "" });
    }
  };

  const handleDeleteSkill = (index) => {
    dispatch(removeSkill(index));
  };

  const handleAddExperience = () => {
    dispatch(addExperience());
  };

  const handleDeleteExperience = (index) => {
    dispatch(removeExperience(index));
  };

  const handleAddPreviousWork = () => {
    dispatch(addPreviousWork());
  };

  const handleDeletePreviousWork = (index) => {
    dispatch(removePreviousWork(index));
  };

  const handlePreviousWorksChange = (index, fieldName, value) => {
    dispatch(updatePreviousWork({ index, field: fieldName, value }));
  };

  const handleExperienceChange = (index, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index] = value;
    setFormData({ ...formData, experience: updatedExperience });
  };

  return (
    <div className=" my-10 max-w-5xl mx-auto p-6 bg-dark shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-light pb-6 border-b-4 border-emerald">
        Profile Settings
      </h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        <ImageUpload
          profilePicPath={profilePicPath}
          setProfilePic={setProfilePic}
        />

        <div className="flex flex-col">
          <label className="text-lg font-semibold text-light">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 mt-1 bg-grey border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-semibold text-light">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mt-1 bg-grey border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-semibold text-light">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength="500"
            className="w-full p-3 mt-1 bg-grey border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
          />
        </div>

        {/* Skills Section */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-light">Skills</label>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gray-600 text-light p-2 rounded-full flex items-center"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(index)}
                  className="ml-2 text-red-500"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          {/* New Skill Input */}
          <div className="flex items-center mt-3">
            <input
              type="text"
              value={formData.newSkill}
              onChange={(e) =>
                setFormData({ ...formData, newSkill: e.target.value })
              }
              placeholder="Add a new skill"
              className="w-full p-2 bg-grey border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="ml-2 text-emerald hover:text-indigo-400"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Experience Section */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-light">Experience</label>
          {formData.experience.map((exp, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={exp}
                onChange={(e) => handleExperienceChange(index, e.target.value)} // Update here
                className="w-full p-3 mt-1 bg-grey border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
              />
              <button
                type="button"
                onClick={() => handleDeleteExperience(index)}
                className="ml-2 text-red-500"
              >
                <FaTimes />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddExperience}
            className="mt-3 flex items-center text-emerald hover:text-indigo-400"
          >
            <FaPlus className="mr-2" /> Add Experience
          </button>
        </div>

        {/* Previous Works Section */}
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-light">
            Previous Works
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.previousWorks.map((work, index) => (
              <div
                key={index}
                className="bg-grey p-4 pt-2 rounded-lg shadow-lg space-y-2"
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeletePreviousWork(index)}
                    className="text-red-500"
                  >
                    <FaTimes />
                  </button>
                </div>
                <input
                  type="text"
                  value={work.title}
                  onChange={(e) =>
                    handlePreviousWorksChange(index, "title", e.target.value)
                  }
                  placeholder="Title"
                  className="w-full p-3 bg-dark border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
                />
                <input
                  type="text"
                  value={work.description}
                  onChange={(e) =>
                    handlePreviousWorksChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Description"
                  className="w-full p-3 bg-dark border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
                />
                <input
                  type="text"
                  value={work.link}
                  onChange={(e) =>
                    handlePreviousWorksChange(index, "link", e.target.value)
                  }
                  placeholder="Link"
                  className="w-full p-3 bg-dark border border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald focus:outline-none text-light"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddPreviousWork}
            className="mt-3 flex items-center text-emerald hover:text-indigo-400"
          >
            <FaPlus className="mr-2" /> Add Previous Work
          </button>
        </div>

        <button
          type="submit"
          className="mt-6 bg-white/20 text-light p-2 rounded-lg hover:bg-white/30 transition duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
