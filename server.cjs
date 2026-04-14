const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));

// 1. Serve static files FIRST
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
    const col = await getCollection();
    
    // Fetch all possible parts. Using regex to find all link chunks.
    const parts = await col.find({ _id: { $in: ['categories', 'blogs', 'settings', 'main'], $regex: /^links_part_/ } }).toArray();
    const dataMap = Object.fromEntries(parts.map(p => [p._id, p]));

    // Reconstruct links from shards
    const linkShards = parts.filter(p => String(p._id).startsWith('links_part_')).sort((a, b) => a._id.localeCompare(b._id));
    const mergedLinks = linkShards.reduce((acc, shard) => acc.concat(shard.data || []), []);

    let finalData = {};

    if (dataMap.categories || mergedLinks.length > 0) {
      finalData = {
        categories: dataMap.categories?.data || [],
        links: mergedLinks.length > 0 ? mergedLinks : (dataMap.links?.data || []),
        blogs: dataMap.blogs?.data || [],
        heroImage: dataMap.settings?.heroImage || '',
        psychologist: dataMap.settings?.psychologist || {}
      };
    } else if (dataMap.main) {
      finalData = dataMap.main;
    } else {
      const dbFile = path.resolve(__dirname, 'db.json');
      finalData = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile, 'utf8')) : { categories: [], links: [] };
    }

    res.json(finalData);
  } catch(e) {
    console.error("Fetch Error:", e);
    const dbFile = path.resolve(__dirname, 'db.json');
    res.json(fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile, 'utf8')) : {});
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const col = await getCollection();
    const { categories, links, blogs, heroImage, psychologist } = req.body;
    
    const size = Buffer.byteLength(JSON.stringify(req.body));
    console.log(`Payload size: ${(size / 1024 / 1024).toFixed(2)} MB`);

    // Chunk the links to stay well under the 16MB limit per doc
    const chunkSize = 5; // Very safe chunk size
    const linkChunks = [];
    for (let i = 0; i < links.length; i += chunkSize) {
      linkChunks.push(links.slice(i, i + chunkSize));
    }

    // Prepare operations
    const ops = [
      col.updateOne({ _id: 'categories' }, { $set: { data: categories } }, { upsert: true }),
      col.updateOne({ _id: 'blogs' }, { $set: { data: blogs } }, { upsert: true }),
      col.updateOne({ _id: 'settings' }, { $set: { heroImage, psychologist } }, { upsert: true })
    ];

    // Clear old link parts before saving new ones (optional, or just overwrite)
    await col.deleteMany({ _id: { $regex: /^links_part_/ } });

    // Add new link parts
    linkChunks.forEach((chunk, index) => {
      ops.push(col.updateOne({ _id: `links_part_${index}` }, { $set: { data: chunk } }, { upsert: true }));
    });

    await Promise.all(ops);
    res.json({ success: true });
  } catch(error) {
    console.error("Save Error:", error);
    res.status(500).json({ error: 'Save failed' });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} with Auto-Sharding Engine`));
