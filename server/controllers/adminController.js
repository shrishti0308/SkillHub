const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new admin
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = new Admin({
            name,
            email,
            password: hashedPassword,
            role
        });

        await admin.save();
        
        res.status(201).json({
            message: 'Admin created successfully',
            admin: { name: admin.name, email: admin.email, role: admin.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
};

// Admin login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin and include password for comparison
        const admin = await Admin.findOne({ email }).select('+password');
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            admin.loginAttempts += 1;
            if (admin.loginAttempts >= 5) {
                admin.accountLocked = true;
            }
            await admin.save();
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Reset login attempts on successful login
        admin.loginAttempts = 0;
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, role: admin.role},
            "admin_secret",
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

// Get all admins (superuser only)
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins', error: error.message });
    }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin', error: error.message });
    }
};

// Update admin
exports.updateAdmin = async (req, res) => {
    try {
        const updates = req.body;
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 12);
        }

        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({
            message: 'Admin updated successfully',
            admin
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin', error: error.message });
    }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
    try {
        const adminToDelete = await Admin.findById(req.params.id);
        if (!adminToDelete) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Prevent self-deletion
        if (req.admin.id === req.params.id) {
            return res.status(403).json({ message: 'You cannot delete your own account' });
        }

        // Prevent deletion of last superuser
        if (adminToDelete.role === 'superuser') {
            const superuserCount = await Admin.countDocuments({ role: 'superuser' });
            if (superuserCount <= 1) {
                return res.status(403).json({ 
                    message: 'Cannot delete the last superuser account' 
                });
            }
        }

        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting admin', error: error.message });
    }
};

// Update admin permissions
exports.updatePermissions = async (req, res) => {
    try {
        const { permissions } = req.body;
        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { $set: { permissions } },
            { new: true, runValidators: true }
        );

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json({
            message: 'Permissions updated successfully',
            admin
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating permissions', error: error.message });
    }
};

// Get current admin
exports.getCurrentAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admin data', error: error.message });
    }
};
