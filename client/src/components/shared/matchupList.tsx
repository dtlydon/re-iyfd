import React from "react";
import { tournySort } from '../../common/bracketSort';
import { UserChoice } from "../../models/interfaces";
import Matchup from "./matchup";

interface MatchUpListProps {
  userChoices: UserChoice[];
  selectedRound: number;
  isAdmin: boolean;
  onPick: (matchUpId: string, choiceId: string) => void;
  onSetMatchUpBlocked?: (matchUpId: string, blocked: boolean) => Promise<void>;
}
const MatchupList = (props: MatchUpListProps) => {
  const {
    userChoices,
    selectedRound,
    isAdmin,
    onPick,
    onSetMatchUpBlocked
  } = props;
  const sorted = tournySort(
    userChoices
      .filter(
        x =>
          x.matchUp.round === selectedRound &&
          !!x.matchUp.entry1 &&
          !!x.matchUp.entry2
  ))
  console.log('s', sorted)
  return (
    <div>
      {
        sorted.map((choice: UserChoice) => (
          <Matchup
            key={choice._id}
            matchUp={choice.matchUp}
            userChoice={choice.choice || (!isAdmin ? "INVALID" : undefined)}
            isAdmin={isAdmin}
            onPick={onPick}
            onSetMatchUpBlocked={onSetMatchUpBlocked}
          />
        ))}
    </div>
  );
};

export default MatchupList;
