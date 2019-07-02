const ObjectId = require('mongodb').ObjectID;
const iyfdDb = require('../../common/iyfd-db');

let matchUpCollection;

const init = async () => {
	matchUpCollection = await iyfdDb.getCollection('matchups');
};

const initialize = init();

const insertMatchUps = async (matchUps) => {
	await initialize;
	const results = await matchUpCollection.insertMany(matchUps);
	return results.result.ok;
};

const insertMatchUp = async (matchUp) => {
	await initialize;
	return matchUpCollection.insertOne(matchUp);
};

const findMatchUps = async () => {
	await initialize;
	return matchUpCollection.find({}).toArray();
};

const findMatchUp = async (id) => {
	await initialize;
	return matchUpCollection.findOne({ _id: ObjectId(id) });
};

const updateMatchUpWinner = async (id, winner) => {
	await initialize;
	return matchUpCollection.updateOne({ _id: ObjectId(id) }, { $set: { winner } });
};

const updateMatchUpEntries = async (id, entry1, entry2) => {
	await initialize;
	return matchUpCollection.updateOne({ _id: ObjectId(id) }, { $set: { entry1, entry2 } });
};

const findNextMatchUp = async (seed, round, region) => {
	await initialize;
	return matchUpCollection.findOne({ seed, round, region });
};

module.exports = {
	insertMatchUps,
	insertMatchUp,
	findMatchUps,
	findMatchUp,
	updateMatchUpWinner,
	updateMatchUpEntries,
	findNextMatchUp,
};
