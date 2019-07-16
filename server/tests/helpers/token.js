const _tokens = {};
const adminEmail = 'dtlydon@gmail.com';
const basicEmail = 'test@iyfd.com';

const setToken = (email, token) => {
	_tokens[email] = token;
};

const getToken = (email) => {
	if (!email) return _tokens[adminEmail];
	return _tokens[email];
};

module.exports = {
	setToken,
	getToken,
	adminEmail,
	basicEmail,
	getBasicHeaders: () => ({ headers: { token: getToken(basicEmail) } }),
	getAdminHeaders: () => ({ headers: { token: getToken(adminEmail) } }),
};
