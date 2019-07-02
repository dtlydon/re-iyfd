const axios = require('axios'); // eslint-disable-line
const assert = require('assert');
const { describe, it } = require('mocha'); // eslint-disable-line
const { getToken } = require('./helpers/token');

const baseUrl = 'http://localhost:3001';


describe('MatchUps', () => {
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
		const response = await axios.get(`${baseUrl}/matchups`, { headers: { token: getToken() } });
		const { matchUps } = response.data;
		for (let i = 0; i < matchUps.length; i++) {
			const matchUp = matchUps[i];
			// eslint-disable-next-line no-continue
			if (matchUp.round === 2) continue;
			// eslint-disable-next-line no-await-in-loop
			await axios.put(`${baseUrl}/matchups/${matchUp._id}`, { winnerId: matchUp.entry1._id }, { headers: { token: getToken() } });
		}
		const response2 = await axios.get(`${baseUrl}/matchups`, { headers: { token: getToken() } });
		const newMatchUps = response2.data.matchUps;
		assert.equal(response2.data.matchUps.length, 48);
		newMatchUps.filter(m => m.round === 1).forEach((matchUp) => {
			assert.equal(matchUp.winner, matchUp.entry1._id);
		});
	});
});
