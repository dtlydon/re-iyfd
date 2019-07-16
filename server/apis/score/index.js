const { getAllAccounts } = require('../account/repo');
const { findUserChoices } = require('../choices/repo');
const { findMatchUps } = require('../matchup/repo');

const baseRoute = '/score';

const getScores = async (req, res) => {
	const [accounts, userChoices, matchUps] = await Promise.all([
		getAllAccounts(),
		findUserChoices(),
		findMatchUps(),
	]);
	const winnerMappings = {};
	// eslint-disable-next-line no-restricted-syntax
	for (const matchUp of matchUps) {
		winnerMappings[matchUp._id] = {
			winner: matchUp.winner,
			round: matchUp.round,
		};
	}
	const userIdScore = {};
	userChoices.forEach((choice) => {
		if (!userIdScore[choice.userId]) {
			userIdScore[choice.userId] = 0;
		}
		if (winnerMappings[choice.matchUpId] != null
			&& choice.choice != null && choice.choice.equals(winnerMappings[choice.matchUpId].winner)) {
			userIdScore[choice.userId] += winnerMappings[choice.matchUpId].round;
		}
	});
	const userScores = accounts.reduce((scores, account) => {
		account.users.forEach((user) => {
			scores.push({ user, score: userIdScore[user.id] });
		});
		return scores;
	}, []);
	res.send({ userScores });
	res.end();
};

const routes = [{
	method: 'get',
	path: '/',
	handler: getScores,
}];

module.exports = {
	baseRoute,
	routes,
};
