import React, { useEffect, useState } from "react";
import "./style.scss";
import { Input } from "antd";
import WeatherPresenter from "../../modules/weather/weatherPresenter";
import {
  ICityInfo,
  IGetWeatherInfoResponse,
} from "../../modules/weather/weatherRepository";
import WeatherEntity from "../../modules/weather/weatherEntity";

const MAX_WEATHER_COUNT = 8; // Maximum number of elements in the cityWeather array
enum UnitEnum {
  METRIC = "metric", //Celcius, meter/sec
  IMPERIAL = "imperial", //Fehrenheit, mile/hour
  //default Kelvin, metre/sec
}
const ConvertDegreeToCompassPoint = (wind_deg: number): string => {
  const compassPoints = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const rawPosition = Math.floor(wind_deg / 45 + 0.5);
  const arrayPosition = rawPosition % 8;
  return compassPoints[arrayPosition];
};
const ConvertWindSpeed = (
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
const ConvertTemperature = (targetUnit: UnitEnum, tempInK: number): number => {
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
const CovertEpochUnixTime = (unixEpochTime: string) => {
  const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
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

export default function WeatherPage() {
  CovertEpochUnixTime("1709282246");

  const handleCurrentSelectedChange = (selected: number) => {
    setCurrentSelected(selected);
  };
  const handleChangeUnit = (unit: UnitEnum) => {
    setUnit(unit);
  };
  const [cityName, setCityName] = useState<string>("");
  const [cityInfo, setCityInfo] = useState<ICityInfo>({
    lat: 0,
    lon: 0,
    name: "",
    country: "",
    currentLocalTime: "0",
  });
  //Contain weather info, current + 7 next days.
  const [cityWeather, setCityWeather] = useState<WeatherEntity[]>(
    new Array(MAX_WEATHER_COUNT).fill(new WeatherEntity({}))
  );
  //Selected day in the forecast section
  const [currentSelected, setCurrentSelected] = useState<number>(0);

  //setting unit
  const [unit, setUnit] = useState<UnitEnum>(UnitEnum.METRIC);
  const handleChange = (value: string) => {
    WeatherPresenter.getCoordinates({
      q: value,
    }).then((cityInfoRes: ICityInfo[]) => {
      //NAMTODO: coi nếu incorrect cityname thì trả gì chứ check vầy méo đc
      if (!cityInfoRes || cityInfoRes.length == 0) return;
      WeatherPresenter.getWeatherInfo({
        lat: cityInfo.lat,
        lon: cityInfo?.lon,
      }).then((weatherRes: IGetWeatherInfoResponse) => {
        //NAMTODO, handle res lỗi
        setCityWeather(weatherRes.daily);
        setCityInfo({
          lat: cityInfoRes[0].lat,
          lon: cityInfoRes[0].lon,
          name: cityInfoRes[0].name,
          country: cityInfoRes[0].country,
          currentLocalTime: weatherRes.current.dt,
        });
      });
    });
  };
  // useEffect(() => {
  //   WeatherPresenter.getWeatherInfo({
  //     lat: cityInfo.lat,
  //     lon: cityInfo?.lon,
  //   }).then((res: any) => {
  //     //NAMTODO, handle res lỗi
  //     setCityWeather(res.daily);
  //   });
  // }, [cityInfo]);
  return (
    <div className="weather">
      <div className="weather-box">
        <Input
          className="city-input"
          type="text"
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter city's name"
          allowClear
        />
        <div className="weather-info">
          <div className="current">
            <div className="current__overview">
              <div className="location">
                <span className="location__info">{`${cityInfo.name}, ${cityInfo.country}`}</span>
                <span className="location__overall">{`${CovertEpochUnixTime(
                  cityInfo.currentLocalTime
                )} • ${
                  cityWeather[currentSelected].weather[0].description
                }`}</span>
              </div>
              <div className="temperature">
                <img
                  src={`${process.env.REACT_APP_OPENWEATHERMAP_URL}/img/wn/${cityWeather[currentSelected].weather[0].icon}@2x.png`}
                  width={64}
                  height={64}
                />
                <div className="temperature__info">
                  <span className="temperature__info__num"> 26°</span>
                  <span className="temperature__info__unit">
                    <span
                      className={`change_unit_button ${
                        unit === UnitEnum.IMPERIAL ? "selected" : ""
                      } `}
                      onClick={() => handleChangeUnit(UnitEnum.IMPERIAL)}
                    >
                      F
                    </span>
                    /
                    <span
                      className={`change_unit_button ${
                        unit === UnitEnum.METRIC ? "selected" : ""
                      } `}
                      onClick={() => handleChangeUnit(UnitEnum.METRIC)}
                    >
                      C
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="current__detail">
              <div>
                <span>Humidity: {cityWeather[currentSelected].humidity}%</span>
                <span>
                  {`Wind:
                  ${ConvertWindSpeed(
                    unit,
                    cityWeather[currentSelected].wind_speed
                  )} 
                  ${ConvertDegreeToCompassPoint(
                    cityWeather[currentSelected].wind_deg
                  )}`}
                </span>
                <span>Air Quality: Moderate</span>
              </div>
            </div>
          </div>
          <div className="forecast">
            {cityWeather.map((weather, index) => {
              return ForeCastBox(
                weather,
                index === currentSelected,
                index,
                unit,
                handleCurrentSelectedChange
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
const ForeCastBox = (
  weather: WeatherEntity,
  selected: boolean = false,
  index: number,
  unit: UnitEnum,
  handleCurrentSelectedChange: (param: number) => void
) => {
  return (
    <div
      className={`forecast_box ${selected ? "selected" : ""}`}
      onClick={() => handleCurrentSelectedChange(index)}
    >
      <div className="forecast_box__date">Sun</div>
      <img
        src="https://openweathermap.org/img/wn/10d@2x.png"
        width={48}
        height={48}
      />
      <div className="forecast_box__higest_temp">
        {ConvertTemperature(unit, weather.temp.max)}°
      </div>
      <div className="forecast_box__lowest_temp">
        {ConvertTemperature(unit, weather.temp.min)}°
      </div>
    </div>
  );
};
