import React, { useState, useEffect } from "react";
import { MatchUp, UserChoice } from "../../models/interfaces";
import matchUpService from "../../services/matchUpService";
import { getCurrentRound } from "../../common/utils";
import RoundList from "../shared/roundList";
import MatchupList from "../shared/matchupList";
import RegionMatchupList from "../shared/regionMatchupList";

const MatchUps: React.FC = () => {
  const [matchUps, setMatchUps] = useState<MatchUp[]>([]);

  const [selectedRound, setSelectedRound] = useState<number>(1);
  const rounds = new Set<number>();
  matchUps.forEach(matchUp => {
    if (rounds.has(matchUp.round)) return;
    rounds.add(matchUp.round);
  });

  useEffect(() => {
    const loadMatchUps = async () => {
      const data = await matchUpService.getMatchUps();
      setMatchUps(data.matchUps);
      const currentRound = getCurrentRound(data.matchUps);
      setSelectedRound(currentRound);
    };
    loadMatchUps();
  }, []);

  const chooseWinner = async (matchUpId: string, winner: string) => {
    const data = await matchUpService.pickWinner(matchUpId, winner);
    setMatchUps(data.matchUps);
  };
  const onSetMatchUpBlocked = async (matchUpId: string, blocked: boolean) => {
    const data = await matchUpService.setMatchUpBlocked(matchUpId, blocked);
    setMatchUps(data.matchUps);
  };

  return (
    <div>
      <h2>MatchUps</h2>
      {!matchUps.length && <div>No matches created yet</div>}
      {!!rounds.size && (
        <RoundList
          rounds={rounds}
          selectedRound={selectedRound}
          setSelectedRound={setSelectedRound}
        />
      )}
      {selectedRound > 4 && (
        <MatchupList
          userChoices={matchUps.map(
            m => ({ _id: m._id, matchUp: m } as UserChoice)
          )}
          selectedRound={selectedRound}
          isAdmin={true}
          onPick={chooseWinner}
          onSetMatchUpBlocked={onSetMatchUpBlocked}
        />
      )}
      {selectedRound < 5 && (
        <RegionMatchupList
          userChoices={matchUps.map(
            m => ({ _id: m._id, matchUp: m } as UserChoice)
          )}
          selectedRound={selectedRound}
          isAdmin={true}
          onPick={chooseWinner}
          onSetMatchUpBlocked={onSetMatchUpBlocked}
        />
      )}
    </div>
  );
};

export default MatchUps;
