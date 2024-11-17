// chat.controller.js
import Chat from '../models/chat.model.js';
let io;

export const setSocketIoInstance = (socketIoInstance) => {
    io = socketIoInstance;
};

// Export other controller functions like sendMessage and getChatHistory as usual
export const sendMessage = async (req, res) => {
    try {
        const { sender, receiver, message } = req.body;

        // Save the message in the database
        const newMessage = await Chat.create({ sender, receiver, message });

        // Emit the message to the receiver's room (based on receiver ID)
        if (io) {
            io.to(receiver).emit('receiveMessage', newMessage);
        }

        res.status(200).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

  
  export const getChatHistory = async (req, res) => {
    try {
      const { userId, contactId } = req.params;
      const chatHistory = await Chat.find({
        $or: [
          { sender: userId, receiver: contactId },
          { sender: contactId, receiver: userId }
        ]
      }).sort({ createdAt: 1 });
  
      res.status(200).json(chatHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      res.status(500).json({ error: 'Failed to fetch chat history' });
    }
  };
  