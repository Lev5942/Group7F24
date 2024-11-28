const express = require('express');
const mysql = require('mysql2'); // Use mysql2 for better compatibility
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config(); // Load environment variables from .env file
const app = express();
const PORT = 5000;

app.use(bodyParser.json()); // Parse JSON request bodies

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Test database connection
db.query('SELECT 1 + 1 AS test', (err, results) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected. Test query result:', results[0].test);
  }
});

// API endpoint for user login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.warn('Warn: Username and password are required');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      return res.status(500).json({ error: 'MySQL query error', details: err });
    }
    if (results.length > 0) {
      console.log('Login successful for user:', username);
      res.status(200).json({ message: 'Success', isLogin: true });
    } else {
      console.log('Login failed: Incorrect username or password');
      res.status(200).json({ message: 'Incorrect username or password', isLogin: false });
    }
  });
});

// API endpoint for fetching streets
app.get('/api/streets', (req, res) => {
  const query = 'SELECT name, speed_limit FROM streets';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching streets:', err);
      return res.status(500).json({ error: 'Error fetching streets', details: err });
    }
    console.log('Fetched streets successfully:', results);
    res.status(200).json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
