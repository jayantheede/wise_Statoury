const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGO_URI = "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(MONGO_URI);

async function recover() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db('vishnu_statutory');
    const col = db.collection('portal_data');
    
    console.log("Fetching all documents...");
    const allDocs = await col.find({}).toArray();
    console.log(`Found ${allDocs.length} documents in cloud.`);

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
    
    const cloudLinks = [...reconstructedLinks, ...legacyLinks];
    console.log(`Successfully reconstructed ${cloudLinks.length} links from cloud.`);

    // Load local db.json
    const dbFile = path.resolve(__dirname, 'db.json');
    let localData = { categories: [], links: [], blogs: [], heroImage: '', psychologist: {} };
    if (fs.existsSync(dbFile)) {
      localData = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    }

    // MERGE: Keep cloud data if it's newer or different
    // For this recovery, we'll just show the difference
    cloudLinks.forEach(cl => {
        const local = localData.links.find(l => l.id === cl.id);
        if (!local) {
            console.log(`✨ NEW Link in cloud: ${cl.title} (${cl.id})`);
            localData.links.push(cl);
        } else {
            // Check if sections are different (more sections in cloud?)
            if ((cl.sections?.length || 0) > (local.sections?.length || 0)) {
                console.log(`🔄 UPDATED Link in cloud (more sections): ${cl.title}`);
                Object.assign(local, cl);
            }
        }
    });

    if (otherData.blogs && otherData.blogs.data) {
        localData.blogs = otherData.blogs.data;
    }
    if (otherData.settings) {
        localData.heroImage = otherData.settings.heroImage || localData.heroImage;
        localData.psychologist = otherData.settings.psychologist || localData.psychologist;
    }

    fs.writeFileSync(dbFile, JSON.stringify(localData, null, 2), 'utf8');
    console.log("✅ Merged cloud data into db.json. Please check the portal now.");

  } catch (e) {
    console.error("Recovery failed:", e);
  } finally {
    await client.close();
  }
}

recover();
