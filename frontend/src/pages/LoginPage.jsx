// ========================================
// LOGIN PAGE
// ========================================

import React, { useState } from 'react';
import { loginUser, signupUser } from '../api';
import '../App.css';

const LoginPage = ({ onLoginSuccess }) => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call login API
      const userData = await loginUser(email, password);
      // Pass user data to parent component
      onLoginSuccess(userData);
    } catch (err) {
      // Show error message
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle signup form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call signup API
      const userData = await signupUser(email, password);
      // Auto-login after signup
      onLoginSuccess(userData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isSignup ? handleSignupSubmit : handleLoginSubmit;
  const buttonText = isSignup ? 'Create Account' : 'Login';
  const toggleText = isSignup ? 'Already have an account? Login' : 'New user? Create account';

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="app-title">Expense Tracker</h1>
        <p className="app-subtitle">Manage your expenses with ease</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Show error message if login fails */}
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Loading...' : buttonText}
          </button>
        </form>

        {/* Toggle between login and signup */}
        <button
          className="toggle-button"
          onClick={() => {
            setIsSignup(!isSignup);
            setError('');
            setEmail('');
            setPassword('');
          }}
          disabled={loading}
        >
          {toggleText}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;