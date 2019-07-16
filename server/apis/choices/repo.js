const ObjectId = require('mongodb').ObjectID;
const iyfdDb = require('../../common/iyfd-db');

let choicesCollection;

const init = async () => {
	choicesCollection = await iyfdDb.getCollection('choices');
};

const initialize = init();

const findUserChoices = async () => {
	await initialize;
	return choicesCollection.find({}).toArray();
};

const findUserChoicesById = async (userId) => {
	await initialize;
	return choicesCollection.find({ userId }).toArray();
};

const insertUserChoice = async (choice) => {
	await initialize;
	return choicesCollection.insertOne(choice);
};

const updateUserChoice = async (id, choice) => {
	await initialize;
	return choicesCollection.updateOne(
		{ _id: ObjectId(id) },
		{ $set: { choice: ObjectId(choice), lastUpdated: Date.now() } },
	);
};

module.exports = {
	findUserChoices,
	findUserChoicesById,
	insertUserChoice,
	updateUserChoice,
};
