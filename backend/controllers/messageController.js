import Message from "../models/Message.js";
import User from "../models/User.js";

// @desc    Get messages between two users
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    // Verify the other user exists
    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    // Mark messages as read (messages sent to me by the other user)
    await Message.updateMany(
      { senderId: userId, receiverId: myId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error fetching messages" });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Receiver and text are required" });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text: text.trim(),
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error sending message" });
  }
};

// @desc    Get unread message counts per conversation
// @route   GET /api/messages/unread
// @access  Private
const getUnreadCounts = async (req, res) => {
  try {
    const myId = req.user._id;

    const unreadCounts = await Message.aggregate([
      { $match: { receiverId: myId, read: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);

    // Convert to a map { senderId: count }
    const countMap = {};
    unreadCounts.forEach(({ _id, count }) => {
      countMap[_id.toString()] = count;
    });

    res.json(countMap);
  } catch (error) {
    console.error("Get unread counts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getMessages, sendMessage, getUnreadCounts };
