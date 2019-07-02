// TODO: Use a test framework
const { describe, it, after } = require('mocha'); // eslint-disable-line
const axios = require('axios'); // eslint-disable-line
const assert = require('assert');
const { setToken, getToken } = require('./helpers/token');

const email = 'dtlydon@gmail.com';
const password = 'Test1234';
const baseUrl = 'http://localhost:3001';

describe('accounts', () => {
	it('should register', async () => {
		try {
			const response = await axios.post(`${baseUrl}/account/register`, { email, password });
			assert.equal(response.status, 200);
			assert(response.data.token != null);
		} catch (err) {
			console.error(err);
		}
	});

	it('should login', async () => {
		const response = await axios.post(`${baseUrl}/account/login`, { email, password });
		assert.equal(response.status, 200);
		assert(response.data.token != null);
		setToken(response.data.token); // eslint-disable-line
	});

	it('should add user', async () => {
		const response1 = await axios.post(`${baseUrl}/account/add-user`, { user: 'dan da man 1' }, { headers: { token: getToken() } });
		assert.equal(response1.status, 200);
		const response2 = await axios.post(`${baseUrl}/account/add-user`, { user: 'dan da man 2' }, { headers: { token: getToken() } });
		assert.equal(response2.status, 200);
		const response3 = await axios.post(`${baseUrl}/account/add-user`, { user: 'dan da man 3' }, { headers: { token: getToken() } });
		assert.equal(response3.status, 200);

		const accountResponse = await axios.get(`${baseUrl}/account`, { headers: { token: getToken() } });
		const { account } = accountResponse.data;
		assert.equal(account.users.length, 3);
		assert(account.users.find(x => x.user === 'dan da man 1') != null);
	});
});
