const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
client.connect().then(() => {
  console.log("Connected");
  process.exit(0);
}).catch(e => {
  console.log("Error:", e.message);
  process.exit(1);
});
