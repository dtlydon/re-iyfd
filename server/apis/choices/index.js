// const _ = require('lodash');
// const { checkRequiredField, sendError } = require('../../common/responseHelper');
const {
  findMatchUps,
  findMatchUp
} = require('../matchup/repo');
const {
  getAccountById
} = require('../account/repo');
const {
  findUserChoicesById,
  insertUserChoice,
  updateUserChoice,
  findUserChoiceByMatchUpId
} = require('./repo');
const {
  getEntryById
} = require('../entries/repo');
const {
  sendError
} = require('../../common/responseHelper');

const baseRoute = '/choices/:userId';

const getUserChoices = async (req, res) => {
  const {
    userId
  } = req.params;
  const [currentChoices, matchUps] = await Promise.all([
    findUserChoicesById(userId),
    findMatchUps(),
  ]);
  const newChoicePromises = matchUps.map(async (matchUp) => {
    if (!currentChoices || !currentChoices.find(choice => choice.matchUpId.equals(matchUp._id))) {
      return insertUserChoice({
        userId,
        matchUpId: matchUp._id,
        lastUpdated: Date.now()
      });
    }
    return Promise.resolve();
  });
  await Promise.all(newChoicePromises);
  const newChoices = await findUserChoicesById(userId);
  const userChoices = await Promise.all(
    newChoices.map(async (choice) => {
      const matchUp = matchUps.find(m => m._id.equals(choice.matchUpId));
      const entry1 = await getEntryById(matchUp.entry1);
      const entry2 = await getEntryById(matchUp.entry2);
      return {
        ...choice,
        matchUp: {
          ...matchUp,
          entry1,
          entry2
        }
      };
    }),
  );

  userChoices.sort((a, b) => {
    if (a.matchUp.seed > b.matchUp.seed) return 1;
    else if (a.matchUp.seed < b.matchUp.seed) return -1;
    else return 0;
  })

  res.send({
    userChoices
  });
  res.end();
};

const makePick = async (req, res, token) => {
  const {
    choice,
    matchUpId
  } = req.body;
  const {
    userId
  } = req.params;
  const matchUp = await findMatchUp(matchUpId);
  const account = await getAccountById(token.id);
  if ((!!matchUp.blocked || matchUp.winner != null) && account.role < 2) {
    sendError(res, 'Invalid attempt, match up has been completed.');
    res.end();
    return;
  }
  const choiceUpdate = await findUserChoiceByMatchUpId(userId, matchUpId);
  await updateUserChoice(choiceUpdate._id, choice);
  res.end();
};

const routes = [{
  method: 'get',
  path: '/',
  handler: getUserChoices,
  role: 0,
  checkUser: true,
}, {
  method: 'put',
  path: '/',
  handler: makePick,
  role: 0,
  checkUser: true,
}];

module.exports = {
  baseRoute,
  routes,
};
