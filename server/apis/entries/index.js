const _ = require('lodash');
const {
  insertEntries,
  getEntries,
  updateById
} = require('./repo');
const {
  insertMatchUps
} = require('../matchup/repo'); // NOTE: If I ever want to microservice this, I need to re-architect it
const {
  sendError
} = require('../../common/responseHelper');


const _validateEntries = (body, res) => {
  if (!body.entries) {
    sendError(res, 'No data supplied');
    return false;
  }
  const {
    entries
  } = body;
  if (entries.length !== 64) {
    sendError(res, 'Invalid number of entries');
    return false;
  }

  const groupedEntries = _.groupBy(entries, 'region');
  const regions = Object.keys(groupedEntries);
  if (regions.length !== 4 ||
    groupedEntries.e == null ||
    groupedEntries.w == null ||
    groupedEntries.mw == null ||
    groupedEntries.s == null) {
    sendError(res, 'Invalid regions');
    return false;
  }
  for (let iRegion = 0; iRegion < regions.length; iRegion++) {
    const region = regions[iRegion];
    const regionEntries = groupedEntries[region];
    if (regionEntries.length !== 16) {
      console.error(regionEntries);
      sendError(res, `Invalid ranks in region ${region}`);
      return false;
    }
    regionEntries.sort((a, b) => a.rank - b.rank);
    for (let iEntry = 0; iEntry < regionEntries.length; iEntry++) {
      if (regionEntries[iEntry].rank !== iEntry + 1) {
        console.error('mismatched order', regionEntries[iEntry].rank, iEntry + 1)
        sendError(res, `Invalid ranks in region ${region}`);
        return false;
      }
    }
  }
  return true;
};

const _buildMatchUps = (entries) => {
  const matchUps = [];
  const groupedEntries = _.groupBy(entries, 'region');
  const regions = Object.keys(groupedEntries);
  for (let iRegion = 0; iRegion < regions.length; iRegion++) {
    const region = regions[iRegion];
    const regionEntries = groupedEntries[region];
    for (let rank = 1; rank <= 8; rank++) {
      const entry1 = regionEntries.find(e => e.rank === rank);
      const entry2 = regionEntries.find(e => e.rank === 17 - rank);
      matchUps.push({
        region,
        entry1: entry1._id,
        entry2: entry2._id,
        round: 1,
        seed: rank,
        blocked: false
      });
    }
  }
  return matchUps;
};

const createEntries = async (req, res) => {
  const {
    body
  } = req;
  if (!_validateEntries(body, res)) return;

  await insertEntries(body.entries);
  const entries = await getEntries();
  const matchUps = _buildMatchUps(entries);
  await insertMatchUps(matchUps);
  res.send({
    entries
  });
  res.end();
};

const getAllEntries = async (req, res) => {
  const entries = await getEntries();
  res.send({
    entries
  });
  res.end();
};

const editEntry = async (req, res) => {
  if (!req.params || req.params.id == null) {
    sendError(res, 'Id required');
    return;
  }

  if (!req.body || req.body.entry == null) {
    sendError(res, 'Entry required');
    return;
  }

  await updateById(req.params.id, req.body.entry);
  res.end();
};

const baseRoute = '/entries';

const routes = [{
  method: 'post',
  path: '',
  handler: createEntries,
  role: 2,
}, {
  method: 'get',
  path: '',
  handler: getAllEntries,
  role: 2,
}, {
  method: 'put',
  path: '/:id',
  handler: editEntry,
  role: 2,
}];

module.exports = {
  baseRoute,
  routes,
};
