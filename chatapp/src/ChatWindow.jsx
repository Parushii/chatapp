import React, { useEffect, useRef } from 'react';

const ChatWindow = ({ user, receiver, messages, setMessages, message, setMessage, sendMessage }) => {
    const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="h-screen flex flex-col w-3/4 bg-white shadow-lg rounded-lg p-4">
      {receiver ? (
        <>
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Chat with {receiver.username}
          </h2>
          <div className="overflow-y-auto border border-gray-200 rounded-md p-4 mb-4 bg-gray-50">
            {messages.
              //   .filter(
            //     (msg) =>
            //       (msg.sender === user._id && msg.receiver === receiver._id) ||
            //       (msg.sender === receiver._id && msg.receiver === user._id)
            //   )
            map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === user._id
                    ? 'text-right'
                    : 'text-left'
                }`}
              >
                <span
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.sender === user._id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <strong>
                    {msg.sender === user._id ? 'You' : receiver.username}:
                  </strong>{' '}
                  {msg.message}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />

          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className=" w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <h2 className="text-lg text-gray-600 text-center">Select a user to start chatting</h2>
      )}
    </div>
  );
};

export default ChatWindow;
