import axios from 'axios';
import {TournyEntry, Team} from '../models/interfaces'
import urlHelper from '../common/urlHelper';

const teamsApi = `${urlHelper.serviceUrl}/api/teams`;
const entriesApi = `${urlHelper.serviceUrl}/api/entries`;
const matchupsApi = `${urlHelper.serviceUrl}/api/matchups`;

function buildHeaders() {
	return {
		headers: {
			'Content-Type': 'application/json',
			token: localStorage.getItem('token')
		}
	};
}

// TODO: Attempt to add a api request wrapper that adds the token
async function createTeams(entry: TournyEntry) {
	try {
		await axios.post(teamsApi, {name: entry.team}, buildHeaders());
	} catch (err) {
		console.error(err);
	}
}

async function getTeams() {
	return axios.get(teamsApi, buildHeaders());
}

async function createEntry(entry: TournyEntry, teams: any[]){
	const team = teams.find(t => t.Name === entry.team);
	if (team == null) {
		console.error('Missing team', entry);
		return;
	}
	return axios.post(entriesApi, {
		region: entry.region,
		teamId: team.Id,
		rank: parseInt(`${entry.rank}`) // this is hacky..
	}, buildHeaders())
}

async function createEntries(entries: TournyEntry[]): Promise<boolean> {
	// Arg... api is poorly designed... need to fix this
	// when it's redone in nodejs
	// for now assume unique team names
	const promises = entries.map(createTeams);
	await Promise.all(promises);
	const teamsResponse = await getTeams();
	const entryPromises = entries.map(entry => createEntry(entry, teamsResponse.data));
	await entryPromises;
	await axios.post(`${matchupsApi}/generate`, undefined, buildHeaders());
	return true;
}

export default {
	createEntries
}