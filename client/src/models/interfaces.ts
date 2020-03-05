import { region } from "./types";

export interface TournyEntry {
  _id: string;
  team: string;
  region: region;
  rank: number;
}

export interface MatchUp {
  _id: string;
  entry1: TournyEntry;
  entry2: TournyEntry;
  winner: string;
  round: number;
  blocked: boolean;
}

export interface UserChoiceUpdate {
  choice: string; // Entry Id
  matchUpId: string;
}

export interface UserChoice {
  _id: string;
  choice: string;
  matchUp: MatchUp;
}
