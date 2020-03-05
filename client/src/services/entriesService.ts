import iyfdHttp from "./iyfdHttp";
import { TournyEntry } from "../models/interfaces";

const entriesUrl = `${process.env.REACT_APP_SERVER_URL}/entries`;

const createAll = async (entries: TournyEntry[]) => {
  return iyfdHttp("post", entriesUrl, { entries });
};

const update = async (entry: TournyEntry) => {
  return iyfdHttp("put", `${entriesUrl}/${entry._id}`, { entry });
};

const getAll = async () => {
  return iyfdHttp("get", entriesUrl);
};

export default { createAll, update, getAll };
