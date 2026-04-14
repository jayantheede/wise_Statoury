const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 1. Serve static files FIRST with absolute paths
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

const dbFile = path.resolve(__dirname, 'db.json');

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

// Fallback to index.html for SPA routing (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
