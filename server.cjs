const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));

// 1. Serve static files FIRST with absolute paths
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// MongoDB Configuration
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(MONGO_URI);
const DB_NAME = 'vishnu_statutory';
const COLLECTION_NAME = 'portal_data';

async function getCollection() {
  await client.connect();
  return client.db(DB_NAME).collection(COLLECTION_NAME);
}

app.get('/api/data', async (req, res) => {
  try {
    const collection = await getCollection();
    let data = await collection.findOne({ _id: 'main' });

    // Seed from db.json if database is empty
    if (!data || !data.categories) {
      try {
        const dbFile = path.resolve(__dirname, 'db.json');
        const raw = fs.readFileSync(dbFile, 'utf8');
        data = JSON.parse(raw);
        data._id = 'main';
        await collection.updateOne({ _id: 'main' }, { $set: data }, { upsert: true });
        console.log("Database seeded from db.json");
      } catch (e) {
        console.error("Seeding failed", e);
      }
    }
    res.json(data);
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const collection = await getCollection();
    
    // Log payload size for debugging
    const size = Buffer.byteLength(JSON.stringify(req.body));
    console.log(`Payload size: ${(size / 1024 / 1024).toFixed(2)} MB`);

    const payload = { ...req.body, _id: 'main' };
    await collection.updateOne({ _id: 'main' }, { $set: payload }, { upsert: true });
    res.json({ success: true });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Save failed' });
  }
});

// Fallback to index.html for SPA routing (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT} with MongoDB connected!`));
