const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // For ID queries
const connectToDatabase = require('../models/db');
const logger = require('../logger');
const fs = require('fs');
const path = require('path');

// Path to your gifts.json file
const giftsFilePath = path.join(__dirname, '../util/import-mongo/gifts.json');

// Get all gifts - read from gifts.json file instead of DB
router.get('/', (req, res, next) => {
  logger.info('GET /api/gifts called, serving gifts.json data');
  fs.readFile(giftsFilePath, 'utf8', (err, data) => {
    if (err) {
      logger.error('Error reading gifts.json:', err);
      return next(err);
    }
    try {
      const gifts = JSON.parse(data);
      res.json(gifts);
    } catch (parseError) {
      logger.error('Error parsing gifts.json:', parseError);
      next(parseError);
    }
  });
});

// Get a single gift by MongoDB ObjectId (from DB)
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const gift = await collection.findOne({ _id: new ObjectId(id) });

    if (!gift) {
      return res.status(404).send("Gift not found");
    }

    res.json(gift);
  } catch (e) {
    next(e);
  }
});

// Add a new gift (to DB)
router.post('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("gifts");
    const result = await collection.insertOne(req.body);

    const newGift = await collection.findOne({ _id: result.insertedId });

    res.status(201).json(newGift);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
