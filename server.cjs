const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const DB_FILE = './db.json';

app.get('/api/data', (req, res) => {
  if (fs.existsSync(DB_FILE)) {
    try {
      res.json(JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')));
    } catch(e) {
      res.json({ categories: null, links: null, heroImage: null });
    }
  } else {
    res.json({ categories: null, links: null, heroImage: null });
  }
});

app.post('/api/data', (req, res) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Save failed' });
  }
});

app.listen(3000, () => console.log('Backend listening on port 3000 (No DB Server Required)'));
