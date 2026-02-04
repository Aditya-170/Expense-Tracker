// ========================================
// DATABASE CONNECTION (Docker PostgreSQL)
// ========================================

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,      // postgres
  user: process.env.DB_USER,      // postgres
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL (Docker)');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;