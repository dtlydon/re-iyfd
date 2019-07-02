// const _ = require('lodash');
const {
	findMatchUps,
	updateMatchUpWinner,
	findMatchUp,
	findNextMatchUp,
	insertMatchUp,
	updateMatchUpEntries,
} = require('./repo');
const { getEntryById } = require('../entries/repo'); // NOTE: If I ever want to microservice this, I need to re-architect it
const { sendError } = require('../../common/responseHelper');

const _getRegion = (matchUp, newRound) => {
	if (newRound < 5) {
		return matchUp.region;
	}
	// TODO: Update after setttings implemented
	if (newRound === 5) {
		if (matchUp.region === 's' || matchUp.region === 'w') {
			return 'sw';
		}
		return 'emw';
	}
	return 'finals';
};

const getMatchUps = async (req, res) => {
	const matchUps = await findMatchUps();
	const viewMatchUps = await Promise.all(
		matchUps.map(async (matchUp) => {
			const entry1 = await getEntryById(matchUp.entry1);
			const entry2 = await getEntryById(matchUp.entry2);
			return { ...matchUp, entry1, entry2 };
		}),
	);
	res.send({ matchUps: viewMatchUps });
	res.end();
};

const pickMatchWinner = async (req, res) => {
	if (!req.params || req.params.id == null) {
		sendError(res, 'Id required');
		return;
	}

	if (!req.body || req.body.winnerId == null) {
		sendError(res, 'Winner required');
		return;
	}

	await updateMatchUpWinner(req.params.id, req.body.winnerId);
	const matchUp = await findMatchUp(req.params.id);
	const newRound = matchUp.round + 1;
	const maxSeed = 16 / (2 ** newRound);
	const { seed } = matchUp;
	const isLargerSeed = seed > maxSeed;
	const newSeed = isLargerSeed ? (maxSeed * 2) - seed + 1 : seed;
	const region = _getRegion(matchUp, newRound);
	const existingMatchUp = await findNextMatchUp(newSeed, newRound, region);
	if (existingMatchUp) {
		if (isLargerSeed) {
			existingMatchUp.entry2 = req.body.winnerId;
		} else {
			existingMatchUp.entry1 = req.body.winnerId;
		}
		await updateMatchUpEntries(existingMatchUp._id, existingMatchUp.entry1, existingMatchUp.entry2);
	} else {
		const newMatchUp = {
			round: matchUp.round + 1,
			region: matchUp.region,
			seed: newSeed,
		};
		if (isLargerSeed) {
			newMatchUp.entry2 = req.body.winnerId;
		} else {
			newMatchUp.entry1 = req.body.winnerId;
		}
		await insertMatchUp(newMatchUp);
	}
	res.end();
};

const baseRoute = '/matchups';

const routes = [{
	method: 'get',
	path: '',
	handler: getMatchUps,
	role: 2,
}, {
	method: 'put',
	path: '/:id',
	handler: pickMatchWinner,
	role: 2,
}];

module.exports = {
	baseRoute,
	routes,
};
