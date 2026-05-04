import User from "../models/User.js";

// Map: userId -> socketId
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
      console.log(`👤 User ${userId} mapped to socket ${socket.id}`);

      // Mark user online
      User.findByIdAndUpdate(userId, { isOnline: true }).catch(console.error);

      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    // Send message
    socket.on("sendMessage", ({ message, receiverId }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
      }
    });

    // Typing
    socket.on("typing", ({ receiverId, senderId }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { senderId });
      }
    });

    socket.on("stopTyping", ({ receiverId, senderId }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { senderId });
      }
    });

    // Disconnect
    socket.on("disconnect", async () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);

      const disconnectedUserId = Object.keys(userSocketMap).find(
        (uid) => userSocketMap[uid] === socket.id
      );

      if (disconnectedUserId) {
        delete userSocketMap[disconnectedUserId];

        try {
          await User.findByIdAndUpdate(disconnectedUserId, {
            isOnline: false,
            lastSeen: new Date(),
          });
        } catch (err) {
          console.error("Error updating user offline:", err);
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });
};
