import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db('vishnu_statutory');
    const collection = db.collection('portal_data');

    if (req.method === 'GET') {
      const data = await collection.findOne({ _id: 'main' });
      if (data) {
        return res.status(200).json(data);
      } else {
        return res.status(200).json({ categories: null, links: null, heroImage: null });
      }
    } else if (req.method === 'POST') {
      const payload = { ...req.body, _id: 'main' };
      await collection.updateOne({ _id: 'main' }, { $set: payload }, { upsert: true });
      return res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
