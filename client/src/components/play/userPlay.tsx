import React, { useState, useEffect } from "react";
import { UserChoice } from "../../models/interfaces";
import choicesService from "../../services/choicesService";
import { getCurrentRound } from "../../common/utils";
import configuration from "../../common/configuration";
import accountService from "../../services/accountService";
import MatchupList from "../shared/matchupList";
import RegionMatchupList from "../shared/regionMatchupList";
import RoundList from "../shared/roundList";
import { Alert, Spinner } from "react-bootstrap";

let _timeoutPromise: NodeJS.Timeout;

const UserPlay: React.FC = (props: any) => {
  const accountToken = localStorage.getItem(
    configuration.localStorageKeys.accountToken
  );
  const userId = props.match.params.userId;
  const [userChoices, setUserChoices] = useState<UserChoice[]>([]);
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [userName, setUserName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isUpdatingPicks, setIsUpdatingPicks] = useState<boolean>(false);
  const rounds = new Set<number>();
  userChoices.forEach(({ matchUp }) => {
    if (rounds.has(matchUp.round)) return;
    rounds.add(matchUp.round);
  });
  const refreshUserChoices = async () => {
    const { userChoices } = await choicesService.getAll(userId);
    setUserChoices(userChoices);
    return userChoices;
  };

  const onPick = async (matchUpId: string, choice: string) => {
    setIsUpdatingPicks(true);
    try {
      await choicesService.update(userId, { matchUpId, choice });
      refreshUserChoices();
    } catch (err) {
      console.error(err);
    }
    if (!!_timeoutPromise) {
      clearTimeout(_timeoutPromise);
    }
    _timeoutPromise = setTimeout(() => {
      setIsUpdatingPicks(false);
    }, 500);
  };

  useEffect(() => {
    if (!accountToken) return;
    const load = async () => {
      const userChoices = await refreshUserChoices();
      const currentRound = getCurrentRound(
        userChoices.map((x: UserChoice) => x.matchUp)
      );
      setSelectedRound(currentRound);
      const data = await accountService.getAccount();
      if (!data) return;
      setIsAdmin(data.account.role === 2);
      const user = data.account.users.find((u: any) => u.id === userId);
      if (!user) return;
      setUserName(user.user);
    };

    load();
    // eslint-disable react-hooks/exhaustive-deps
  }, [accountToken, userId]);
  const choicesByRound = userChoices.filter(
    uc => uc.matchUp.round === selectedRound
  );
  const numChoices = choicesByRound.reduce(
    (numChoices, choice) => (!!choice.choice ? numChoices + 1 : numChoices),
    0
  );
  return (
    <div className="user-play">
      <h2>{userName}</h2>
      {!!rounds.size && (
        <RoundList
          rounds={rounds}
          selectedRound={selectedRound}
          setSelectedRound={setSelectedRound}
        />
      )}
      <Alert variant="info" className="text-right">
        {isUpdatingPicks && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
        <span>
          {numChoices}/{choicesByRound.length}{" "}
          {Math.round((numChoices / choicesByRound.length) * 10000) / 100}%
          Picked
        </span>
      </Alert>
      {selectedRound > 4 && (
        <MatchupList
          userChoices={userChoices}
          selectedRound={selectedRound}
          isAdmin={isAdmin}
          onPick={onPick}
        />
      )}
      {selectedRound < 5 && (
        <RegionMatchupList
          userChoices={userChoices}
          selectedRound={selectedRound}
          isAdmin={isAdmin}
          onPick={onPick}
        />
      )}
    </div>
  );
};

export default UserPlay;
