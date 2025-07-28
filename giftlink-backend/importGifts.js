const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = "mongodb://root:zobvjsNMbtvtmji6ArU2FTiV@172.21.240.41:27017/giftlink?authSource=admin";

async function importGifts() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('giftlink');
    const collection = db.collection('gifts');

    const data = fs.readFileSync(path.join(__dirname, 'gifts.json'), 'utf-8');
    const gifts = JSON.parse(data).docs;

    const result = await collection.insertMany(gifts);
    console.log(`Inserted ${result.insertedCount} gifts.`);
  } catch (err) {
    console.error('Failed to import gifts:', err);
  } finally {
    await client.close();
  }
}

importGifts();
