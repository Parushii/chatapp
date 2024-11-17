import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  const handleLogin = async () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/chat'); 
    }
    try {
      const response = await axios.post(
        'https://chatapp-szx4.onrender.com/api/auth/signin',
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200 && response.data) {
        console.log(response.data);
        alert('Login successful!');
        const token = response.data.token; 
        if (token) {
          localStorage.setItem("authToken", token);
          console.log("Token saved:", token);
          localStorage.setItem('user', JSON.stringify(response.data));
          console.log(response.data);
          setUser(JSON.parse(localStorage.getItem('user'))); 
        } else {
          console.warn("Token not provided in the response");
        }
        navigate('/chat');
      } else {
        alert('Login failed: Unexpected response');
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || 'Invalid email or password');
    }
  };
  
  
  

  return (
    <div className="login h-screen w-full flex flex-col justify-center items-center bg-gray-100">
  <h2 className="text-4xl font-semibold text-gray-800 mb-6">Login</h2>
  
  <div className="w-96 p-8 bg-white shadow-lg rounded-lg">
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
      onClick={handleLogin}
    >
      Login
    </button>
    <Link to="/register" className="text-purple-500 text-center block mt-4">Don't have an account? Register</Link>
  </div>
</div>

  );
};

export default Login;
