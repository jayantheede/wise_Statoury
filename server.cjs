const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const dbFile = path.join(__dirname, 'db.json');

app.get('/api/data', (req, res) => {
  try {
    const data = fs.readFileSync(dbFile, 'utf8');
    res.json(JSON.parse(data));
  } catch(e) {
    console.error(e);
    res.json({ categories: [], links: [] });
  }
});

app.post('/api/data', (req, res) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Save failed' });
  }
});

app.listen(3000, () => console.log('Backend listening on port 3000 (Local JSON restored!)'));
