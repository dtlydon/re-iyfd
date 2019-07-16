const jws = require('jws');
const bcryptjs = require('bcryptjs');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;
const { checkRequiredField, sendError } = require('../../common/responseHelper');
const {
	createAccount, getAccountByEmail, getAccountById, updateUsersById, getAllAccounts,
} = require('./repo');

const baseRoute = '/account';

// TODO: Change this before deploying
const secret = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAoiOAUK2FFAcO6oxDF2oZhJa1LjfbkWf6kCEIjsAAgjuLr40Y
TRtySyoZLdc+wDXwuBbtf78DvwCzz3WK0s+gJT6FHgXytyfDocA7HWeJGxJwCiqt
qvh9H+sGTch2L3dIVRllmFZwLnkTSzcyt1gJYjLDpXcWeKHkCqlWTIzJvska9KlL
bVZWYZ8KcQWGectS38LSuwfKJtDHC7OhI31OlhytydFAfwASQXsGAny5xTD04+vH
B77S2lW+sIBqEyJjQJguzs6FPHif++MwZZ6zmuhdwdOgDF8hKIwRMaC9PdfNt1lt
dCM0aU/AaLGoFNG2sR1NTmYSAxXqA39xJqNd/QIDAQABAoIBAB6dAV86RAQyCPj0
Hr7PA55rLi5Z0ZU0wrRv6EO7sNzmDUvKIip84ima+0ISgACerqKzgYg7MqPfqBOl
p96B4UTm9w9iJB+83E0wFHlK0TJRWuIwiLXdURKzt278SIRRy1B2CR6oQ2oi5iev
dl3zu2HVH+egApgoSPxSWL7/XiAtX2c9O0LQbQdBlRGeyaV0M4aZ1707stia6LRj
7vvDI0m7zUo6igtVRncBqVGrYgwB36IYjOV46s6nYw3r0q+TjJHpbcAAeEhOC4ha
NDf9xj43MHFo2qtBdl9Uo4VzNI1lhEsJh8Ddo9YP40s918RdEfr07uO24WJaKIOk
QZGE7CkCgYEA1kGtGck8+l+gMBiasyz/S6K4gPnJQXvB7XxO3zV19nYjgPTMPJps
Y9xz4bMwfJZhqWgn5B0zDMCLk5nPaREkpwSyMKvlt+386iLw3vHcqWJDQOirxm2v
dK+XqHVxFogOsf3m3f8ZXowLxK7MvJY8ukKR2M7YxgfKX8Uxj2c//pMCgYEAwbpg
5TdzBtw/OprfMWLv1y7cbNWnoUgBn5r3SWeXkCGlskXGklDAKm/y5tZWjDnGvLuw
YJPylxBaCt7F2G3l0PmcwyT5Q6EGFCM5Tza6FzbA3PMdFyUzTUnt78m+J2Ff+b4L
RE7mu63FN53mWOQlOC4E282tN5k9qSf8bTwBey8CgYAe8YNHexnUayUebR9Ci1gf
m1OcRPb8/xul6dMWR4lO3AcKo9AvXHoU/gy6Zv+0rp9SMRm5x0HNMK231nnvCavK
d1Io11qo8rUZN4ykFjgxOmDOKgxM7yBs8MMtcDCx+Vpt+GZ0X1hRoFY+xKQLBIOm
vuCDeHQ0PYHLzRX4SQgkAwKBgDyfMgsIWvpemXqhVA6EQ0E27Msx4I7blYZ4W8Gg
pRD5Nnye0RCgLEIbXgtWLycaPVJ5+St/oH4dI9Aa/hZH7Y6DTcbTHx1Gmjxa+WgM
XBc/jwKVIRlJDtC0vbw3iUWRdxMToTry5cj9C6Xnx1kxq2P1IpgVuIqZbW4tkRQt
ntkJAoGAc1lIvMpot6XElgxqIAzEX8V5WykZ44t5XFrlcv2+kCkDLJbBt83uoy8D
xaH0lbQkfmdMq0NHwD/ZWPaIuWMb/zr0w90qEwrIA0hMFWdAiTBf/rQVL1nFD1BO
PrpijIRnraWE/BhHt4YS4TKAd8p6xEIeNLtL0BeDEOFGGx4n/+k=
-----END RSA PRIVATE KEY-----
`;

const _createToken = (email, id, role, users) => {
	const token = jws.sign({
		header: { alg: 'RS256' },
		payload: JSON.stringify({
			id, email, role, users,
		}),
		secret,
	});
	return token;
};

const _accountToWire = account => _.omit(account, ['_id', 'password']);

const login = async (req, res) => {
	const { body } = req;
	const validated = (
		checkRequiredField(body.email, 'Email', res)
		&& checkRequiredField(body.password, 'Password', res)
	);
	if (!validated) return;
	const account = await getAccountByEmail(body.email);
	if (!account || !(await bcryptjs.compare(body.password, account.password))) {
		console.log('err');
		sendError(res, 'Invalid email or password');
		return;
	}
	const token = _createToken(account.email, account._id, account.role, account.users);
	res.send({ token });
	res.end();
};

const register = async (req, res) => {
	const { body } = req;
	const validated = (
		checkRequiredField(body.password, 'Password', res)
		&& checkRequiredField(body.email, 'Email', res)
	);
	if (!validated) return;
	const encryptedPass = await bcryptjs.hash(body.password, 10);
	const account = await createAccount(body.email, encryptedPass);
	const token = _createToken(account.email, account.id, 0);
	res.send({ token });
	res.end();
};

const addUser = async (req, res, token) => {
	const { body } = req;
	const validated = checkRequiredField(body.user, 'User', res);
	if (!validated) return;
	const account = await getAccountById(token.id);
	const users = account.users || [];
	users.push({ id: new ObjectId(), user: body.user });
	await updateUsersById(users, token.id);
	const newToken = _createToken(account.email, account._id, account.role, users);
	res.send({ token: newToken });
	res.end();
};

const getAccount = async (req, res, token) => {
	const account = await getAccountById(token.id);
	res.send({ account: _accountToWire(account) });
	res.end();
};

const getAll = async (req, res) => {
	const accounts = await getAllAccounts();
	res.send({ accounts: accounts.map(_accountToWire) });
	res.end();
};

const routes = [{
	method: 'post',
	path: '/login',
	handler: login,
}, {
	method: 'post',
	path: '/register',
	handler: register,
}, {
	method: 'post',
	path: '/add-user',
	handler: addUser,
	role: 0,
}, {
	method: 'get',
	path: '/',
	handler: getAccount,
	role: 0,
}, {
	method: 'get',
	path: '/all',
	handler: getAll,
	role: 2,
}];

module.exports = {
	baseRoute,
	routes,
};
