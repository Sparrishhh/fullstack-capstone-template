// Step 1 - Task 2: Import necessary packages
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const pino = require('pino');
const connectToDatabase = require('../models/db');  // Make sure path is correct for your project

dotenv.config();  // Step 1 - Task 3: Load env variables

const router = express.Router();
const logger = pino();  // Step 1 - Task 3: Create a Pino logger instance

// Step 1 - Task 4: JWT secret key from .env
const JWT_SECRET = process.env.JWT_SECRET;

// Register route with validation, database, password hashing, and JWT creation
router.post(
  '/register',
  // Input validation with express-validator
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation errors during registration:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Connect to database
      const db = await connectToDatabase();

      // Access users collection
      const collection = db.collection('users');

      // Check for existing email
      const existingEmail = await collection.findOne({ email: req.body.email });
      if (existingEmail) {
        logger.warn(`Attempt to register with existing email: ${req.body.email}`);
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(req.body.password, salt);

      // Save new user in DB
      const newUser = await collection.insertOne({
        email: req.body.email,
        firstName: req.body.firstName || '',
        lastName: req.body.lastName || '',
        password: hashedPassword,
        createdAt: new Date(),
      });

      // Create JWT payload and token
      const payload = {
        user: {
          id: newUser.insertedId,
        },
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      logger.info('User registered successfully:', req.body.email);
      res.status(201).json({ token, email: req.body.email });
    } catch (error) {
      logger.error('Error during user registration:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// LOGIN route
router.post(
  '/login',
  // Validate input
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').exists().withMessage('Password is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation errors during login:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Connect to database
      const db = await connectToDatabase();

      // Access users collection
      const collection = db.collection('users');

      // Find user by email
      const theUser = await collection.findOne({ email: req.body.email });

      if (!theUser) {
        logger.error('User not found:', req.body.email);
        return res.status(404).json({ error: 'User not found' });
      }

      // Compare passwords
      const passwordMatch = await bcryptjs.compare(req.body.password, theUser.password);
      if (!passwordMatch) {
        logger.error('Passwords do not match for user:', req.body.email);
        return res.status(401).json({ error: 'Wrong password' });
      }

      // Fetch user details
      const userName = theUser.firstName || '';
      const userEmail = theUser.email;

      // Create JWT payload and token
      const payload = {
        user: {
          id: theUser._id.toString(),
        },
      };
      const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      // Send response
      res.json({ authtoken, userName, userEmail });
    } catch (error) {
      logger.error('Error during user login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// UPDATE route
router.put(
  '/update',
  [
    // Input validation - customize fields you want to allow updating
    body('firstName').optional().isString().withMessage('First name must be a string'),
    body('lastName').optional().isString().withMessage('Last name must be a string'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if email is present in headers
      const email = req.headers.email;
      if (!email) {
        logger.error('Email not found in the request headers');
        return res.status(400).json({ error: 'Email not found in the request headers' });
      }

      // Connect to MongoDB
      const db = await connectToDatabase();
      const collection = db.collection('users');

      // Find existing user
      const existingUser = await collection.findOne({ email });
      if (!existingUser) {
        logger.error(`User with email ${email} not found`);
        return res.status(404).json({ error: 'User not found' });
      }

      // Update fields from req.body if provided
      if (req.body.firstName !== undefined) existingUser.firstName = req.body.firstName;
      if (req.body.lastName !== undefined) existingUser.lastName = req.body.lastName;

      // If password update provided, hash it
      if (req.body.password !== undefined) {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);
        existingUser.password = hashedPassword;
      }

      existingUser.updatedAt = new Date();

      // Update user in DB and get updated document
      const updatedUserResult = await collection.findOneAndUpdate(
        { email },
        { $set: existingUser },
        { returnDocument: 'after' }
      );
      const updatedUser = updatedUserResult.value;

      // Create new JWT token
      const payload = {
        user: {
          id: updatedUser._id.toString(),
        },
      };
      const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      res.json({ authtoken });
    } catch (e) {
      logger.error('Error in /update route:', e);
      return res.status(500).send('Internal server error');
    }
  }
);

module.exports = router;
