/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const pinoLogger = require('./logger');
const connectToDatabase = require('./models/db');

const app = express();
const port = 3060;

// Enable CORS for all routes (better to restrict this in production)
app.use(cors());

// Built-in JSON middleware
app.use(express.json());

// Serve static files from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Setup pino HTTP logger middleware early
const pinoHttp = require('pino-http');
app.use(pinoHttp({ logger: pinoLogger }));

// Route files
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes'); // <-- Import authRoutes here

// Mount routes
app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes); // <-- Use authRoutes at /api/auth

// Simple root route to confirm server is alive
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Connect to MongoDB once before accepting requests
connectToDatabase()
  .then(() => {
    pinoLogger.info('✅ Connected to MongoDB');
    // Start the server only after DB is connected
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((e) => {
    console.error('❌ Failed to connect to DB:', e);
    process.exit(1); // Exit if DB connection fails
  });

// Global error handler to catch all errors and respond with JSON
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});
