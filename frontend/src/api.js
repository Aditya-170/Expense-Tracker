// ========================================
// API HELPER - Makes HTTP requests to backend
// ========================================

import axios from 'axios';

// Backend URL - change if your backend runs on a different port
const API_BASE_URL = 'http://localhost:5000/api';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ========================================
// LOGIN: Send email and password
// ========================================
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data; // { userId, email }
  } catch (error) {
    throw error.response?.data?.error || 'Login failed';
  }
};

// ========================================
// SIGNUP: Create a new user account
// ========================================
export const signupUser = async (email, password) => {
  try {
    const response = await api.post('/signup', { email, password });
    return response.data; // { userId, email }
  } catch (error) {
    throw error.response?.data?.error || 'Signup failed';
  }
};

// ========================================
// ADD EXPENSE: Create a new expense
// ========================================
export const addExpense = async (userId, title, amount) => {
  try {
    const response = await api.post('/add-expense', {
      userId,
      title,
      amount,
    });
    return response.data; // { id, user_id, title, amount, created_at }
  } catch (error) {
    throw error.response?.data?.error || 'Failed to add expense';
  }
};

// ========================================
// GET EXPENSES: Fetch all expenses for a user
// ========================================
export const getExpenses = async (userId) => {
  try {
    const response = await api.get('/expenses', {
      params: { userId },
    });
    return response.data; // [{ id, title, amount, created_at }, ...]
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch expenses';
  }
};

export default api;