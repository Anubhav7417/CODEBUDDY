'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context';

export function Button({ children, onClick, type = 'button', variant = 'primary', loading = false, className = '' }: any) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        variant === 'primary' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 
        'border border-gray-300 hover:border-blue-500 text-gray-700'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? 'Loading...' : children}
    </motion.button>
  );
}

export function Card({ children, className = '', hover = false, onClick }: any) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -2 } : {}}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
        hover ? 'cursor-pointer hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Input({ label, type = 'text', value, onChange, placeholder, className = '' }: any) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
    </div>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            <span className="text-white font-bold">CS</span>
          </div>
          <span className="text-xl font-bold text-gray-900">CollabSync</span>
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <a href="/auth/login" className="text-gray-700 hover:text-blue-600">Login</a>
            <a href="/auth/register" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Sign Up
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
