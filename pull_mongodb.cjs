const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGO_URI = "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0";
const LOCAL_DB = path.resolve(__dirname, 'db_recovered.json');

async function run() {
  const client = new MongoClient(MONGO_URI);
  try {
    console.log("🔗 Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("✅ Connected successfully!");

    const db = client.db('vishnu_statutory');
    const col = db.collection('portal_data');

    const allDocs = await col.find({}).toArray();
    console.log(`📥 Fetched ${allDocs.length} documents.`);

    if (allDocs.length === 0) {
      console.log("⚠️ No documents found in collection.");
      return;
    }

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
      try {
        return JSON.parse(fullData);
      } catch (e) {
        console.error(`❌ Error parsing reconstructed link ${baseId}`);
        return null;
      }
    }).filter(Boolean);

    const legacyLinks = allDocs
      .filter(p => String(p._id).startsWith('link_item_'))
      .map(p => p.data)
      .filter(link => !shards[link.id]);

    const finalData = {
      categories: otherData.categories?.data || [],
      links: [...reconstructedLinks, ...legacyLinks],
      blogs: otherData.blogs?.data || [],
      heroImage: otherData.settings?.heroImage || '',
      psychologist: otherData.settings?.psychologist || {}
    };

    fs.writeFileSync(LOCAL_DB, JSON.stringify(finalData, null, 2), 'utf8');
    console.log(`✅ SUCCESS: Data saved to ${path.basename(LOCAL_DB)}`);
    console.log(`📊 Stats: ${finalData.categories.length} Categories, ${finalData.links.length} Links.`);

  } catch (error) {
    console.error("❌ FAILED:", error.message);
  } finally {
    await client.close();
  }
}

run();
