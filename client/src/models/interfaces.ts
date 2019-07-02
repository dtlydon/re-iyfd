import {region} from './types';

export interface TournyEntry {
	id: string,
	team: string,
	region: region,
	rank: number,
	teamId?: string
}

export interface Team {
	id: string,
	name: string
}

export interface MatchUp {
	id: string,
	entry1Id: string,
	entry1Name: string,
	entry2Id: string,
	entry2Name: string
}
