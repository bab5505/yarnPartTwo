const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to parse JSON and handle CORS
app.use(express.json());
const allowedOrigins = ['http://localhost:3001', 'https://yarnparttwo.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'robert',
  host: 'localhost',
  database: 'yarn_app',
  password: 'cookers5',
  port: 5432,
});

// Route to fetch inventory items
app.get('/inventory-items', async (req, res) => {
    console.log('GET /inventory-items route hit'); // Add this line
    try {
      const result = await pool.query('SELECT * FROM inventory_items');
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching inventory items:', err);
      res.status(500).json({ error: 'Database query failed' });
    }
  });

  

// Route to add a new inventory item
app.post('/inventory-items', async (req, res) => {
  const { name, quantity, category, note } = req.body;
  try {
    await pool.query(
      'INSERT INTO inventory_items (name, quantity, category, note) VALUES ($1, $2, $3, $4)',
      [name, quantity, category, note]
    );
    res.status(201).json({ message: 'Item added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Route to update an inventory item
app.put('/inventory-items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity, category, note } = req.body;
  try {
    await pool.query(
      'UPDATE inventory_items SET name = $1, quantity = $2, category = $3, note = $4 WHERE id = $5',
      [name, quantity, category, note, id]
    );
    res.json({ message: 'Item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Route to delete an inventory item
app.delete('/inventory-items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM inventory_items WHERE id = $1', [id]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ---------------------------
// Progress Tracker Endpoints
// ---------------------------

// Route to get all progress tracker items
app.get('/progress-tracker', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM progress_tracker');
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching progress tracker items:', err);
      res.status(500).json({ error: 'Database query failed' });
    }
  });
  
  // Route to add a progress tracker item
  app.post('/progress-tracker', async (req, res) => {
    const { item_name, start_time, end_time } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO progress_tracker (item_name, start_time, end_time) VALUES ($1, $2, $3) RETURNING *',
        [item_name, start_time, end_time]
      );
      console.log('Inserted row:', result.rows[0]); // Log the inserted row
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error inserting progress tracker item:', err);
      res.status(500).json({ error: 'Failed to add item' });
    }
  });
  
  // Route to update a progress tracker item
  app.put('/progress-tracker/:id', async (req, res) => {
    const { id } = req.params;
    const { item_name, start_time, end_time } = req.body;
    try {
      await pool.query(
        'UPDATE progress_tracker SET item_name = $1, start_time = $2, end_time = $3 WHERE id = $4',
        [item_name, start_time, end_time, id]
      );
      res.json({ message: 'Item updated' });
    } catch (err) {
      console.error('Error updating progress tracker item:', err);
      res.status(500).json({ error: 'Failed to update item' });
    }
  });
  
  // Route to delete a progress tracker item
  app.delete('/progress-tracker/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM progress_tracker WHERE id = $1', [id]);
      res.json({ message: 'Item deleted' });
    } catch (err) {
      console.error('Error deleting progress tracker item:', err);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });

// ---------------------------
// Projects Endpoints
// ---------------------------

// Route to get all projects
app.get('/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Route to add a project
app.post('/projects', async (req, res) => {
  const { name, description, hook_size, needle_size, yarn_type, color } = req.body;
  try {
    await pool.query(
      'INSERT INTO projects (name, description, hook_size, needle_size, yarn_type, color) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, description, hook_size, needle_size, yarn_type, color]
    );
    res.status(201).json({ message: 'Project added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// Route to update a project
app.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, hook_size, needle_size, yarn_type, color } = req.body;
  try {
    await pool.query(
      'UPDATE projects SET name = $1, description = $2, hook_size = $3, needle_size = $4, yarn_type = $5, color = $6 WHERE id = $7',
      [name, description, hook_size, needle_size, yarn_type, color, id]
    );
    res.json({ message: 'Project updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Route to delete a project
app.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
