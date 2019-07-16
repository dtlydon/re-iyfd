// const _ = require('lodash');
// const { checkRequiredField, sendError } = require('../../common/responseHelper');
const { findMatchUps } = require('../matchup/repo');
const { findUserChoicesById, insertUserChoice, updateUserChoice } = require('./repo');
const { getEntryById } = require('../entries/repo');

const baseRoute = '/choices/:userId';

const getUserChoices = async (req, res) => {
	const { userId } = req.params;
	const [currentChoices, matchUps] = await Promise.all([
		findUserChoicesById(userId),
		findMatchUps(),
	]);
	const newChoicePromises = matchUps.map(async (matchUp) => {
		if (!currentChoices.find(choice => choice.matchUpId.equals(matchUp._id))) {
			return insertUserChoice({ userId, matchUpId: matchUp._id, lastUpdated: Date.now() });
		}
		return Promise.resolve();
	});
	await Promise.all(newChoicePromises);
	const newChoices = await findUserChoicesById(userId);
	const userChoices = await Promise.all(
		newChoices.map(async (choice) => {
			const matchUp = matchUps.find(m => m._id.equals(choice.matchUpId));
			const entry1 = await getEntryById(matchUp.entry1);
			const entry2 = await getEntryById(matchUp.entry2);
			return {
				...choice, entry1, entry2,
			};
		}),
	);

	res.send({ userChoices });
	res.end();
};

const makePick = async (req, res) => {
	const { choiceId, choice } = req.body;
	await updateUserChoice(choiceId, choice);
	res.end();
};

const routes = [{
	method: 'get',
	path: '/',
	handler: getUserChoices,
	role: 0,
	checkUser: true,
}, {
	method: 'put',
	path: '/',
	handler: makePick,
	role: 0,
	checkUser: true,
}];

module.exports = {
	baseRoute,
	routes,
};
