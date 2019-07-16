const axios = require('axios'); // eslint-disable-line
const assert = require('assert');
const { describe, it } = require('mocha'); // eslint-disable-line
const {
	getToken, getBasicHeaders, getAdminHeaders,
} = require('./helpers/token');

const baseUrl = 'http://localhost:3001';
let testUserId;
let userChoices;

const pickWinnersPerRound = async (round) => {
	const response = await axios.get(`${baseUrl}/matchups`, { headers: { token: getToken() } });
	const { matchUps } = response.data;
	// eslint-disable-next-line no-restricted-syntax
	for (const matchUp of matchUps.filter(m => m.round === round)) {
		// eslint-disable-next-line no-await-in-loop
		await axios.put(`${baseUrl}/matchups/${matchUp._id}`, { winnerId: matchUp.entry1._id }, { headers: { token: getToken() } });
	}
	const response2 = await axios.get(`${baseUrl}/matchups`, { headers: { token: getToken() } });
	return response2.data.matchUps;
};

const simUserPicksPerRound = async (round) => {
	let pickFirstEntry = true;
	const promises = userChoices.filter(x => x.round === round).map(async (userChoice) => {
		const choiceId = userChoice._id;
		const choice = pickFirstEntry ? userChoice.entry1._id : userChoice.entry2._id;
		pickFirstEntry = !pickFirstEntry;
		return axios.put(`${baseUrl}/choices/${testUserId}`, { choiceId, choice, matchUpId: userChoice.matchUpId }, getBasicHeaders());
	});
	await Promise.all(promises);
};

const computeMatchUpLength = (round) => {
	let length = 32;
	for (let i = 0; i < round; i++) {
		length += (16 / (2 ** i));
	}
	return length;
};

const simRoundCompletion = async (round) => {
	const matchUps = await pickWinnersPerRound(round);
	assert.equal(matchUps.length, computeMatchUpLength(round));
	matchUps.filter(m => m.round === round).forEach((matchUp) => {
		assert.equal(matchUp.winner, matchUp.entry1._id);
	});
	matchUps.filter(m => m.round === round + 1).forEach((m) => {
		assert.equal(m.entry1.rank + m.entry2.rank, 1 + Math.max((8 / (2 ** (round - 1))), 1));
		assert.equal(m.entry1.region, m.entry2.region);
	});
};

const refreshUserChoices = async () => {
	const choiceResponse = await axios.get(`${baseUrl}/choices/${testUserId}`, getBasicHeaders());
	// eslint-disable-next-line prefer-destructuring
	userChoices = choiceResponse.data.userChoices;
};

describe('SimulateTourny', () => {
	it('should get all user choices', async () => {
		const response = await axios.get(`${baseUrl}/account`, getBasicHeaders());
		assert.equal(response.status, 200);
		testUserId = response.data.account.users[0].id;
		const choiceResponse = await axios.get(`${baseUrl}/choices/${testUserId}`, getBasicHeaders());
		assert.equal(choiceResponse.status, 200);
		// eslint-disable-next-line prefer-destructuring
		userChoices = choiceResponse.data.userChoices;
	});
	it('should fail with 401 attempting to get another users choices', async () => {
		const adminResponse = await axios.get(`${baseUrl}/account`, getAdminHeaders());
		const adminUserId = adminResponse.data.account.users[0].id;
		try {
			await axios.get(`${baseUrl}/choices/${adminUserId}`, getBasicHeaders());
			assert(false);
		} catch (err) {
			assert.equal(err.response.status, 401);
		}
	});
	it('should get other user choices for admin user', async () => {
		const choiceResponse = await axios.get(`${baseUrl}/choices/${testUserId}`, getAdminHeaders());
		assert.equal(choiceResponse.status, 200);
	});
	it('should make basic first round choices', async () => {
		await simUserPicksPerRound(1);
		const choiceResponse = await axios.get(`${baseUrl}/choices/${testUserId}`, getBasicHeaders());
		choiceResponse.data.userChoices.forEach(choice => assert(choice.choice != null));
	});
	it('should get matchups', async () => {
		const response = await axios.get(`${baseUrl}/matchups`, { headers: { token: getToken() } });
		assert.equal(response.data.matchUps.length, 32);
		assert.equal(response.data.matchUps[0].entry1.rank, 1);
		assert.equal(response.data.matchUps[0].entry2.rank, 16);
	});

	it('should pick a winner', async () => {
		const response = await axios.get(`${baseUrl}/matchups`, { headers: { token: getToken() } });
		const { matchUps } = response.data;
		const [matchUp] = matchUps;
		await axios.put(`${baseUrl}/matchups/${matchUp._id}`, { winnerId: matchUp.entry1._id }, { headers: { token: getToken() } });
		const response2 = await axios.get(`${baseUrl}/matchups`, { headers: { token: getToken() } });
		assert.equal(response2.data.matchUps[0].winner, response2.data.matchUps[0].entry1._id);
		assert.equal(response2.data.matchUps.length, 33);
		assert(response2.data.matchUps[32].entry1 != null);
	});

	it('should complete the first round', async () => {
		await simRoundCompletion(1);
	});

	it('should prevent picks after winner is selected', async () => {
		const choiceResponse = await axios.get(`${baseUrl}/choices/${testUserId}`, getBasicHeaders());
		const userChoice = choiceResponse.data.userChoices[0];
		assert.equal(userChoice.choice, userChoice.entry1._id);
		const choiceId = userChoice._id;
		try {
			await axios.put(`${baseUrl}/choices/${testUserId}`, { choiceId, choice: userChoice.entry2._id, matchUpId: userChoice.matchUpId }, getBasicHeaders());
			assert(false);
		} catch (err) {
			assert.equal(err.response.data.error, 'Invalid attempt, match up has been completed.');
		}
	});

	it('should have first round score', async () => {
		const response = await axios.get(`${baseUrl}/score`);
		assert.equal(response.status, 200);
		const basicUser = response.data.userScores.find(u => u.user.user === 'Test user 1');
		assert.equal(basicUser.score, 16);
	});

	it('should make basic second round choices', async () => {
		await refreshUserChoices();
		await simUserPicksPerRound(2);
		const choiceResponse = await axios.get(`${baseUrl}/choices/${testUserId}`, getBasicHeaders());
		choiceResponse.data.userChoices
			.filter(x => x.round === 2)
			.forEach(choice => assert(choice.choice != null));
	});

	it('should complete the second round', async () => {
		await simRoundCompletion(2);
	});

	it('should have second round score', async () => {
		const response = await axios.get(`${baseUrl}/score`);
		assert.equal(response.status, 200);
		const basicUser = response.data.userScores.find(u => u.user.user === 'Test user 1');
		assert.equal(basicUser.score, 32);
	});

	it('should make basic third round choices', async () => {
		await refreshUserChoices();
		await simUserPicksPerRound(3);
		const choiceResponse = await axios.get(`${baseUrl}/choices/${testUserId}`, getBasicHeaders());
		choiceResponse.data.userChoices
			.filter(x => x.round === 3)
			.forEach(choice => assert(choice.choice != null));
	});

	it('should complete the third round', async () => {
		await simRoundCompletion(3);
	});

	it('should have third round score', async () => {
		const response = await axios.get(`${baseUrl}/score`);
		assert.equal(response.status, 200);
		const basicUser = response.data.userScores.find(u => u.user.user === 'Test user 1');
		assert.equal(basicUser.score, 44);
	});

	it('should make basic fourth round choices', async () => {
		await refreshUserChoices();
		await simUserPicksPerRound(4);
		const choiceResponse = await axios.get(`${baseUrl}/choices/${testUserId}`, getBasicHeaders());
		choiceResponse.data.userChoices
			.filter(x => x.round === 4)
			.forEach(choice => assert(choice.choice != null));
	});

	it('should complete the fourth round', async () => {
		const matchUps5 = await pickWinnersPerRound(4);
		assert.equal(matchUps5.length, 62);
		matchUps5.filter(m => m.round === 5).forEach((matchUp) => {
			if (matchUp.region === 'emw') {
				assert.equal(matchUp.entry1.region, 'e');
				assert.equal(matchUp.entry2.region, 'mw');
			} else {
				assert.equal(matchUp.entry1.region, 's');
				assert.equal(matchUp.entry2.region, 'w');
			}
		});
	});

	it('should have fourth round score', async () => {
		const response = await axios.get(`${baseUrl}/score`);
		assert.equal(response.status, 200);
		const basicUser = response.data.userScores.find(u => u.user.user === 'Test user 1');
		assert.equal(basicUser.score, 52);
	});

	it('should make basic fifth round choices', async () => {
		await refreshUserChoices();
		await simUserPicksPerRound(5);
		const choiceResponse = await axios.get(`${baseUrl}/choices/${testUserId}`, getBasicHeaders());
		choiceResponse.data.userChoices
			.filter(x => x.round === 5)
			.forEach(choice => assert(choice.choice != null));
	});
	it('should complete fifth round', async () => {
		const matchUps6 = await pickWinnersPerRound(5);
		assert.equal(matchUps6.length, 63);
	});

	it('should have fifth round score', async () => {
		const response = await axios.get(`${baseUrl}/score`);
		assert.equal(response.status, 200);
		const basicUser = response.data.userScores.find(u => u.user.user === 'Test user 1');
		assert.equal(basicUser.score, 57);
	});

	it('should make basic final round choices', async () => {
		await refreshUserChoices();
		await simUserPicksPerRound(6);
		const choiceResponse = await axios.get(`${baseUrl}/choices/${testUserId}`, getBasicHeaders());
		choiceResponse.data.userChoices
			.filter(x => x.round === 6)
			.forEach(choice => assert(choice.choice != null));
	});

	it('should have final score', async () => {
		await pickWinnersPerRound(6);
		const response = await axios.get(`${baseUrl}/score`);
		assert.equal(response.status, 200);
		const basicUser = response.data.userScores.find(u => u.user.user === 'Test user 1');
		assert.equal(basicUser.score, 63);
	});
});
