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
    const allDocs = await col.find({}).toArray();
    
    // 1. Group shards by their base ID
    const shards = {}; // { link_item_id: { 0: data, 1: data } }
    const otherData = {};

    allDocs.forEach(doc => {
      const id = String(doc._id);
      if (id.startsWith('link_shard_')) {
        const match = id.match(/^link_shard_(.+)_part_(\d+)$/);
        if (match) {
          const [_, baseId, partIndex] = match;
          if (!shards[baseId]) shards[baseId] = {};
          shards[baseId][partIndex] = doc.data;
        }
      } else {
        otherData[id] = doc;
      }
    });

    // 2. Reassemble sharded links
    const reconstructedLinks = Object.keys(shards).map(baseId => {
      const parts = shards[baseId];
      const indices = Object.keys(parts).sort((a, b) => Number(a) - Number(b));
      const fullData = indices.map(i => parts[i]).join('');
      try {
        return JSON.parse(fullData);
      } catch (e) {
        console.error("Failed to reassemble link", baseId);
        return null;
      }
    }).filter(Boolean);

    // 3. Fallback for non-sharded links (if any stay in old format)
    const legacyLinks = allDocs.filter(p => String(p._id).startsWith('link_item_')).map(p => p.data);
    const finalLinks = [...reconstructedLinks, ...legacyLinks];

    const finalData = {
      categories: otherData.categories?.data || [],
      links: finalLinks,
      blogs: otherData.blogs?.data || [],
      heroImage: otherData.settings?.heroImage || '',
      psychologist: otherData.settings?.psychologist || {}
    };

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
    
    console.log(`Incoming Total Payload Size: ${(Buffer.byteLength(JSON.stringify(req.body)) / 1024 / 1024).toFixed(2)} MB`);

    const ops = [
      col.updateOne({ _id: 'categories' }, { $set: { data: categories } }, { upsert: true }),
      col.updateOne({ _id: 'blogs' }, { $set: { data: blogs } }, { upsert: true }),
      col.updateOne({ _id: 'settings' }, { $set: { heroImage, psychologist } }, { upsert: true })
    ];

    // Wipe old sharded and non-sharded links
    await col.deleteMany({ _id: { $regex: /^(link_shard_|link_item_)/ } });

    // Shard each link individually
    for (const link of links) {
      const linkId = link.id || `l-${Math.random().toString(36).substr(2, 9)}`;
      const serializedLink = JSON.stringify(link);
      const chunkSize = 5 * 1024 * 1024; // 5MB safe chunks
      
      for (let i = 0, part = 0; i < serializedLink.length; i += chunkSize, part++) {
        const chunk = serializedLink.substring(i, i + chunkSize);
        ops.push(col.updateOne(
          { _id: `link_shard_${linkId}_part_${part}` }, 
          { $set: { data: chunk } }, 
          { upsert: true }
        ));
      }
    }

    await Promise.all(ops);
    res.json({ success: true });
  } catch(error) {
    console.error("CRITICAL DATABASE ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} with Deep-Binary-Sharding Engine`));
