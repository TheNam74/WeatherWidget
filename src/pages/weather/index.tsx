import React, { useEffect, useState } from "react";
import "./style.scss";
import { Input } from "antd";
import WeatherPresenter from "../../modules/weather/weatherPresenter";
import { ICityInfo } from "../../modules/weather/weatherRepository";

export default function WeatherPage() {
  const handleChange = (value: string) => {
    WeatherPresenter.getCoordinates({
      q: value,
    }).then((res: ICityInfo[]) => {
      console.debug("res", res);

      //NAMTODO: coi nếu incorrect cityname thì trả gì chứ check vầy méo đc
      if (!res || res.length == 0) return;
      setCityInfo({
        lat: res[0].lat,
        lon: res[0].lon,
      });
    });
    // setCity(event.target.)
  };
  const [cityName, setCityName] = useState<string>("");
  const [cityInfo, setCityInfo] = useState<ICityInfo>();
  useEffect(() => {
    console.debug("cityInfo", cityInfo);
  }, [cityInfo]);
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
      </div>
    </div>
  );
}
