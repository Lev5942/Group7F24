const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  } else {
    console.log('Connected to the database.');
    connection.release();
  }
});

// API to fetch streets and their speed limits
app.get('/api/streets', (req, res) => {
  const query = 'SELECT * FROM streets';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching streets:', err);
      return res.status(500).json({ error: 'Error fetching streets' });
    }
    res.status(200).json(results);
  });
});

// API to save trip data
const moment = require('moment');

app.post('/api/saveTrip', (req, res) => {
  const { date, duration, averageSpeed, totalDistance, warnings, tripScore } = req.body;

  // Convert the date to MySQL DATETIME format
  const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');

  if (!formattedDate || !duration || !averageSpeed || totalDistance === undefined || warnings === undefined || tripScore === undefined) {
    console.error('Missing or invalid trip data:', req.body);
    return res.status(400).json({ error: 'Missing or invalid trip data' });
  }

  const query = `
    INSERT INTO trip_history (date, duration, average_speed, total_distance, warnings, trip_score)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [formattedDate, duration, averageSpeed, totalDistance, warnings, tripScore],
    (err, result) => {
      if (err) {
        console.error('Error saving trip data:', err);
        return res.status(500).json({ error: 'Error saving trip data' });
      }
      console.log('Trip data saved to database');
      res.status(200).json({ message: 'Trip data saved successfully' });
    }
  );
});

// API to get trip History
app.get('/api/tripHistory', (req, res) => {
  const query = 'SELECT * FROM trip_history ORDER BY date DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching trip history:', err);
      return res.status(500).json({ error: 'Error fetching trip history' });
    }
    res.status(200).json(results);
  });
});

// API to get Average Score
app.get('/api/averageScore', (req, res) => {
  const query = 'SELECT AVG(trip_score) AS averageScore FROM trip_history';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching average score:', err);
      res.status(500).json({ error: 'Error fetching average score' });
    } else {
      // Use parseFloat to ensure averageScore is a number
      const averageScore = parseFloat(results[0].averageScore) || 0; // Default to 0 if no trips exist
      res.json({ averageScore });
    }
  });
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
