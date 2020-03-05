import axios, { Method, AxiosRequestConfig } from "axios";
import configuration from "../common/configuration";

const iyfdHttp = async (
  method: Method,
  url: string,
  data?: any,
  headers?: any
) => {
  if (!headers) headers = {};
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      data
    };
    const token = localStorage.getItem(
      configuration.localStorageKeys.accountToken
    );
    if (token) {
      config.headers = { token, ...headers };
    }

    const response = await axios(config);
    return response.data;
  } catch (ex) {
    console.error("Http error", ex);
    throw ex;
  }
};

export default iyfdHttp;
