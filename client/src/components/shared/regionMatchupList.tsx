import React from "react";
import { Row, Col } from "react-bootstrap";
import MatchupList from "./matchupList";
import { getRegionName } from "../../common/utils";
import { UserChoice } from "../../models/interfaces";
import { region } from "../../models/types";

interface RegionMatchUpListProps {
  userChoices: UserChoice[];
  selectedRound: number;
  isAdmin: boolean;
  onPick: (matchUpId: string, choiceId: string) => void;
  onSetMatchUpBlocked?: (matchUpId: string, blocked: boolean) => Promise<void>;
}

const RegionMatchupList = (props: RegionMatchUpListProps) => {
  const {
    userChoices,
    selectedRound,
    isAdmin,
    onPick,
    onSetMatchUpBlocked
  } = props;
  const regionUserChoices: { [region: string]: UserChoice[] } = {};
  for (const choice of userChoices) {
    const entry = choice.matchUp.entry1 || choice.matchUp.entry2;
    if (!regionUserChoices[entry.region]) {
      regionUserChoices[entry.region] = [];
    }
    regionUserChoices[entry.region].push(choice);
  }
  return (
    <Row>
      {Object.keys(regionUserChoices).map((r: string) => {
        return (
          <Col key={r} sm="6">
            <h2 className="text-center">{getRegionName(r as region)}</h2>
            <MatchupList
              userChoices={regionUserChoices[r]}
              selectedRound={selectedRound}
              isAdmin={isAdmin}
              onPick={onPick}
              onSetMatchUpBlocked={onSetMatchUpBlocked}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default RegionMatchupList;
