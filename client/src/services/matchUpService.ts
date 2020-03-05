import iyfdHttp from "./iyfdHttp";

const matchUpUrl = `${process.env.REACT_APP_SERVER_URL}/matchups`;

const getMatchUps = async () => {
  return iyfdHttp("get", matchUpUrl);
};

const pickWinner = async (matchUpId: string, winner: string) => {
  return iyfdHttp("put", `${matchUpUrl}/${matchUpId}`, { winner });
};

const setMatchUpBlocked = async (matchUpId: string, blocked: boolean) => {
  return iyfdHttp("put", `${matchUpUrl}/${matchUpId}/block`, { blocked });
};

export default { getMatchUps, pickWinner, setMatchUpBlocked };
