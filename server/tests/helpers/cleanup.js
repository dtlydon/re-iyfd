const mongoClient = require('mongodb').MongoClient;

const cleanup = async () => {
  const url = process.env.MONGO_URL;
  const dbName = 'iyfd';
  const client = await mongoClient.connect(url, {
    useNewUrlParser: true
  });
  const db = client.db(dbName);
  try {
    await db.collection('accounts').drop();
  } catch (e) {}
  try {
    await db.collection('entries').drop();
  } catch (e) {}
  try {
    await db.collection('matchups').drop();
  } catch (e) {}
  try {
    await db.collection('choices').drop();
  } catch (e) {}
  process.exit();
};

cleanup();
