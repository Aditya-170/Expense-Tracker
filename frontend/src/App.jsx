// ========================================
// MAIN APP COMPONENT
// ========================================

import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import './App.css';

const App = () => {
  // State for current user (null if not logged in)
  const [user, setUser] = useState(null);

  // Check if user was previously logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    // Save user to localStorage so they stay logged in on page refresh
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    // Clear user from localStorage
    localStorage.removeItem('user');
  };

  // Show login page if not logged in, otherwise show dashboard
  return (
    <div className="app">
      {user ? (
        <DashboardPage user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;