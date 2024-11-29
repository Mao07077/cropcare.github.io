import React, { useState, useEffect } from 'react';
import lnd from '../assets/lnd.png';
import './Landingpage.css';
import { Link } from 'react-router-dom';
import moment from 'moment';
import logoolog from '../assets/logo512.png';

const Landingpage = () => {
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
        <div className={`daily-forecast-item ${dayOfWeek}`} key={idx}>
          <h4>{moment(day.dt * 1000).format('dddd')}</h4>
          <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="weather icon" className="w-icon" />
          <p>Night - {day.temp.night}&#176;C</p>
          <p>Day - {day.temp.day}&#176;C</p>
        </div>
      );
    });
  };
  return (
    <div>
      <div className='content'>
      <img className="logoolog" src={logoolog} alt="logo" />
        <Link to="/signup" className="get">
          <button>Get Started</button>
        </Link>
        <img className="lnd" src={lnd} alt="Landscape" />
        <div className="name">CropCare<br/>
       </div>
      </div>

      <form onSubmit={handleSearchSubmit}>
      <button type="submit"><b>Enter City</b></button>
  <input type="text" placeholder="Enter a city to get weather information.!"
         value={city} onChange={handleInputChange} />
  
</form>

      {error ? (
        <p className="error-message">{error}</p>
      ) : currentWeather.name ? (
        <div className='con1'>
          <h2>
            {currentWeather.name}, {currentWeather.sys && currentWeather.sys.country}
          </h2>
          <p>
            Todays Weather Forcast: {currentWeather.weather && currentWeather.weather[0] && currentWeather.weather[0].description}
          </p>
          <p>Todays Temperature: {kelvinToCelsius(currentWeather.main.temp).toFixed(2)}°C</p>
        </div>
      ) : (
        <p className="message"></p>
      )}

      {dailyForecast.length > 0 && (
        <div className='Daily-Weather'>
          <h3>Daily Forecast</h3>
          <div className='daily-forecast'>
            {renderDailyForecast()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Landingpage;