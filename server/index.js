const express = require('express');

const app = express();
const port = 3001;
const accountRoutes = require('./apis/account');
const entriesRoutes = require('./apis/entries');
const matchUpRoutes = require('./apis/matchup');
const { getUserFromRequest } = require('./common/responseHelper');

function buildRoute(api) {
	api.routes.forEach((route) => {
		app[route.method](`${api.baseRoute}${route.path}`, async (req, res) => {
			let token;
			if (route.secure || route.role != null) {
				token = await getUserFromRequest(req, res);
				if (token == null) return;
				if (route.role != null && token.role < route.role) {
					res.status(401);
					res.end();
					return;
				}
			}
			route.handler(req, res, token);
		});
	});
}

function buildRoutes() {
	const apis = [accountRoutes, entriesRoutes, matchUpRoutes];
	apis.forEach((api) => {
		buildRoute(api);
	});
}

app.use(express.json());
buildRoutes();
app.get('/', (req, res) => res.send('hello world'));

app.listen(port, () => console.log('Example!')); // eslint-disable-line no-console
