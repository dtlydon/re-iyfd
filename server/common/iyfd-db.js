const mongoClient = require('mongodb').MongoClient;

const url = process.env.MONGO_URL;
const dbName = 'iyfd';
let db;

const init = async () => {
  const client = await mongoClient.connect(url, {
    useNewUrlParser: true
  });
  db = client.db(dbName);
};
const dbPromise = init();

const getCollection = async (name) => {
  await dbPromise;
  // if (!db) throw Error('Mongo connection failed');

  return db.collection(name);
};

const getDb = async () => {
  await dbPromise;
  return db;
}

module.exports = {
  getCollection,
  getDb
};
