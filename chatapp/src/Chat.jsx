import React from 'react';
import OnlineUsers from './OnlineUsers';
import ChatWindow from './ChatWindow';

const Chat = ({ users, setReceiver, user, receiver, messages, setMessages, message, setMessage, sendMessage }) => {
  const token = localStorage.getItem("authToken"); 

  if (!token) {
    window.location.href = '/';
    return null; 
  }

  return (
    <div className='flex w-screen'>
      <OnlineUsers users={users} sender={user} setReceiver={setReceiver} />
      <ChatWindow 
        user={user}
        receiver={receiver}
        messages={messages}
        setMessages={setMessages}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default Chat;
