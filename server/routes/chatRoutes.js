const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

// All chat routes require authentication
router.use(authenticateJWT);

// Get all chats for the current user
router.get("/", chatController.getUserChats);

// Get a specific chat by ID
router.get("/:chatId", chatController.getChatById);

// Create a new chat with another user
router.post("/", chatController.createChat);

// Send a message in a chat
router.post("/:chatId/messages", chatController.sendMessage);

// Mark messages as read
router.put("/:chatId/read", chatController.markMessagesAsRead);

// Search users by username for chat
router.get("/search/users", chatController.searchUsers);

module.exports = router;
