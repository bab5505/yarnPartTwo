const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const inventoryRoutes = require('./src/inventory');  // Adjust path as needed
const progressTrackerRoutes = require('./src/progressTracker');  // Adjust path as needed
const projectRoutes = require('./src/projects');  // Adjust path as needed

const app = express();
// const port = 3000;

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
    user: process.env.DB_USER || 'robert',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'yarn_app',
    password: process.env.DB_PASS || 'cookers5',
    port: process.env.DB_PORT || 5432,
});

// Use routes
app.use('/inventory-items', inventoryRoutes);
app.use('/progress-tracker', progressTrackerRoutes);
app.use('/projects', projectRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
