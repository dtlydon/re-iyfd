import React, { useState, useEffect } from "react";
import scoreService from "../../services/scoreService";
import { Table, Row, Col } from "react-bootstrap";
import _ from "lodash";

//{"userScores":[{"user":{"id":"5e31cc4daf1da85bce8cdf83","user":"dan da man 1"},"score":0},{"user":{"id":"5e31cc4daf1da85bce8cdf84","user":"dan da man 2"},"score":0},{"user":{"id":"5e31cc4daf1da85bce8cdf85","user":"dan da man 3"},"score":10},{"user":{"id":"5e31cc4daf1da85bce8cdf87","user":"Test user 1"},"score":65}]}

interface UserScore {
  user: {
    id: string;
    user: string;
  };
  score: number;
}

interface UserScoreCollection {
  userScores: UserScore[];
}
function renderTable(scores: UserScore[]) {
  const scoreGroup = _.groupBy(scores, "score");
  return Object.keys(scoreGroup)
    .sort((a: string, b: string) => parseInt(b) - parseInt(a))
    .map(key => (
      <tr key={key}>
        <td>{key === "undefined" ? 0 : key}</td>
        <td>
          {scoreGroup[key].map((u: UserScore) => (
            <div key={u.user.id}>{u.user.user}</div>
          ))}
        </td>
      </tr>
    ));
}

const Score: React.FC = () => {
  const [scores, setScores] = useState<UserScoreCollection>();
  useEffect(() => {
    const load = async () => {
      const scores = await scoreService.getScores();
      setScores(scores);
    };
    load();
  }, []);
  return (
    <div className="score">
      <Row>
        <Col xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }}>
          <h2>Scoreboard</h2>
          {!!scores && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: "2rem" }}>Score</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>{renderTable(scores.userScores)}</tbody>
            </Table>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Score;
