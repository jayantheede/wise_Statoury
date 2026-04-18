const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

async function check() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected successfully!");
    const db = client.db('vishnu_statutory');
    const data = await db.collection('portal_data').findOne({ _id: 'main' });
    console.log("DATA_FOUND:", data ? "YES" : "NO");
    if (data) {
        console.log("Categories:", data.categories?.length);
        console.log("Links:", data.links?.length);
    }
  } catch (e) {
    console.error("CONNECTION_ERROR:", e.message);
  } finally {
    await client.close();
  }
}
check();
