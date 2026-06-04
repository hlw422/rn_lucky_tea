const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.TIDB_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.TIDB_PORT || process.env.DB_PORT) || 4000,
  user: process.env.TIDB_USER || process.env.DB_USER || 'root',
  password: process.env.TIDB_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'luckin_coffee',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: (process.env.TIDB_SSL || process.env.DB_SSL) === 'true' ? { rejectUnauthorized: true } : undefined,
});

module.exports = pool;
