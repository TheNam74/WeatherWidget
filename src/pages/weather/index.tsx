import React, { useCallback, useEffect, useState } from "react";
import { Input } from "antd";
import lodash from "lodash";

import "./style.scss";
import {
  ConvertDegreeToCompassPoint,
  ConvertTemperature,
  ConvertWindSpeed,
  CovertAqiToString,
  CovertEpochUnixTime,
  GetWeatherIcon,
} from "./helper";
import WeatherPresenter from "modules/weather/weatherPresenter";
import WeatherEntity from "modules/weather/weatherEntity";
import { AqiEnum, ICityInfo, UnitEnum } from "modules/weather/weatherInterface";
import { ForeCastBox } from "./components/ForeCastBox";

const MAX_WEATHER_COUNT = 8; // Maximum number of elements in the cityWeather array

export default function WeatherPage() {
  const handleCurrentSelectedChange = (selected: number) => {
    setCurrentSelected(selected);
  };
  const handleChangeUnit = (unit: UnitEnum) => {
    setUnit(unit);
  };
  const [cityName, setCityName] = useState<string>("Hanoi");
  const [cityInfo, setCityInfo] = useState<ICityInfo>({
    lat: 0,
    lon: 0,
    name: "",
    country: "",
    currentLocalTime: "0",
    aqi: AqiEnum.Good,
    currentTemp: 0,
    currentIcon: "",
    currentHumidity: 0,
    currentWind_speed: 0,
    current_deg: 0,
    currentDescription: "",
  });

  useEffect(() => {
    handleChange(cityName);
  }, []);
  //Contain weather info, current day and 7 next days.
  const [cityWeather, setCityWeather] = useState<WeatherEntity[]>(
    new Array(MAX_WEATHER_COUNT).fill(new WeatherEntity({}))
  );
  //Selected day in the forecast section
  const [currentSelected, setCurrentSelected] = useState<number>(0);

  //setting unit
  const [unit, setUnit] = useState<UnitEnum>(UnitEnum.METRIC);

  //setting valid city
  const [isValidCity, setIsValidCity] = useState<boolean>(true);

  //useCallback so this function do not get rerender unintentionally, which lead to not being able to sync with next key stroke
  const debouncedHandleChangeCityInput = useCallback(
    lodash.debounce(async (value) => {
      const cityInfoRes = await WeatherPresenter.getCoordinates({
        q: value,
      });
      //invalid city
      if (!cityInfoRes || cityInfoRes.length == 0) {
        setIsValidCity(false);
        return;
      }
      setIsValidCity(true);
      const weatherRes = await WeatherPresenter.getWeatherInfo({
        lat: cityInfoRes?.[0].lat,
        lon: cityInfoRes?.[0].lon,
      });
      //set forecast date back to current.
      setCurrentSelected(0);
      setCityWeather(weatherRes.daily);
      const AqiRes = await WeatherPresenter.getAirQuality({
        lat: cityInfoRes?.[0].lat,
        lon: cityInfoRes?.[0].lon,
      });
      console.debug("weatherRes.current", weatherRes.current);
      setCityInfo({
        lat: cityInfoRes[0].lat,
        lon: cityInfoRes[0].lon,
        name: cityInfoRes[0].name,
        country: cityInfoRes[0].country,
        currentLocalTime: weatherRes.current.dt,
        aqi: AqiRes.list?.[0]?.main?.aqi,
        currentTemp: weatherRes.current.temp,
        currentIcon: weatherRes.current.weather[0].icon,
        currentHumidity: weatherRes.current.humidity,
        currentWind_speed: weatherRes.current.wind_speed,
        current_deg: weatherRes.current.wind_deg,
        currentDescription: weatherRes.current.weather[0].description,
      });
    }, 500),
    []
  );
  const handleChange = async (value: string) => {
    setCityName(value);
    if (value) debouncedHandleChangeCityInput(value);
  };
  return (
    <div className="weather">
      <div className="weather-box">
        <div className="input-wrapper">
          <Input
            className="input-wrapper__area"
            type="text"
            onChange={(e) => handleChange(e.target.value)}
            value={cityName}
            placeholder="Enter city's name"
            size="large"
          />
          {cityName && (
            <img
              className="input-wrapper__clear"
              src="/assets/images/iconClear.png"
              onClick={() => setCityName("")}
            />
          )}
        </div>
        <div className="weather-info">
          {isValidCity ? (
            <>
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
                      src={GetWeatherIcon(
                        currentSelected === 0
                          ? cityInfo.currentIcon
                          : cityWeather[currentSelected].weather[0].icon
                      )}
                      width={64}
                      height={64}
                    />
                    <div className="temperature__info">
                      <span className="temperature__info__num">
                        {ConvertTemperature(
                          unit,
                          currentSelected === 0
                            ? cityInfo.currentTemp
                            : cityWeather[currentSelected].temp.max
                        )}
                        °
                      </span>
                      <span className="temperature__info__unit">
                        <span
                          className={`change_unit_button ${
                            unit === UnitEnum.IMPERIAL ? "selected" : ""
                          } `}
                          onClick={() => handleChangeUnit(UnitEnum.IMPERIAL)}
                        >
                          F
                        </span>
                        {" / "}
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
                    <span>
                      Humidity:{" "}
                      {currentSelected === 0
                        ? cityInfo.currentHumidity
                        : cityWeather[currentSelected].humidity}
                      %
                    </span>
                    <span>
                      {`Wind:
                  ${ConvertWindSpeed(
                    unit,
                    currentSelected === 0
                      ? cityInfo.currentWind_speed
                      : cityWeather[currentSelected].wind_speed
                  )} 
                  ${ConvertDegreeToCompassPoint(
                    currentSelected === 0
                      ? cityInfo.current_deg
                      : cityWeather[currentSelected].wind_deg
                  )}`}
                    </span>
                    {currentSelected === 0 && (
                      <span>
                        Air Quality: {CovertAqiToString(cityInfo.aqi)}
                      </span>
                    )}
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
            </>
          ) : (
            <div className="invalid_city">
              <img src="/assets/images/inValidCity.png" />
              <span className="invalid_city__text">
                We could not find weather information for the location above
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
