// ========================================
// API ROUTES
// ========================================

const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const router = express.Router();

// ========================================
// 1. LOGIN ROUTE
// POST /api/login
// Body: { email, password }
// Returns: { userId, email } if login successful
// ========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Query user from database
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // User doesn't exist
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Compare password with hashed password using bcryptjs
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Login successful - return user info
    // In a real app, you'd create a session/token here
    res.json({ userId: user.id, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================================
// 2. SIGNUP ROUTE (helper for testing)
// POST /api/signup
// Body: { email, password }
// Returns: { userId, email }
// ========================================
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    const newUser = result.rows[0];
    res.status(201).json({ userId: newUser.id, email: newUser.email });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================================
// 3. ADD EXPENSE ROUTE
// POST /api/add-expense
// Body: { userId, title, amount }
// Returns: { id, userId, title, amount, created_at }
// ========================================
router.post('/add-expense', async (req, res) => {
  try {
    const { userId, title, amount } = req.body;

    // Validate input
    if (!userId || !title || !amount) {
      return res.status(400).json({ error: 'userId, title, and amount required' });
    }

    // Validate amount is a number
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Insert expense into database
    const result = await pool.query(
      'INSERT INTO expenses (user_id, title, amount) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, parseFloat(amount)]
    );

    const expense = result.rows[0];
    res.status(201).json(expense);
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ========================================
// 4. GET EXPENSES ROUTE
// GET /api/expenses?userId=123
// Returns: [{ id, title, amount, created_at }, ...]
// ========================================
router.get('/expenses', async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    // Query expenses for this user, ordered by newest first
    const result = await pool.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;