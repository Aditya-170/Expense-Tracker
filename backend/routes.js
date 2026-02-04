const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    //  console.log(user);
    const passwordMatch = await bcrypt.compare(password, user.password);
    // console.log("before password match");
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // console.log("after password")
    // console.log("userId"  , user.password);
    res.json({ userId: user.id, email: user.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING email',
      [email, hashedPassword]
    );

    const newUser = result.rows[0];
    res.status(201).json({ userId: newUser.id, email: newUser.email });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/add-expense', async (req, res) => {
  try {
    const { email, title, amount } = req.body;

    if (!email || !title || !amount) {
      return res.status(400).json({ error: 'email, title, and amount required' });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Insert expense into database
    const result = await pool.query(
      'INSERT INTO expenses (email, title, amount) VALUES ($1, $2, $3) RETURNING *',
      [email, title, parseFloat(amount)]
    );

    const expense = result.rows[0];
    res.status(201).json(expense);
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/expenses', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'email required' });
    }

    const result = await pool.query(
      'SELECT * FROM expenses WHERE email = $1 ORDER BY created_at DESC',
      [email]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// router.get('/check', async (req, res) => {
//   try {
//     // console.log("hiii");
//     const { userId } = req.query;

//     // Validate input
//     if (!userId) {
//       return res.status(400).json({ error: 'userId required' });
//     }

//     // Query expenses for this user, ordered by newest first
//     const result = await pool.query(
//       'SELECT MAX(e.amount) FROM expenses e WHERE e.user_id = $1',
//       [userId]
//     );

//     res.json(result.rows);
//   } catch (error) {
//     console.error('Get expenses error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

module.exports = router;