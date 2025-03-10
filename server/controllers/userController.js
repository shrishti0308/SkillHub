const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { handleProfilePicUpload } = require("../middlewares/uploadMiddleware");

const {
  apiSuccess,
  apiError,
  apiNotFound,
  apiBadRequest,
  apiUnauthorized,
  apiForbidden,
} = require("../middleware/response");

const jwtSecret = "skill_hub_secret_key";

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, username, email, password, role, bio, info } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return apiBadRequest(res, "User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role,
      bio,
      info,
      wallet: 0,
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, jwtSecret, {
      expiresIn: "1h",
    });

    apiSuccess(res, "User registered successfully", {
      token,
      role: newUser.role,
      username: newUser.username,
    });
  } catch (error) {
    apiError(res, "Error registering user", error);
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  try {
    // Find user by either username or email
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
    if (!user) return apiBadRequest(res, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return apiUnauthorized(res, "Invalid credentials");

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
      expiresIn: "1h",
    });

    apiSuccess(res, "User logged in successfully", {
      token,
      role: user.role,
      username: user.username,
    });
  } catch (error) {
    apiError(res, "Error logging in", error);
  }
};

// Get logged-in user's profile
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return apiNotFound(res, "User not found");

    apiSuccess(res, "User profile fetched successfully", { user: user });
  } catch (error) {
    apiError(res, "Error fetching user profile", error);
  }
};

exports.updateUserProfile = async (req, res) => {
  const { name, bio, skills, experience, portfolio, previousWorks } = req.body;

  try {
    // Retrieve the current user data
    const user = await User.findById(req.user.id);

    if (!user) {
      return apiNotFound(res, "User not found");
    }

    // Merge the existing `info` object with the new fields
    const updatedInfo = {
      ...user.info, // Keep existing data
      skills: skills || user.info.skills, // Update only if new data is provided
      portfolio: portfolio || user.info.portfolio,
      experience: experience || user.info.experience,
    };

    // Update the user profile
    await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        bio,
        info: updatedInfo, // Use the merged info object
        previousWorks: previousWorks || user.previousWorks, // Keep previous works if not provided
      },
      { new: true }
    );

    apiSuccess(res, "Profile updated successfully");
  } catch (error) {
    apiError(res, "Error updating profile", error);
  }
};

// Upload profile picture
exports.uploadProfilePic = [
  handleProfilePicUpload,
  (req, res) => {
    if (req.profilePicPath) {
      apiSuccess(res, "Profile picture uploaded successfully", {
        profilePic: req.profilePicPath,
      });
    } else {
      apiBadRequest(res, "No picture uploaded");
    }
  },
];

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return apiNotFound(res, "User not found");
    }
    res.json(user);
  } catch (error) {
    apiError(res, "Server error", error);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    apiSuccess(res, "Users fetched successfully", { users: users });
  } catch (error) {
    apiError(res, "Error fetching users", error);
  }
};

// Delete a user by Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return apiNotFound(res, "User not found");

    apiSuccess(res, "User deleted successfully");
  } catch (error) {
    apiError(res, "Error deleting user", error);
  }
};
