import iyfdHttp from "./iyfdHttp";
import { UserChoiceUpdate } from "../models/interfaces";

const choicesUrl = `${process.env.REACT_APP_SERVER_URL}/choices`;

const update = async (userId: string, choice: UserChoiceUpdate) => {
  return iyfdHttp("put", `${choicesUrl}/${userId}`, choice);
};

const getAll = async (userId: string) => {
  return iyfdHttp("get", `${choicesUrl}/${userId}`);
};

export default { update, getAll };
