require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function main() {
  const uri = process.env.MONGO_URL;
  if (!uri) {
    console.error('MONGO_URL is not set in .env');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('giftlink');
    const collection = db.collection('gifts');

    // Read gifts.json
    const filePath = path.join(__dirname, 'gifts.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);

    // Extract array of gift documents inside "docs"
    const gifts = json.docs;

    // Insert documents
    const result = await collection.insertMany(gifts);
    console.log(`Inserted documents: ${result.insertedCount}`);

  } catch (err) {
    console.error('Error importing gifts:', err);
  } finally {
    await client.close();
  }
}

main();
