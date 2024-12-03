const Notification = require('../models/notification');

// Create a new notification
exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).json({ success: true, notification });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user._id
        });
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user._id,
            isRead: false
        });
        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
