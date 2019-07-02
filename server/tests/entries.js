const axios = require('axios'); // eslint-disable-line
const assert = require('assert');
const mongoClient = require('mongodb').MongoClient;
const { describe, it, after } = require('mocha'); // eslint-disable-line
const { getToken, setToken } = require('./helpers/token');

const baseUrl = 'http://localhost:3001';
const entries = [];
for (let i = 0; i < 64; i++) {
	const rank = (i % 16) + 1;
	let region = 'mw';
	if (i < 16) {
		region = 's';
	} else if (i < 32) {
		region = 'e';
	} else if (i < 48) {
		region = 'w';
	}
	entries.push({ rank, region, team: `${rank}. ${region}` });
}

let editEntry;

describe('Entries', () => {
	it('should fail, not an admin', async () => {
		try {
			await axios.post(`${baseUrl}/entries`, { entries }, { headers: { token: getToken() } });
			assert(false);
		} catch (err) {
			assert.equal(err.response.status, 401);
		}
	});

	it('should be an admin', async () => {
		try {
			const email = 'dtlydon@gmail.com';
			const password = 'Test1234';
			const url = 'mongodb://localhost:27017';
			const dbName = 'iyfd';
			const client = await mongoClient.connect(url, { useNewUrlParser: true });
			const db = client.db(dbName);
			await db.collection('accounts').updateOne({ email }, { $set: { role: 2 } });
			const response = await axios.post(`${baseUrl}/account/login`, { email, password });
			assert.equal(response.status, 200);
			setToken(response.data.token); // eslint-disable-line
			assert(response.data.token != null);
			const accountResponse = await axios.get(`${baseUrl}/account`, { headers: { token: getToken() } });
			const { account } = accountResponse.data;
			assert.equal(account.role, 2);
		} catch (err) {
			console.log(err);
			assert(false);
		}
	});

	it('should fail, too many entries', async () => {
		try {
			entries.push({ rank: 5, region: 'n', team: 'haha' });
			await axios.post(`${baseUrl}/entries`, { entries }, { headers: { token: getToken() } });
			assert(false);
		} catch (err) {
			assert.equal(err.response.data.error, 'Invalid number of entries');
		}
	});

	it('should fail, incorrect regions', async () => {
		entries.pop();
		entries[0].region = 'n';
		try {
			await axios.post(`${baseUrl}/entries`, { entries }, { headers: { token: getToken() } });
			assert(false);
		} catch (err) {
			assert.equal(err.response.data.error, 'Invalid regions');
		}
	});

	it('should fail, incorrect ranks', async () => {
		entries[0].region = 's';
		entries[0].rank = 5;
		try {
			await axios.post(`${baseUrl}/entries`, { entries }, { headers: { token: getToken() } });
			assert(false);
		} catch (err) {
			assert.equal(err.response.data.error, 'Invalid ranks in region s');
		}
	});

	it('should succeed at creating entries', async () => {
		entries[0].rank = 1;
		const response = await axios.post(`${baseUrl}/entries`, { entries }, { headers: { token: getToken() } });
		assert.equal(response.status, 200);
	});

	it('should get all entries', async () => {
		const response = await axios.get(`${baseUrl}/entries`, { headers: { token: getToken() } });
		assert.equal(response.status, 200);
		[editEntry] = response.data.entries;
		assert.equal(response.data.entries.length, 64);
		assert.equal(editEntry.rank, 1);
		assert.equal(editEntry.region, 's');
	});

	it('should update entry', async () => {
		editEntry.team = 'sessakcaj';
		const response = await axios.put(`${baseUrl}/entries/${editEntry._id}`, { entry: editEntry }, { headers: { token: getToken() } });
		assert.equal(response.status, 200);
		const response2 = await axios.get(`${baseUrl}/entries`, { headers: { token: getToken() } });
		assert.equal(response2.data.entries[0].team, editEntry.team);
	});
});
