class WeatherEntity {
  name: string = "";
  description: string = "";
  price: number = 0;
  promotionPrice: number = 0;
  stockQuantity: number = 0;
  //===============
  dt: string = "";
  humidity: number = 0;
  temp: number = 0;
  wind_speed: number = 0;
  wind_deg: number = 0;
  weather?: {
    main: string;
    description: string;
    icon: string;
  };
  constructor(weather: Partial<WeatherEntity>) {
    if (!weather) return;
    Object.assign(this, weather);
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
