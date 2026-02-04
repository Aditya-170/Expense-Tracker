
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data; // { userId, email }
  } catch (error) {
    throw error.response?.data?.error || 'Login failed';
  }
};

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
export const addExpense = async (email, title, amount) => {
  try {
    const response = await api.post('/add-expense', {
      email,
      title,
      amount,
    });
    return response.data; 
  } catch (error) {
    throw error.response?.data?.error || 'Failed to add expense';
  }
};

export const getExpenses = async (email) => {
  try {
    const response = await api.get('/expenses', {
      params: { email },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch expenses';
  }
};

export default api;