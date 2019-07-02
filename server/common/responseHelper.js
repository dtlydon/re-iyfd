const jws = require('jws');

const sendError = (res, error) => {
	res.status(400);
	res.send({ error });
};

const checkRequiredField = (field, name, res) => {
	if (field == null || field.length === 0) {
		sendError(res, `${name} is required`);
		return false;
	}
	return true;
};

const getUserFromRequest = (req, res) => {
	if (!req.headers || !req.headers.token) {
		res.status(401);
		return null;
	}
	const { token } = req.headers;
	const decoded = jws.decode(token);
	return JSON.parse(decoded.payload);
};

module.exports = {
	sendError,
	checkRequiredField,
	getUserFromRequest,
};
