/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');
const connectToDatabase = require('./models/db');

const app = express();
const port = 3060;

// Enable CORS for all routes (better to restrict this in production)
app.use(cors());

// Built-in JSON middleware
app.use(express.json());

// Setup pino HTTP logger middleware early
const pinoHttp = require('pino-http');
app.use(pinoHttp({ logger: pinoLogger }));

// Connect to MongoDB once before accepting requests
connectToDatabase()
  .then(() => {
    pinoLogger.info('✅ Connected to MongoDB');
    // Start the server only after DB is connected
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((e) => {
    console.error('❌ Failed to connect to DB:', e);
    process.exit(1); // Exit if DB connection fails
  });

// Route files
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Mount routes
app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);

// Simple root route to confirm server is alive
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Global error handler to catch all errors and respond with JSON
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  // Respond with JSON error so frontend doesn't get HTML
  res.status(500).json({ error: 'Internal Server Error' });
});
