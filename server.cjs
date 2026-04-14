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
const client = new MongoClient(MONGO_URI, { 
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000 
});

let dbConnection = null;

async function getCollection() {
  if (!dbConnection) {
    await client.connect();
    dbConnection = client.db('vishnu_statutory').collection('portal_data');
  }
  return dbConnection;
}

app.get('/api/data', async (req, res) => {
  try {
    const collection = await getCollection();
    let data = await collection.findOne({ _id: 'main' });

    // Force seed OR seed if empty
    if (!data || !data.categories || req.query.seed === 'true') {
      try {
        const dbFile = path.resolve(__dirname, 'db.json');
        if (fs.existsSync(dbFile)) {
          const raw = fs.readFileSync(dbFile, 'utf8');
          const seedData = JSON.parse(raw);
          seedData._id = 'main';
          await collection.updateOne({ _id: 'main' }, { $set: seedData }, { upsert: true });
          data = seedData;
          console.log("Database seeded from db.json successfully");
        }
      } catch (e) {
        console.error("Seeding failed", e);
      }
    }
    
    if (!data) {
        return res.json({ categories: [], links: [], blogs: [], heroImage: '' });
    }

    res.json(data);
  } catch(e) {
    console.error("Fetch Error:", e);
    // Fallback to local db.json if MongoDB fails to load quickly
    try {
        const raw = fs.readFileSync(path.resolve(__dirname, 'db.json'), 'utf8');
        res.json(JSON.parse(raw));
    } catch(err) {
        res.status(500).json({ error: 'Database connection failed' });
    }
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const collection = await getCollection();
    
    const size = Buffer.byteLength(JSON.stringify(req.body));
    console.log(`Payload size: ${(size / 1024 / 1024).toFixed(2)} MB`);

    const payload = { ...req.body, _id: 'main' };
    await collection.updateOne({ _id: 'main' }, { $set: payload }, { upsert: true });
    res.json({ success: true });
  } catch(error) {
    console.error("Save Error:", error);
    res.status(500).json({ error: 'Save failed' });
  }
});

// Fallback to index.html for SPA routing (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT} with optimized MongoDB logic`));
