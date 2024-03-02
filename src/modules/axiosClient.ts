import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_OPENWEATHERMAP_URL,
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
