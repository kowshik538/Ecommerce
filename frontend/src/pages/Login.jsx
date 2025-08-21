import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    newsletter: true,
    notifications: true
  });

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
          preferences
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-white p-4 bg-[url('https://amcconsult.com/wp-content/uploads/2023/09/Article_Fast-Fashion-1.jpg')] bg-cover">
      <form
  onSubmit={onSubmitHandler}
  className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 sm:p-10 rounded-2xl border border-white/20 
             shadow-xl transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.015] hover:shadow-2xl hover:shadow-white/20"
>
        <h2 className="text-3xl font-semibold text-center mb-6 text-black tracking-wide">
          {currentState === 'Login' ? 'Welcome Back' : 'Create Your Account'}
        </h2>

        {currentState === 'Sign Up' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-white/30 bg-white/5 text-white 
             placeholder-black placeholder-opacity-60 rounded-md focus:ring-2 focus:ring-white outline-none"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-white/30 bg-white/5 text-white 
             placeholder-black placeholder-opacity-60 rounded-md focus:ring-2 focus:ring-white outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // ✅ Fixed typo here
            required
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-white/30 bg-white/5 text-white 
             placeholder-black placeholder-opacity-60 rounded-md focus:ring-2 focus:ring-white outline-none"
          />
        </div>

        {currentState === 'Sign Up' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-3">Preferences</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.newsletter}
                  onChange={(e) => setPreferences(prev => ({ ...prev, newsletter: e.target.checked }))}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-white">Receive newsletter and promotional emails</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-white">Receive order notifications</span>
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 
                   transition-colors duration-200 font-medium text-lg"
        >
          {currentState === 'Login' ? 'Sign In' : 'Create Account'}
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            {currentState === 'Login' 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Sign In"
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
