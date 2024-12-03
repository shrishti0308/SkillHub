const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount
} = require('../controllers/notificationController');

// All routes require authentication
router.use(auth);

// Get all notifications for the logged-in user
router.get('/', getUserNotifications);

// Get unread notifications count
router.get('/unread-count', getUnreadCount);

// Create a new notification (typically used internally)
router.post('/', createNotification);

// Mark a specific notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read
router.patch('/mark-all-read', markAllAsRead);

// Delete a specific notification
router.delete('/:id', deleteNotification);

module.exports = router;
