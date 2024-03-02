class WeatherEntity {
  dt: string = "";
  humidity?: number = 0;
  temp: {
    day: number;
    min: number;
    max: number;
  } = { day: 0, min: 0, max: 0 };
  wind_speed: number = 0;
  wind_deg: number = 0;
  weather: {
    main: string;
    description: string;
    icon: string;
  }[] = [{ main: "", description: "", icon: "" }];
  constructor(weather: Partial<WeatherEntity>) {
    if (!weather) return;
    //I dont like this bc it take all the field, include the ones that not defined but exist in the pass in object.
    // Object.assign(this, weather);
    this.dt = weather.dt || this.dt;
    this.humidity = weather.humidity;
    this.temp = weather.temp || this.temp;
    this.wind_speed = weather.wind_speed || this.wind_speed;
    this.wind_deg = weather.wind_deg || this.wind_deg;
    this.weather = weather.weather || this.weather;
  }
  static createListWeather(listProducts: Array<Partial<WeatherEntity>>) {
    if (!Array.isArray(listProducts)) {
      return [];
    }
    return listProducts.map((it: Partial<WeatherEntity>) => {
      return new WeatherEntity(it);
    });
  }
}

export default WeatherEntity;
