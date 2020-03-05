import React from "react";
import { Button } from "react-bootstrap";
import { getRoundName } from "../../common/utils";

interface RoundListProps {
  rounds: Set<number>;
  selectedRound: number;
  setSelectedRound: (round: number) => void;
}

const RoundList = (props: RoundListProps) => {
  const { rounds, selectedRound, setSelectedRound } = props;
  return (
    <div className="d-flex mb-4 flex-wrap">
      {Array.from(rounds).map((round: number) => (
        <Button
          key={round}
          className="mr-2 mb-2"
          variant={selectedRound === round ? "dark" : "outline-dark"}
          onClick={() => setSelectedRound(round)}
        >
          {getRoundName(round)}
        </Button>
      ))}
    </div>
  );
};

export default RoundList;
