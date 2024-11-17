import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        'https://chatapp-szx4.onrender.com/api/auth/signup',
        { email,username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        alert('Regstration successful!');
      } else {
        alert('Failed to register');
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  

  return (
    <div className="login h-screen w-full flex flex-col justify-center items-center bg-gray-100">
  <h2 className="text-4xl font-semibold text-gray-800 mb-6">Register</h2>
  
  <div className="w-96 p-8 bg-white shadow-lg rounded-lg">
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Enter your username"
      className="w-full p-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
    />
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      className="w-full p-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
    />
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter your password"
      className="w-full p-4 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
    />
    <button
      className="w-full px-4 py-3 text-2xl cursor-pointer rounded-md bg-purple-500 text-white font-bold hover:bg-purple-600 transition-all duration-200"
      onClick={handleRegister}
    >
      Register
    </button>
    <Link to="/" className="text-purple-500 text-center block mt-4">Already have an account? Login</Link>
  </div>
</div>

  );
};

export default Register;
