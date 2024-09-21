const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { handleProfilePicUpload } = require('../middlewares/uploadMiddleware');

const jwtSecret = 'skill_hub_secret_key';

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, username, email, password, role, bio, info } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });

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
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, jwtSecret, { expiresIn: '1h' });
        res.status(201).json({ success: true, token, role: newUser.role });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error registering user', error });
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        // Find user by either username or email
        const user = await User.findOne({ $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }] });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ success: true, token, role: user.role });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in', error });
    }
};


// Get logged-in user's profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user profile', error });
    }
};

// Update logged-in user's profile
exports.updateUserProfile = async (req, res) => {
    const { name, bio, info, skills, portfolio } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.id, {
            name,
            bio,
            info: { skills, portfolio },
        }, { new: true });

        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating profile', error });
    }
};


// Upload profile picture
exports.uploadProfilePic = [handleProfilePicUpload, (req, res) => {
    if (req.profilePicPath) {
        return res.status(200).json({ success: true, message: 'Profile picture uploaded successfully', profilePic: req.profilePicPath });
    } else {
        return res.status(400).json({ success: false, message: 'No picture uploaded' });
    }
}];

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users', error });
    }
};

// Delete a user by Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting user', error });
    }
};
