let _token;

const setToken = x => _token = x;
const getToken = () => _token;

module.exports = {
	setToken,
	getToken,
};
