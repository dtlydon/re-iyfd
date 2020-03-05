// const _ = require('lodash');
const {
  findMatchUps,
  updateMatchUpWinner,
  findMatchUp,
  findNextMatchUp,
  insertMatchUp,
  updateMatchUpEntries,
  updateMatchUpBlocked
} = require('./repo');
const {
  getEntryById
} = require('../entries/repo'); // NOTE: If I ever want to microservice this, I need to re-architect it
const {
  sendError
} = require('../../common/responseHelper');

const _getRegion = (matchUp, newRound) => {
  if (newRound < 5) {
    return matchUp.region;
  }
  // TODO: Update after setttings implemented
  if (newRound === 5) {
    if (matchUp.region === 's' || matchUp.region === 'w') {
      return 'sw';
    }
    return 'emw';
  }
  return 'finals';
};

const _getIsLargeSeed = (seed, maxSeed, round, region, newRegion) => {
  if (round < 5) {
    return seed > maxSeed;
  }
  if (round === 5) {
    if (newRegion === 'sw') {
      return region === 'w';
    }
    return region === 'mw';
  }

  return region === 'sw';
};

const getMatchUps = async (req, res) => {
  const matchUps = await findMatchUps();
  const viewMatchUps = await Promise.all(
    matchUps.map(async (matchUp) => {
      const entry1 = await getEntryById(matchUp.entry1);
      const entry2 = await getEntryById(matchUp.entry2);
      return {
        ...matchUp,
        entry1,
        entry2
      };
    }),
  );
  res.send({
    matchUps: viewMatchUps
  });
  res.end();
};

const pickMatchWinner = async (req, res) => {
  if (!req.params || req.params.id == null) {
    sendError(res, 'Id required');
    return;
  }

  if (!req.body || req.body.winner == null) {
    sendError(res, 'Winner required');
    return;
  }

  await updateMatchUpWinner(req.params.id, req.body.winner);
  const matchUp = await findMatchUp(req.params.id);
  const newRound = matchUp.round + 1;
  if (newRound < 7) {
    const maxSeed = 16 / (2 ** newRound);
    const {
      seed
    } = matchUp;
    const region = _getRegion(matchUp, newRound);
    const isLargerSeed = _getIsLargeSeed(seed, maxSeed, newRound, matchUp.region, region);
    const newSeed = Math.max(isLargerSeed ? (maxSeed * 2) - seed + 1 : seed, 1);
    const existingMatchUp = await findNextMatchUp(newSeed, newRound, region);
    if (existingMatchUp) {
      if (isLargerSeed) {
        existingMatchUp.entry2 = req.body.winner;
      } else {
        existingMatchUp.entry1 = req.body.winner;
      }
      await updateMatchUpEntries(existingMatchUp._id, existingMatchUp.entry1, existingMatchUp.entry2);
    } else {
      const newMatchUp = {
        round: matchUp.round + 1,
        region,
        seed: newSeed,
      };
      if (isLargerSeed) {
        newMatchUp.entry2 = req.body.winner;
      } else {
        newMatchUp.entry1 = req.body.winner;
      }
      await insertMatchUp(newMatchUp);
    }
  }
  getMatchUps(req, res);
};

const setMatchUpBlocked = async (req, res) => {
  await updateMatchUpBlocked(req.params.id, req.body.blocked);
  getMatchUps(req, res);
};

const baseRoute = '/matchups';

const routes = [{
  method: 'get',
  path: '',
  handler: getMatchUps,
  role: 2,
}, {
  method: 'put',
  path: '/:id',
  handler: pickMatchWinner,
  role: 2,
}, {
  method: 'put',
  path: '/:id/block',
  handler: setMatchUpBlocked,
  role: 2
}];

module.exports = {
  baseRoute,
  routes,
};
