const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// PostgreSQL connection configuration
const pool = new Pool({
    user: 'robert',
    host: 'localhost',
    database: 'yarn_app',
    password: 'cookers5',
    port: 5432,
  });

// Test route to check server
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Example route to get data from the database
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
