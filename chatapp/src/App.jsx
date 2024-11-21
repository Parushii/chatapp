import React, { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Login from './Login';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Chat from './Chat';

// https://chatapp-szx4.onrender.com
const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://localhost:5000/api/user/getusers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log(response.data);
      setOnlineUsers(response.data.users);
      console.log('Users:', response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
    }
  };

  const fetchChatHistory = async (contactId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/getChatHistory/${user._id}/${contactId}`
      );
      setMessages(response.data); 
    } catch (error) {
      console.error('Error fetching chat history:', error.response?.data || error.message);
    }
  };
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit('joinRoom', user._id);
      console.log('User joined room:', user._id);
    }
  
    socket.on('receiveMessage', (newMessage) => {
      console.log('New message received:', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  
    socket.on('updateUserStatus', ({ userId, status }) => {
      console.log(`User ${userId} is now ${status}`);
      setOnlineUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status } : user
        )
      );
    });
  
    return () => {
      socket.off('receiveMessage');
      socket.off('updateUserStatus');
    };
  }, [user]);
  
  const sendMessage = () => {
    if (message.trim() !== '' && receiver) {
      const messageData = {
        sender: user._id,
        receiver: receiver._id,
        message,
      };
      socket.emit('sendMessage', messageData);
      setMessage('');
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: user._id, receiver: receiver._id, message },
      ]);
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (receiver) {
      fetchChatHistory(receiver._id); 
    }
  }, [receiver]);


  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat user={user}
            receiver={receiver}
            messages={messages}
            setMessages={setMessages}
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            users={onlineUsers}
            setReceiver={setReceiver} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
