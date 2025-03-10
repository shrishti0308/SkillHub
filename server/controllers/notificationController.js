const Notification = require("../models/notification");
const { apiSuccess, apiError, apiNotFound } = require("../middleware/response");

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    apiSuccess(res, "Notification created successfully", { notification });
  } catch (error) {
    apiError(res, "Error creating notification", error);
  }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    apiSuccess(res, "Notifications fetched successfully", { notifications });
  } catch (error) {
    apiError(res, "Error fetching notifications", error);
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
      return apiNotFound(res, "Notification not found");
    }
    apiSuccess(res, "Notification marked as read", { notification });
  } catch (error) {
    apiError(res, "Error marking notification as read", error);
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );
    apiSuccess(res, "All notifications marked as read");
  } catch (error) {
    apiError(res, "Error marking all notifications as read", error);
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
    });
    if (!notification) {
      return apiNotFound(res, "Notification not found");
    }
    apiSuccess(res, "Notification deleted successfully");
  } catch (error) {
    apiError(res, "Error deleting notification", error);
  }
};

// Get unread notifications count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false,
    });
    apiSuccess(res, "Unread count fetched successfully", { count });
  } catch (error) {
    apiError(res, "Error fetching unread count", error);
  }
};
