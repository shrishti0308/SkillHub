const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const adminAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, "admin_secret");
        
        // Find admin by id and token
        const admin = await Admin.findById(decoded.adminId).select('-password');
        
        if (!admin) {
            return res.status(401).json({ message: 'Token is invalid' });
        }

        // Check if admin is active
        if (admin.status === 'inactive' || admin.status === 'suspended') {
            return res.status(403).json({ message: 'Account is not active' });
        }

        // Check if account is locked
        if (admin.accountLocked) {
            return res.status(403).json({ message: 'Account is locked' });
        }

        // Add admin to request object
        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid' });
    }
};

module.exports = adminAuth;
