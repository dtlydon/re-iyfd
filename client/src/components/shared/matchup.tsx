import React from "react";
import { MatchUp } from "../../models/interfaces";
import { Button } from "react-bootstrap";
import "./matchup.scss";

interface IMatchUpProps {
  matchUp: MatchUp;
  userChoice?: string;
  isAdmin: boolean;
  onPick: (matchUpId: string, choiceId: string) => void;
  onSetMatchUpBlocked?: (matchUpId: string, blocked: boolean) => void;
}

type iyfdVariant = "outline-primary" | "success" | "danger" | "primary";

const Matchup: React.FC<any> = (props: IMatchUpProps) => {
  const { matchUp, userChoice, onPick, isAdmin, onSetMatchUpBlocked } = props;
  let variant1: iyfdVariant = "outline-primary";
  let variant2: iyfdVariant = "outline-primary";
  const is1Winner = matchUp.winner === matchUp.entry1._id;
  const is2Winner = matchUp.winner === matchUp.entry2._id;
  const is1UserChoice = userChoice === matchUp.entry1._id;
  const is2UserChoice = userChoice === matchUp.entry2._id;
  const isDisabled =
    !isAdmin && (matchUp.blocked || !!matchUp.winner) && userChoice != null;
  if (is1Winner) {
    variant1 = "primary";
    if (userChoice === "INVALID") {
      variant1 = "danger";
    }
  }

  if (is2Winner) {
    variant2 = "primary";
    if (userChoice === "INVALID") {
      variant2 = "danger";
    }
  }

  if (is1UserChoice) {
    variant1 = !matchUp.winner ? "primary" : is1Winner ? "success" : "danger";
    variant2 = "outline-primary";
  }

  if (is2UserChoice) {
    variant2 = !matchUp.winner ? "primary" : is2Winner ? "success" : "danger";
    variant1 = "outline-primary";
  }
  return (
    <div className="match-up d-flex algin-items-center justify-content-center mb-2">
      <Button
        className="mr-2"
        variant={variant1}
        disabled={isDisabled}
        onClick={() => !isDisabled && onPick(matchUp._id, matchUp.entry1._id)}
      >
        <span>{matchUp.entry1.team}</span>
      </Button>
      <Button
        className="mr-2"
        variant={variant2}
        disabled={isDisabled}
        onClick={() => !isDisabled && onPick(matchUp._id, matchUp.entry2._id)}
      >
        <span>{matchUp.entry2.team}</span>
      </Button>
      {isAdmin && onSetMatchUpBlocked && (
        <Button
          variant={matchUp.blocked ? "danger" : "outline-danger"}
          onClick={() => onSetMatchUpBlocked(matchUp._id, !matchUp.blocked)}
        >
          {matchUp.blocked ? "Unblock" : "Block"}
        </Button>
      )}
    </div>
  );
};

export default Matchup;
