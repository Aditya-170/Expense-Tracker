// ========================================
// EXPRESS SERVER
// ========================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow requests from React frontend (localhost:3000)
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});