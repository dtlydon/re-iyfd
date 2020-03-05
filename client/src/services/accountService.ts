import iyfdHttp from "./iyfdHttp";

const accountUrl = `${process.env.REACT_APP_SERVER_URL}/account`;

let accountSettings: any;

const register = async (email: string, password: string) => {
  accountSettings = null;
  return iyfdHttp("post", `${accountUrl}/register`, { email, password });
};

const refresh = async () => iyfdHttp("get", `${accountUrl}/refresh`);

const addUsers = async (users: string[]) => {
  accountSettings = null;
  return iyfdHttp("post", `${accountUrl}/add-users`, { users });
};

const login = async (email: string, password: string) => {
  accountSettings = null;
  return iyfdHttp("post", `${accountUrl}/login`, { email, password });
};

const getAccount = async () => {
  if (!accountSettings) {
    accountSettings = iyfdHttp("get", `${accountUrl}`);
  }
  return accountSettings;
};

const getAllAccounts = async () => {
  return iyfdHttp("get", `${accountUrl}/all`);
};

const resetPassword = async (email: string) => {
  return iyfdHttp("post", `${accountUrl}/forgot-password`, { email });
};

const setPassword = async (
  email: string,
  token: string,
  newPassword: string
) => {
  return iyfdHttp("post", `${accountUrl}/set-password`, {
    email,
    token,
    newPassword
  });
};

export default {
  register,
  addUsers,
  login,
  getAccount,
  getAllAccounts,
  resetPassword,
  setPassword,
  refresh
};
