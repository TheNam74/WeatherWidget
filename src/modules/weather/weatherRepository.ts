// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import axiosClient from "../axiosClient";
import WeatherEntity from "./weatherEntity";

// interface IParams {
//   q: string;
// }
export interface ICityInfo {
  lat: number;
  lon: number;
  name: string;
  country: string;

  //custom field
  currentLocalTime: string; // Epoch & Unix Timestamp
}
//API GET
export const getCoordinates = (params: { q: string }): Promise<ICityInfo[]> => {
  const url = "/geo/1.0/direct";
  return axiosClient.get(url, { params });
};

export const getWeatherInfo = (params: {
  lat: number;
  lon: number;
}): Promise<IGetWeatherInfoResponse> => {
  const url = "/data/2.5/onecall";

  return axiosClient.get(url, { params }).then((res) => {
    return {
      daily: WeatherEntity.createListWeather(res.daily),
      current: res.current,
    };
  });
};

export interface IGetWeatherInfoResponse {
  daily: WeatherEntity[];
  current: {
    dt: string;
  };
}

export const getAirQuality = (params: {
  lat: number;
  lon: number;
}): Promise<any> => {
  const url = "/data/2.5/air_pollution";

  return axiosClient.get(url, { params }).then((res) => {
    return {
      daily: WeatherEntity.createListWeather(res.daily),
      current: res.current,
    };
  });
};

export interface IGetWeatherInfoResponse {
  daily: WeatherEntity[];
  current: {
    dt: string;
  };
}
