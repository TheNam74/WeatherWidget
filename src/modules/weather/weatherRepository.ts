import axiosClient from "../axiosClient";

interface IParams {
  q: string;
}
export interface ICityInfo {
  lat: number;
  lon: number;
}
//API GET
export const getCoordinates = (params: IParams): Promise<ICityInfo[]> => {
  const url = "/geo/1.0/direct";
  return axiosClient.get(url, { params });
};
