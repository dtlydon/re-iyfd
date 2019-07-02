const mongoClient = require('mongodb').MongoClient;

const cleanup = async () => {
	const url = 'mongodb://localhost:27017';
	const dbName = 'iyfd';
	const client = await mongoClient.connect(url, { useNewUrlParser: true });
	const db = client.db(dbName);
	try {
		await db.collection('accounts').drop();
	} catch (e) {
		console.log(e);
	}
	try {
		await db.collection('entries').drop();
	} catch (e) {
		console.log(e);
	}
	try {
		await db.collection('matchups').drop();
	} catch (e) {
		console.log(e);
	}
	process.exit();
};

cleanup();
