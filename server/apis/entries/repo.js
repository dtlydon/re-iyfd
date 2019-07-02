const ObjectId = require('mongodb').ObjectID;
const iyfdDb = require('../../common/iyfd-db');

let entriesCollection;

const init = async () => {
	entriesCollection = await iyfdDb.getCollection('entries');
};

const initialize = init();

const insertEntries = async (entries) => {
	await initialize;
	const results = await entriesCollection.insertMany(entries);
	return results.result.ok;
};

const getEntries = async () => {
	await initialize;
	return entriesCollection.find({}).toArray();
};

const getEntryById = async (id) => {
	await initialize;
	return entriesCollection.findOne({ _id: ObjectId(id) });
};

const updateById = async (id, entry) => {
	await initialize;
	const { team } = entry; // Team is all I'm allowing... for now
	return entriesCollection.updateOne({ _id: ObjectId(id) }, { $set: { team } });
};

module.exports = {
	insertEntries,
	getEntries,
	getEntryById,
	updateById,
};
