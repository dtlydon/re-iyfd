import { MatchUp } from "../models/interfaces";
import { region } from "../models/types";
export const getCurrentRound = (matchUps: MatchUp[]) => {
  const latestRound = matchUps.reduce(
    (latest: number, matchUp: MatchUp) =>
      matchUp.round > latest ? matchUp.round : latest,
    1
  );
  const hasFinishedRoundBefore = !matchUps
    .filter(matchUp => matchUp.round === latestRound - 1)
    .find(matchUp => !matchUp.winner);
  if (hasFinishedRoundBefore) return latestRound;
  return latestRound - 1;
};

export const getRegionName = (r: region) => {
  switch (r) {
    case "s":
      return "South";
    case "e":
      return "East";
    case "mw":
      return "MidWest";
    case "w":
      return "West";
  }
};

export const getRoundName = (round: number) => {
  switch (round) {
    case 6:
      return "Championship";
    case 5:
      return "Final Four";
    case 4:
      return "Elite Eight";
    case 3:
      return "Sweet 16";
    default:
      return `Round ${round}`;
  }
};
