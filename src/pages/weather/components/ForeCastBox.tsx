import React from "react";
import WeatherEntity from "modules/weather/weatherEntity";
import { UnitEnum } from "modules/weather/weatherInterface";
import {
  ConvertTemperature,
  CovertEpochUnixTimeToDayOfWeek,
  GetWeatherIcon,
} from "../helper";

export const ForeCastBox = (
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
      <div className="forecast_box__date">
        {CovertEpochUnixTimeToDayOfWeek(weather.dt)}
      </div>
      <img src={GetWeatherIcon(weather)} width={48} height={48} />
      <div className="forecast_box__higest_temp">
        {ConvertTemperature(unit, weather.temp.max)}°
      </div>
      <div className="forecast_box__lowest_temp">
        {ConvertTemperature(unit, weather.temp.min)}°
      </div>
    </div>
  );
};
