require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;
const accountRoutes = require("./apis/account");
const entriesRoutes = require("./apis/entries");
const matchUpRoutes = require("./apis/matchup");
const choicesRoutes = require("./apis/choices");
const scoreRoutes = require("./apis/score");
const announcementRoutes = require('./apis/announcement');
const {
  getUserFromRequest,
  sendError
} = require("./common/responseHelper");

function buildRoute(api) {
  api.routes.forEach(route => {
    app[route.method](`${api.baseRoute}${route.path}`, async (req, res) => {
      const token = await getUserFromRequest(req, res);
      if (route.role != null) {
        if (token == null || (route.role != null && token.role < route.role)) {
          res.status(401);
          res.end();
          return;
        }
      }
      if (route.checkUser) {
        if (!req.params.userId) {
          sendError("Request requires a userId which was not supplied");
          return;
        }
        const {
          userId
        } = req.params;
        if (token.role < 2 && !token.users.find(u => u.id === userId)) {
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
  const apis = [
    accountRoutes,
    entriesRoutes,
    matchUpRoutes,
    choicesRoutes,
    scoreRoutes,
    announcementRoutes
  ];
  apis.forEach(api => {
    buildRoute(api);
  });
}

app.use(express.json());
app.use(cors());
buildRoutes();
app.get("/", (req, res) => res.send("hello world"));

app.listen(port, () => console.log("Example!")); // eslint-disable-line no-console
