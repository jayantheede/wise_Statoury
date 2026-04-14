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
    
    // Fetch EVERYTHING in the collection
    const allDocs = await col.find({}).toArray();
    const dataMap = Object.fromEntries(allDocs.map(p => [p._id, p]));

    // Reconstruct links from individual link docs
    const individualLinks = allDocs.filter(p => String(p._id).startsWith('link_item_')).map(p => p.data);
    
    let finalData = {};

    if (dataMap.categories || individualLinks.length > 0) {
      finalData = {
        categories: dataMap.categories?.data || [],
        links: individualLinks.length > 0 ? individualLinks : (dataMap.links?.data || []),
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
    console.log(`Incoming Total Payload: ${(size / 1024 / 1024).toFixed(2)} MB`);

    const ops = [
      col.updateOne({ _id: 'categories' }, { $set: { data: categories } }, { upsert: true }),
      col.updateOne({ _id: 'blogs' }, { $set: { data: blogs } }, { upsert: true }),
      col.updateOne({ _id: 'settings' }, { $set: { heroImage, psychologist } }, { upsert: true })
    ];

    // 1. Wipe old individual links to ensure a fresh clean state
    await col.deleteMany({ _id: { $regex: /^link_item_/ } });

    // 2. Save EVERY link as its own individual document
    links.forEach((link, index) => {
      // Use the link's own ID or a generated index-based ID for storage
      const storageId = `link_item_${link.id || index}`;
      ops.push(col.updateOne({ _id: storageId }, { $set: { data: link } }, { upsert: true }));
    });

    await Promise.all(ops);
    res.json({ success: true });
  } catch(error) {
    console.error("Critical Save Error:", error);
    res.status(500).json({ error: 'Database rejected the upload due to size.' });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} with Individual-Link Persistence`));
