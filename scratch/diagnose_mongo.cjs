const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function check() {
  try {
    await client.connect();
    const db = client.db('vishnu_statutory');
    const col = db.collection('portal_data');
    const count = await col.countDocuments();
    const all = await col.find({}, { projection: { _id: 1 } }).toArray();
    console.log("Total documents:", count);
    console.log("Document IDs:", all.map(d => d._id));
    
    // Check if any link_shard exists
    const shards = await col.find({ _id: { $regex: /^link_shard_/ } }).toArray();
    console.log("Total shards:", shards.length);
    
    // Check for categories
    const cats = await col.findOne({ _id: 'categories' });
    console.log("Categories found:", !!cats);
    if (cats) console.log("Category count:", cats.data?.length);

  } catch (e) {
    console.log("Error:", e.message);
  } finally {
    await client.close();
  }
}
check();
