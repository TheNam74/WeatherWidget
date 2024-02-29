import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: "http://api.openweathermap.org",
  params: {
    appid: process.env.REACT_APP_OPENWEATHERMAP_APIKEY,
  },
});
axiosClient.interceptors.response.use(
  function (resp) {
    if (resp && resp.data) {
      return resp.data;
    }
    return resp;
  },
  function (error) {
    console.debug("axios call api error,", error);
  }
);
export default axiosClient;
