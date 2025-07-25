const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // Added ObjectId for proper ID queries
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Get all gifts
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gifts = await collection.find({}).toArray();
        res.json(gifts);
    } catch (e) {
        logger.error('Oops, something went wrong:', e);
        next(e);
    }
});

// Get a single gift by MongoDB ObjectId
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const id = req.params.id;

        // Validate ObjectId format before querying
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

// Add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const result = await collection.insertOne(req.body);

        // Fetch the inserted document by its ObjectId
        const newGift = await collection.findOne({ _id: result.insertedId });

        res.status(201).json(newGift);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
