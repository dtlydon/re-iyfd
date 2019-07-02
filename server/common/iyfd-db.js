const mongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'iyfd';
let db;

const init = async () => {
	const client = await mongoClient.connect(url, { useNewUrlParser: true });
	db = client.db(dbName);
};
const dbPromise = init();

const getCollection = async (name) => {
	await dbPromise;
	// if (!db) throw Error('Mongo connection failed');

	return db.collection(name);
};

module.exports = {
	getCollection,
};
