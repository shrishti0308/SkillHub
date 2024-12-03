const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');
const { isSuperuser, isAdmin, hasPermission } = require('../middleware/roleCheck');

// Public routes
router.post('/login', adminController.login);

// Protected routes
router.use(adminAuth); // Apply admin authentication middleware to all routes below

// Get current admin
router.get('/current', adminController.getCurrentAdmin);

// Superuser only routes
router.post('/create', hasPermission('manageAdmins'), adminController.createAdmin);
router.get('/all', hasPermission('manageAdmins'), adminController.getAllAdmins);
router.delete('/:id', hasPermission('manageAdmins'), adminController.deleteAdmin);
router.patch('/:id/permissions', hasPermission('manageAdmins'), adminController.updatePermissions);

// Admin and Superuser routes
router.get('/:id', hasPermission('manageAdmins'), adminController.getAdminById);
router.patch('/:id', hasPermission('manageAdmins'), adminController.updateAdmin);

module.exports = router;
