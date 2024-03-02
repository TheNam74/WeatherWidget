export enum UnitEnum {
  METRIC = "metric", //Celcius, meter/sec
  IMPERIAL = "imperial", //Fehrenheit, mile/hour
  //default Kelvin, metre/sec
}
export interface ICityInfo {
  lat: number;
  lon: number;
  name: string;
  country: string;
  aqi: AqiEnum;

  //custom field
  currentLocalTime: string; // Epoch & Unix Timestamp
  currentTemp: number;
  currentIcon: string;
  currentDescription: string;
  currentHumidity: number;
  currentWind_speed: number;
  current_deg: number;
}
export enum AqiEnum {
  Good = 1,
  Fair = 2,
  Moderate = 3,
  Poor = 4,
  VeryPoor = 5,
}
