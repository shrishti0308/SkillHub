import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaPlusCircle } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [categories, setCategories] = useState([]);
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  const handleCategoryKeyPress = (e) => {
    if (e.key === " " && categoryInput.trim()) {
      setCategories([...categories, categoryInput.trim()]);
      setCategoryInput("");
    }
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === " " && skillsInput.trim()) {
      setSkillsRequired([...skillsRequired, skillsInput.trim()]);
      setSkillsInput("");
    }
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const removeSkill = (index) => {
    setSkillsRequired(skillsRequired.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newJob = {
      title,
      description,
      budget: {
        min: budgetMin,
        max: budgetMax,
      },
      categories,
      skillsRequired,
    };

    try {
      await axiosInstance.post("/jobs/create", newJob);
      // Reset form
      setTitle("");
      setDescription("");
      setBudgetMin("");
      setBudgetMax("");
      setCategories([]);
      setSkillsRequired([]);
    } catch (error) {
      console.error("Error posting job", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Post a New Job</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Job Title
            </label>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter job title"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Job Description
            </label>
            <textarea
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              placeholder="Enter job description"
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-semibold">
                Budget Min
              </label>
              <input
                type="number"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                required
                placeholder="Minimum budget"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-semibold">
                Budget Max
              </label>
              <input
                type="number"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                required
                placeholder="Maximum budget"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Categories
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-blue-600 p-2 rounded"
                >
                  <span>{category}</span>
                  <button
                    type="button"
                    className="text-sm text-red-500"
                    onClick={() => removeCategory(index)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={handleCategoryKeyPress}
              placeholder="Type category and press space"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Skills Required
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skillsRequired.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-600 p-2 rounded"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    className="text-sm text-red-500"
                    onClick={() => removeSkill(index)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              onKeyDown={handleSkillKeyPress}
              placeholder="Type skill and press space"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 p-3 rounded text-lg font-semibold hover:bg-blue-700 transition-all"
          >
            <FaPlusCircle className="mr-2" />
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
