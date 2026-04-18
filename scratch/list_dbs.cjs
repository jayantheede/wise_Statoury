const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to Atlas");
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    console.log("Databases:", dbs.databases.map(d => d.name));
    
    for (const dbName of dbs.databases.map(d => d.name)) {
        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log(`DB: ${dbName} -> Collections:`, collections.map(c => c.name));
    }
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await client.close();
  }
}

run();
