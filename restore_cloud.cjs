const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Configuration
const MONGO_URI = "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0";
const LOCAL_DB = path.resolve(__dirname, 'db.json');

async function restore() {
  console.log("🛠️ Starting Cloud Data Restore (Seeding)...");
  
  if (!fs.existsSync(LOCAL_DB)) {
    console.error("❌ ERROR: db.json not found locally.");
    return;
  }

  const data = JSON.parse(fs.readFileSync(LOCAL_DB, 'utf8'));
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db('vishnu_statutory');
    const col = db.collection('portal_data');

    const { categories, links, blogs, heroImage, psychologist } = data;
    
    console.log(`📤 Uploading payload with ${links?.length || 0} links and ${categories?.length || 0} categories...`);

    const ops = [
      col.updateOne({ _id: 'categories' }, { $set: { data: categories || [] } }, { upsert: true }),
      col.updateOne({ _id: 'blogs' }, { $set: { data: blogs || [] } }, { upsert: true }),
      col.updateOne({ _id: 'settings' }, { $set: { heroImage: heroImage || '', psychologist: psychologist || {} } }, { upsert: true })
    ];

    // Wipe old sharded and non-sharded links to prevent duplicates
    await col.deleteMany({ _id: { $regex: /^(link_shard_|link_item_)/ } });

    // Shard links individually (same logic as server.cjs)
    if (links) {
      for (const link of links) {
        const linkId = link.id || `l-${Math.random().toString(36).substring(2, 11)}`;
        const serializedLink = JSON.stringify(link);
        const chunkSize = 5 * 1024 * 1024; 
        
        for (let i = 0, part = 0; i < serializedLink.length; i += chunkSize, part++) {
          const chunk = serializedLink.substring(i, i + chunkSize);
          ops.push(col.updateOne(
            { _id: `link_shard_${linkId}_part_${part}` }, 
            { $set: { data: chunk } }, 
            { upsert: true }
          ));
        }
      }
    }

    await Promise.all(ops);
    console.log("✅ SUCCESS: Data restored to MongoDB cloud successfully!");

  } catch (error) {
    console.error("❌ RESTORE FAILED:", error.message);
  } finally {
    await client.close();
  }
}

restore();
