import express from 'express';
import http from 'http';
import { Server as socketIO } from 'socket.io';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import Chat from './models/chat.model.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new socketIO(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

let onlineUsers = {};  
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);


io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('joinRoom', (userId) => {
    onlineUsers[userId] = { socketId: socket.id, status: 'online' };
    io.emit('updateUserStatus', { userId, status: 'online' });
  });
  socket.on('sendMessage', async (messageData) => {
    try {
      const { sender, receiver, message } = messageData;

      const newMessage = await Chat.create({ sender, receiver, message });

      if (onlineUsers[receiver]) {
        io.to(onlineUsers[receiver].socketId).emit('receiveMessage', newMessage);
      } else {
        console.log(`Receiver not online: ${receiver}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
  socket.on('receiveMessage', (newMessage) => {
    console.log('New message received:', newMessage);

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  });  
  
  socket.on('disconnect', () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId].socketId === socket.id) {
        io.emit('updateUserStatus', { userId, status: 'offline' });
        delete onlineUsers[userId];
        break;
      }
    }
  });

  socket.on('updateStatus', (userId, status) => {
    if (onlineUsers[userId]) {
      onlineUsers[userId].status = status;
      io.emit('updateUserStatus', { userId, status });
    }
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
