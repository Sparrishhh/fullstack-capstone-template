// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

// Get the MongoDB connection URL from the .env file
const url = process.env.MONGO_URL;

// Show a clear error if the environment variable is missing
if (!url) {
  console.error("❌ MONGO_URL is not defined in your .env file. Exiting...");
  process.exit(1);
}

let dbInstance = null;
const dbName = "giftdb"; // Change this if your database is named differently

async function connectToDatabase() {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await client.connect();
    console.log("✅ Connected to MongoDB successfully.");

    dbInstance = client.db(dbName);
    return dbInstance;

  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
}

module.exports = connectToDatabase;
