// ========================================
// DATABASE CONNECTION (Neon PostgreSQL)
// ========================================

const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to Neon PostgreSQL
// You need to set DATABASE_URL in your .env file
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon
});

// Test the connection
pool.on('connect', () => {
  console.log('✓ Connected to Neon PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;