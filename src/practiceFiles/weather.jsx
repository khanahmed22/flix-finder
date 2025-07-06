import { useState, useEffect } from "react";
import "./App.css";

function Weather() {
  const [temp, setTemp] = useState(0);

  const URL =
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m";

  useEffect(() => {
    const fetchWeather = async () => {
      const result = await fetch(URL);
      result.json().then((json =>{
        console.log(json)
      }))
    };

    fetchWeather();
  });

  return <>Weather in Karachi {temp} C</>;
}

export default Weather;
