// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import axiosClient from "../axiosClient";
import WeatherEntity from "./weatherEntity";

export interface ICityInfo {
  lat: number;
  lon: number;
  name: string;
  country: string;
  aqi: AqiEnum;

  //custom field
  currentLocalTime: string; // Epoch & Unix Timestamp
  currentTemp: number;
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
    temp: number;
  };
}

export const getAirQuality = (params: {
  lat: number;
  lon: number;
}): Promise<IGetAirQualityResponse> => {
  const url = "/data/2.5/air_pollution";

  return axiosClient.get(url, { params });
};

export interface IGetAirQualityResponse {
  list: {
    main: {
      aqi: AqiEnum;
    };
  }[];
}

export enum AqiEnum {
  Good = 1,
  Fair = 2,
  Moderate = 3,
  Poor = 4,
  VeryPoor = 5,
}
