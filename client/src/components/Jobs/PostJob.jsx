import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";

const PostJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [categories, setCategories] = useState([]);
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim() || title.length < 5) newErrors.title = "Title must be at least 5 characters";
    if (!description.trim() || description.length < 20) newErrors.description = "Description must be at least 20 characters";
    if (!budgetMin || Number(budgetMin) < 0) newErrors.budgetMin = "Invalid minimum budget";
    if (!budgetMax || Number(budgetMax) <= Number(budgetMin)) newErrors.budgetMax = "Maximum budget must be greater than minimum";
    if (categories.length === 0) newErrors.categories = "At least one category required";
    if (skillsRequired.length === 0) newErrors.skills = "At least one skill required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/jobs/create", {
        title,
        description,
        budget: { min: Number(budgetMin), max: Number(budgetMax) },
        categories,
        skillsRequired,
      });
      navigate(`/jobs/${data._id}`);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Error creating job" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Post a New Job</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold">Job Title</label>
            <input
              type="text"
              className={`w-full p-3 bg-gray-700 border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              placeholder="Enter job title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">Job Description</label>
            <textarea
              className={`w-full p-3 bg-gray-700 border ${errors.description ? 'border-red-500' : 'border-gray-600'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              required
              rows="4"
              placeholder="Enter job description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-semibold">Budget Min</label>
              <input
                type="number"
                className={`w-full p-3 bg-gray-700 border ${errors.budgetMin ? 'border-red-500' : 'border-gray-600'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                disabled={loading}
                required
                placeholder="Minimum budget"
              />
              {errors.budgetMin && <p className="mt-1 text-sm text-red-500">{errors.budgetMin}</p>}
            </div>
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-semibold">Budget Max</label>
              <input
                type="number"
                className={`w-full p-3 bg-gray-700 border ${errors.budgetMax ? 'border-red-500' : 'border-gray-600'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                disabled={loading}
                required
                placeholder="Maximum budget"
              />
              {errors.budgetMax && <p className="mt-1 text-sm text-red-500">{errors.budgetMax}</p>}
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">Categories</label>
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
            {errors.categories && <p className="mt-1 text-sm text-red-500">{errors.categories}</p>}
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={handleCategoryKeyPress}
              disabled={loading}
              placeholder="Type category and press space"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold">Skills Required</label>
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
            {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
            <input
              type="text"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              onKeyDown={handleSkillKeyPress}
              disabled={loading}
              placeholder="Type skill and press space"
            />
          </div>
          {errors.submit && <p className="mt-1 text-sm text-red-500">{errors.submit}</p>}
          <button
            type="submit"
            className={`w-full py-3 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg text-white font-semibold`}
            disabled={loading}
          >
            {loading ? 'Creating Job...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
