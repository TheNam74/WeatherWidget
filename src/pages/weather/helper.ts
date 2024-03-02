import { AqiEnum, UnitEnum } from "modules/weather/weatherInterface";
export const ConvertDegreeToCompassPoint = (wind_deg: number): string => {
  const compassPoints = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const rawPosition = Math.floor(wind_deg / 45 + 0.5);
  const arrayPosition = rawPosition % 8;
  return compassPoints[arrayPosition];
};
export const ConvertWindSpeed = (
  targetUnit: UnitEnum,
  windSpeedMPS: number
): string => {
  switch (targetUnit) {
    case UnitEnum.METRIC:
      return " " + Math.round(windSpeedMPS * 3.6) + " KPH"; // m/s to km/h
    case UnitEnum.IMPERIAL:
      return " " + Math.round(windSpeedMPS * 2.23694) + " MPH"; //m/s to mile/h
    default:
      return " N/A ";
  }
};
export const ConvertTemperature = (
  targetUnit: UnitEnum,
  tempInK: number
): number => {
  let ret;
  switch (targetUnit) {
    case UnitEnum.METRIC:
      ret = tempInK - 273.15; //K to C
      break;
    case UnitEnum.IMPERIAL:
      ret = ((tempInK - 273.15) * 9) / 5 + 32; //K to F
      break;
    default:
      ret = 0;
      break;
  }
  ret = Math.round(ret);
  return ret;
};
export const CovertEpochUnixTime = (unixEpochTime: string): string => {
  const d = new Date(0);
  d.setUTCSeconds(Number(unixEpochTime));
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayOfWeek = daysOfWeek[d.getDay()];

  const time = d.toLocaleString("en-US", {
    hour: "2-digit",
    hour12: true,
  });

  return dayOfWeek + " " + time;
};
export const CovertEpochUnixTimeToDayOfWeek = (
  unixEpochTime: string
): string => {
  const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(Number(unixEpochTime));
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dayOfWeek = daysOfWeek[d.getDay()];
  return dayOfWeek;
};
export const CovertAqiToString = (aqi: AqiEnum): string => {
  switch (aqi) {
    case AqiEnum.Good:
      return "Good";
    case AqiEnum.Fair:
      return "Fair";
    case AqiEnum.Moderate:
      return "Moderate";
    case AqiEnum.Poor:
      return "Poor";
    case AqiEnum.VeryPoor:
      return "Very Poor";
    default:
      return "N/A";
  }
};
export const GetWeatherIcon = (icon: string): string => {
  return `${process.env.REACT_APP_OPENWEATHERMAP_URL}/img/wn/${icon}@2x.png`;
};
