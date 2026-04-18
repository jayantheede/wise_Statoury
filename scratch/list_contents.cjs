const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const col = client.db("vishnu_statutory").collection("portal_data");
  const all = await col.find({}).toArray();
  for (const doc of all) {
     if (doc.data) {
        let content = doc.data;
        if (typeof content === 'string' && content.startsWith('{')) {
          try { content = JSON.parse(content); } catch(e) {}
        }
        if (content.title) {
           console.log(`ID: ${doc._id} | TITLE: ${content.title} | SECTIONS: ${content.sections?.length || 0}`);
        }
     }
  }
  await client.close();
}
run();
