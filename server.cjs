const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const uri = "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

app.get('/api/data', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('vishnu_statutory');
    const data = await db.collection('portal_data').findOne({ _id: 'main' });
    if (data) {
      res.json(data);
    } else {
      res.json({ categories: null, links: null, heroImage: null });
    }
  } catch(e) {
    console.error(e);
    res.json({ categories: null, links: null, heroImage: null });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('vishnu_statutory');
    const payload = { ...req.body, _id: 'main' };
    await db.collection('portal_data').updateOne({ _id: 'main' }, { $set: payload }, { upsert: true });
    res.json({ success: true });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Save failed' });
  }
});

app.listen(3000, () => console.log('Backend listening on port 3000 (MongoDB Connected!)'));
