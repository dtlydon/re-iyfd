import iyfdHttp from "./iyfdHttp";

const scoreUrl = `${process.env.REACT_APP_SERVER_URL}/score`;

const getScores = async () => {
  return iyfdHttp("get", scoreUrl);
};

export default { getScores };
