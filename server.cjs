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

app.get('/api/data', (req, res) => {
  console.log("📥 FETCH REQUEST: Checking for data...");
  
  const dbFile = path.resolve(__dirname, 'db.json');
  let localData = null;
  if (fs.existsSync(dbFile)) {
    try {
      localData = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
      console.log(`📦 Found local db.json with ${localData.links?.length || 0} links.`);
    } catch (e) {
      console.error("❌ Error reading local db.json:", e.message);
    }
  }

  // If local data exists and looks rich, serve it immediately
  if (localData && localData.links && localData.links.length > 5) {
    console.log("✅ Serving rich local data.");
    return res.json(localData);
  }

  // Otherwise, try MongoDB as a fallback
  console.log("🔍 Local data missing or thin. Fetching from MongoDB...");
  getCollection().then(col => {
    col.find({}).toArray().then(allDocs => {
      // (Rest of the reconstruction logic...)
      // But for simplicity in this specific fix, we'll assume the local data 
      // is the primary source as requested by the user's recent actions.
      if (allDocs.length > 0) {
          // Logic for reassembling sharded links (reused from original)
          const shards = {};
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
          const reconstructedLinks = Object.keys(shards).map(baseId => {
            const parts = shards[baseId];
            const indices = Object.keys(parts).sort((a, b) => Number(a) - Number(b));
            const fullData = indices.map(i => parts[i]).join('');
            try { return JSON.parse(fullData); } catch (e) { return null; }
          }).filter(Boolean);
          const legacyLinks = allDocs.filter(p => String(p._id).startsWith('link_item_')).map(p => p.data).filter(link => !shards[link.id]);
          const finalData = {
            categories: otherData.categories?.data || [],
            links: [...reconstructedLinks, ...legacyLinks],
            blogs: otherData.blogs?.data || [],
            heroImage: otherData.settings?.heroImage || '',
            psychologist: otherData.settings?.psychologist || {}
          };
          console.log("✅ Serving MongoDB data.");
          return res.json(finalData);
      }
      res.json(localData || {});
    }).catch(err => {
      console.error("MongoDB Query Error:", err);
      res.json(localData || {});
    });
  }).catch(connErr => {
    console.warn("MongoDB Connection Failed. Falling back to local data.");
    res.json(localData || {});
  });
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
      const linkId = link.id || `l-${Math.random().toString(36).substring(2, 11)}`;
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

    // Also persist locally to db.json for robustness
    try {
      const dbFile = path.resolve(__dirname, 'db.json');
      fs.writeFileSync(dbFile, JSON.stringify(req.body, null, 2), 'utf8');
      console.log(`💾 Persisted live update. Payload: ${links.length} links, ${categories.length} categories.`);
      return res.json({ success: true, warning: "Saved locally. MongoDB sync pending." });
    } catch (fsErr) {
      console.error("Local FS Save Error:", fsErr);
    }
  } catch(error) {
    console.error("CRITICAL DATABASE ERROR:", error.message);
    
    // Even if MongoDB fails, we still want to save locally if possible
    try {
      const dbFile = path.resolve(__dirname, 'db.json');
      fs.writeFileSync(dbFile, JSON.stringify(req.body, null, 2), 'utf8');
      console.log("💾 Saved to local db.json despite MongoDB failure.");
      return res.json({ success: true, warning: "Saved locally only. MongoDB connection failed." });
    } catch (fsErr) {
      console.error("Local FS Save Error during DB failure:", fsErr);
    }
    
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} with Deep-Binary-Sharding Engine`));
