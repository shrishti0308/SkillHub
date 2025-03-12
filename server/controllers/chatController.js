const Chat = require("../models/chat");
const User = require("../models/user");
const mongoose = require("mongoose");

// Get all chats for the current user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all chats where the current user is a participant
    const chats = await Chat.find({ participants: userId })
      .populate({
        path: "participants",
        select: "username name info.profilePic",
      })
      .populate({
        path: "messages.sender",
        select: "username name",
      })
      .sort({ lastMessage: -1 });

    // Format the response to include other participant's info
    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (p) => p._id.toString() !== userId
      );

      return {
        _id: chat._id,
        otherUser: otherParticipant,
        lastMessage:
          chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1]
            : null,
        unreadCount: chat.messages.filter(
          (msg) => !msg.read && msg.sender._id.toString() !== userId
        ).length,
        updatedAt: chat.updatedAt,
      };
    });

    res.status(200).json({ success: true, chats: formattedChats });
  } catch (error) {
    console.error("Error getting user chats:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving chats",
      error: error.message,
    });
  }
};

// Get a specific chat by ID
exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Validate chat ID
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid chat ID" });
    }

    // Find the chat and ensure the user is a participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    })
      .populate({
        path: "participants",
        select: "username name info.profilePic",
      })
      .populate({
        path: "messages.sender",
        select: "username name",
      });

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    // Get the other participant's info
    const otherParticipant = chat.participants.find(
      (p) => p._id.toString() !== userId
    );

    res.status(200).json({
      success: true,
      chat: {
        _id: chat._id,
        otherUser: otherParticipant,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error getting chat by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving chat",
      error: error.message,
    });
  }
};

// Create a new chat with another user
exports.createChat = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const userId = req.user.id;

    // Validate recipient ID
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid recipient ID" });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res
        .status(404)
        .json({ success: false, message: "Recipient not found" });
    }

    // Check if a chat already exists between these users
    const existingChat = await Chat.findOne({
      participants: { $all: [userId, recipientId] },
    });

    if (existingChat) {
      return res
        .status(200)
        .json({ success: true, chatId: existingChat._id, existing: true });
    }

    // Create a new chat
    const newChat = new Chat({
      participants: [userId, recipientId],
      messages: [],
      lastMessage: new Date(),
    });

    await newChat.save();

    res
      .status(201)
      .json({ success: true, chatId: newChat._id, existing: false });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({
      success: false,
      message: "Error creating chat",
      error: error.message,
    });
  }
};

// Send a message in a chat
exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Validate chat ID
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid chat ID" });
    }

    // Find the chat and ensure the user is a participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    // Add the new message
    const newMessage = {
      sender: userId,
      content,
      read: false,
    };

    chat.messages.push(newMessage);
    chat.lastMessage = new Date();

    await chat.save();

    // Get the message ID from the saved chat
    const messageId = chat.messages[chat.messages.length - 1]._id;

    // Populate the sender info for the response
    const populatedChat = await Chat.findById(chatId).populate({
      path: "messages.sender",
      select: "username name",
    });

    // Find the specific message by ID
    const sentMessage = populatedChat.messages.find(
      (msg) => msg._id.toString() === messageId.toString()
    );

    if (!sentMessage) {
      return res.status(500).json({
        success: false,
        message: "Error retrieving sent message",
      });
    }

    // Get the other participant's ID for socket notification
    const otherParticipantId = chat.participants.find(
      (p) => p.toString() !== userId
    );

    // Broadcast to the other user via socket if available
    if (req.app.get("io") && otherParticipantId) {
      const io = req.app.get("io");
      const connectedUsers = req.app.get("connectedUsers") || {};

      if (connectedUsers[otherParticipantId]) {
        io.to(connectedUsers[otherParticipantId]).emit("receive_message", {
          chatId,
          message: sentMessage,
        });
      }
    }

    res.status(201).json({ success: true, message: sentMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

// Mark messages as read
exports.markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Validate chat ID
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid chat ID" });
    }

    // Find the chat and ensure the user is a participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    // Get the other participant's ID
    const otherParticipantId = chat.participants.find(
      (p) => p.toString() !== userId
    );

    // Mark all unread messages from the other participant as read
    let updated = false;
    chat.messages.forEach((message) => {
      if (
        !message.read &&
        message.sender.toString() === otherParticipantId.toString()
      ) {
        message.read = true;
        updated = true;
      }
    });

    if (updated) {
      await chat.save();
    }

    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({
      success: false,
      message: "Error marking messages as read",
      error: error.message,
    });
  }
};

// Search users by username for chat
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    // Search for users by username (case-insensitive)
    const users = await User.find({
      _id: { $ne: userId }, // Exclude the current user
      username: { $regex: query, $options: "i" }, // Case-insensitive search
    })
      .select("username name info.profilePic")
      .limit(10);

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "Error searching users",
      error: error.message,
    });
  }
};
