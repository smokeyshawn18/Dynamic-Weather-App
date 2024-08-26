import "./Weather.css";
import searchh from "../assets/search.png";
import clear from "../assets/clear.png";
import cloud from "../assets/cloud.png";
import drizzle from "../assets/drizzle.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import wind from "../assets/wind.png";
import humidity from "../assets/humidity.png";
import { useEffect, useState, useRef } from "react";

function Weather() {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [localTime, setLocalTime] = useState("");

  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear;

      // Calculate the local time based on the timezone
      const currentTime = new Date();
      const localOffset = currentTime.getTimezoneOffset() * 60000; // offset in milliseconds
      const utc = currentTime.getTime() + localOffset; // UTC time in milliseconds
      const localTime = new Date(utc + data.timezone * 1000); // Add timezone offset

      const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      setLocalTime(localTime.toLocaleString("en-GB", options));

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp), // Temp is now correctly in Celsius
        location: data.name,
        icon: icon,
        timezone: data.timezone,
      });

      // Clear the input field
      inputRef.current.value = "";
    } catch {
      setWeatherData(false);
      console.error("Error in fetching data");
    }
  };

  useEffect(() => {
    search("Kathmandu");
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search Weather" />
        <img
          src={searchh}
          alt="Search icon"
          onClick={() => search(inputRef.current.value)}
        />
      </div>
      {weatherData ? (
        <>
          <img
            src={weatherData.icon}
            alt="Weather icon"
            className="weather-icon"
          />
          <p className="temp">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <p className="timestamp">{localTime}</p>{" "}
          {/* Display the local time */}
          <div className="weather-data">
            <div className="col">
              <img src={humidity} alt="Humidity icon" />
              <div>
                <p>{weatherData.humidity}</p>
                <p>Humidity</p>
              </div>
            </div>
            <div className="col">
              <img src={wind} alt="Wind icon" />
              <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Weather;
