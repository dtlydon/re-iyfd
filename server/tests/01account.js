// TODO: Use a test framework
const mongoClient = require('mongodb').MongoClient;
const { describe, it } = require('mocha'); // eslint-disable-line
const axios = require('axios'); // eslint-disable-line
const assert = require('assert');
const {
	setToken, getToken, adminEmail, basicEmail,
} = require('./helpers/token');

const email = adminEmail;
const password = 'Test1234';
const baseUrl = 'http://localhost:3001';

describe('accounts', () => {
	it('should register', async () => {
		const response = await axios.post(`${baseUrl}/account/register`, { email, password });
		assert.equal(response.status, 200);
		assert(response.data.token != null);
	});

	it('should login', async () => {
		const response = await axios.post(`${baseUrl}/account/login`, { email, password });
		assert.equal(response.status, 200);
		assert(response.data.token != null);
		setToken(email, response.data.token); // eslint-disable-line
	});

	it('should add user', async () => {
		const token = getToken();
		const response1 = await axios.post(`${baseUrl}/account/add-user`, { user: 'dan da man 1' }, { headers: { token } });
		assert.equal(response1.status, 200);
		assert.notEqual(response1.data.token, token);
		const response2 = await axios.post(`${baseUrl}/account/add-user`, { user: 'dan da man 2' }, { headers: { token } });
		assert.equal(response2.status, 200);
		assert.notEqual(response2.data.token, token);
		assert.notEqual(response2.data.token, response1.data.token);
		const response3 = await axios.post(`${baseUrl}/account/add-user`, { user: 'dan da man 3' }, { headers: { token } });
		assert.equal(response3.status, 200);
		assert.notEqual(response3.data.token, token);
		assert.notEqual(response2.data.token, response3.data.token);

		const accountResponse = await axios.get(`${baseUrl}/account`, { headers: { token: getToken() } });
		const { account } = accountResponse.data;
		assert.equal(account.users.length, 3);
		assert(account.users.find(x => x.user === 'dan da man 1') != null);
	});

	it('should fail, not an admin', async () => {
		try {
			await axios.get(`${baseUrl}/account/all`, { headers: { token: getToken() } });
			assert(false);
		} catch (err) {
			assert.equal(err.response.status, 401);
		}
	});

	it('should be an admin', async () => {
		const url = 'mongodb://localhost:27017';
		const dbName = 'iyfd';
		const client = await mongoClient.connect(url, { useNewUrlParser: true });
		const db = client.db(dbName);
		await db.collection('accounts').updateOne({ email }, { $set: { role: 2 } });
		const response = await axios.post(`${baseUrl}/account/login`, { email, password });
		assert.equal(response.status, 200);
		setToken(email, response.data.token); // eslint-disable-line
		assert(response.data.token != null);
		const accountResponse = await axios.get(`${baseUrl}/account`, { headers: { token: getToken() } });
		const { account } = accountResponse.data;
		assert.equal(account.role, 2);
	});

	it('should get all accounts', async () => {
		const response = await axios.get(`${baseUrl}/account/all`, { headers: { token: getToken() } });
		const { accounts } = response.data;
		assert.equal(accounts.length, 1);
	});

	it('should creates second account', async () => {
		const response = await axios.post(`${baseUrl}/account/register`, { email: basicEmail, password });
		assert.equal(response.status, 200);
		const response1 = await axios.post(`${baseUrl}/account/add-user`, { user: 'Test user 1' }, { headers: { token: response.data.token } });
		assert.equal(response1.status, 200);
		assert(response1.data.token != null);
		setToken(basicEmail, response1.data.token);
	});
});
