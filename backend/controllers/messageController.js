const Conversation = require("../models/Conversation");
const { getReceiverSocketId, io } = require("../socket/socket.js");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const messageController = {
  sendMessage: async (req, res) => {
    try {
      const { message } = req.body;
      const receiverId = req.params.id;
      const senderId = req.user.id;

      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }
      db.query(
        "INSERT INTO messages SET ?",
        {
          senderId: senderId,
          receiverId: receiverId,
          message: message,
        },
        (error, results) => {
          if (error) {
            console.log(error);
          }
          const newMessage = {
            senderId: senderId,
            receiverId: receiverId,
            message: message,
          };
          conversation.messages.push(newMessage);
          conversation.save();
          res.status(201).json(newMessage);
          // SOCKET IO FUNCTIONALITY WILL GO HERE
          const receiverSocketId = getReceiverSocketId(receiverId);
          if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
          }
        }
      );
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getMessages: async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const senderId = req.user.id;

      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, userToChatId] },
      }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES
      if (!conversation) return res.status(200).json([]);
      const messages = conversation.messages;
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = messageController;
