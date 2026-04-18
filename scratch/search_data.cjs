const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    
    for (const dbInfo of dbs.databases) {
      if (['admin', 'local', 'config'].includes(dbInfo.name)) continue;
      const db = client.db(dbInfo.name);
      console.log(`Checking DB: ${dbInfo.name}`);
      const collections = await db.listCollections().toArray();
      
      for (const colInfo of collections) {
        const col = db.collection(colInfo.name);
        const match = await col.findOne({ $or: [
            { "title": /NSS/i },
            { "data.title": /NSS/i },
            { "data": /NSS/i }
        ]});
        if (match) {
          console.log(`!!! FOUND IN ${dbInfo.name}.${colInfo.name} !!!`);
          console.log(JSON.stringify(match, null, 2));
        }
      }
    }
  } catch (e) { console.error(e); }
  finally { await client.close(); }
}
run();
