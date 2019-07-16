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
		let isOne = true;
		const promises = userChoices.map(async (userChoice) => {
			const choiceId = userChoice._id;
			const choice = isOne ? userChoice.entry1._id : userChoice.entry2._id;
			isOne = !isOne;
			return axios.put(`${baseUrl}/choices/${testUserId}`, { choiceId, choice }, getBasicHeaders());
		});
		await Promise.all(promises);
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
		const matchUps = await pickWinnersPerRound(1);
		assert.equal(matchUps.length, 48);
		matchUps.filter(m => m.round === 1).forEach((matchUp) => {
			assert.equal(matchUp.winner, matchUp.entry1._id);
		});
		matchUps.filter(m => m.round === 2).forEach((m) => {
			assert.equal(m.entry1.rank + m.entry2.rank, 9);
			assert.equal(m.entry1.region, m.entry2.region);
		});
	});

	it('should have a score', async () => {
		const response = await axios.get(`${baseUrl}/score`);
		assert.equal(response.status, 200);
		const basicUser = response.data.userScores.find(u => u.user.user === 'Test user 1');
		assert.equal(basicUser.score, 16);
	});

	it('should complete tourny', async () => {
		const matchUps3 = await pickWinnersPerRound(2);
		assert.equal(matchUps3.length, 56);
		const matchUps4 = await pickWinnersPerRound(3);
		assert.equal(matchUps4.length, 60);
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
		const matchUps6 = await pickWinnersPerRound(5);
		assert.equal(matchUps6.length, 63);
	});
});
