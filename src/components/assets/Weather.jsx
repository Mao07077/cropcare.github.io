import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './Weather.css'
const Weather = () => {
    const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState({});
  const [dailyForecast, setDailyForecast] = useState([]);
  const [error, setError] = useState(null);

  const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';

  const kelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
};
useEffect(() => {
    const fetchData = async () => {
      try {
        if (city) {
          const currentWeatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
          );
          const currentWeatherData = await currentWeatherResponse.json();
          const dailyForecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${currentWeatherData.coord.lat}&lon=${currentWeatherData.coord.lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
          );
          const dailyForecastData = await dailyForecastResponse.json();

          if (currentWeatherData.cod && currentWeatherData.cod !== 200) {
            setError(`Error: ${currentWeatherData.message}`);
            setCurrentWeather({});
            setDailyForecast([]);
          } else {
            setError(null);
            setCurrentWeather(currentWeatherData);
            setDailyForecast(dailyForecastData.daily.slice(1));
          }
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Error fetching weather data. Please try again later.');
        setCurrentWeather({});
        setDailyForecast([]);
      }
    };

    fetchData();
  }, [city]);

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    try {
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      const currentWeatherData = await currentWeatherResponse.json();

      const dailyForecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${currentWeatherData.coord.lat}&lon=${currentWeatherData.coord.lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
      );
      const dailyForecastData = await dailyForecastResponse.json();

      if (currentWeatherData.cod && currentWeatherData.cod !== 200) {
        setError(`Error: ${currentWeatherData.message}`);
        setCurrentWeather({});
        setDailyForecast([]);
      } else {
        setError(null);
        setCurrentWeather(currentWeatherData);
        setDailyForecast(dailyForecastData.daily.slice(1));
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Error fetching weather data. Please try again later.');
      setCurrentWeather({});
      setDailyForecast([]);
    }
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const renderDailyForecast = () => {
    return dailyForecast.map((day, idx) => {
      const dayOfWeek = moment(day.dt * 1000).format('dddd').toLowerCase();
      return (
        <div className={`daily-forecast-itemm ${dayOfWeek}`} key={idx}>
          <h4>{moment(day.dt * 1000).format('dddd')}</h4>
          <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="weather icon" className="w-iconn" />
          <p>Night - {day.temp.night}&#176;C</p>
          <p>Day - {day.temp.day}&#176;C</p>
        </div>
      );
    });
  };

  return (
    <div className='hesoy'>
      <form onSubmit={handleSearchSubmit}>
        <label className='ggs'>
          <input placeholder='Enter City' className='putput' type="text" value={city} onChange={handleInputChange} />
        </label>
      </form>

      {error ? (
        <p className="error-messagess">{error}</p>
      ) : currentWeather.name ? (
        <div className='contt1'>
          <h2>
            {currentWeather.name}, {currentWeather.sys && currentWeather.sys.country}
          </h2>
          <p>
            Current Weather: {currentWeather.weather && currentWeather.weather[0] && currentWeather.weather[0].description}
          </p>
          <p>Current Temperature: {kelvinToCelsius(currentWeather.main.temp).toFixed(2)}°C</p>
        </div>
      ) : (
        <p className="info-message">Enter a city to get weather information.</p>
        )}
  
        {dailyForecast.length > 0 && (
          <div className='weatherwith'>
            <h3>Daily Forecast</h3>
            <div className='daily-forecastt'>
              {renderDailyForecast()}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export { Weather };