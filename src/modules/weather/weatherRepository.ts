import axiosClient from "../axiosClient";
import WeatherEntity from "./weatherEntity";
import { AqiEnum, ICityInfo } from "./weatherInterface";

//=========================
export const getCoordinates = (params: { q: string }): Promise<ICityInfo[]> => {
  const url = "/geo/1.0/direct";
  return axiosClient.get(url, { params });
};
//==========================
export interface IGetWeatherInfoResponse {
  daily: WeatherEntity[];
  current: {
    dt: string;
    temp: number;
  };
}
export const getWeatherInfo = (params: {
  lat: number;
  lon: number;
}): Promise<IGetWeatherInfoResponse> => {
  const url = "/data/2.5/onecall";

  // return axiosClient.get(url, { params }).then((res) => {
  //   return {
  //     daily: WeatherEntity.createListWeather(res.daily),
  //     current: res.current,
  //   };
  // });
  return axiosClient.get(url, { params });
};

//==========================
export interface IGetAirQualityResponse {
  list: {
    main: {
      aqi: AqiEnum;
    };
  }[];
}

export const getAirQuality = (params: {
  lat: number;
  lon: number;
}): Promise<IGetAirQualityResponse> => {
  const url = "/data/2.5/air_pollution";

  return axiosClient.get(url, { params });
};
