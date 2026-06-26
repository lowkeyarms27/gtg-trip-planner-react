import { useEffect, useState } from 'react';
import { fetchCityWeather, weatherLabel, weatherIcon } from '../../lib/weather';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function windDirLabel(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export default function WeatherWidget({ city, onWeatherLoaded }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) { setWeather(null); return; }
    setLoading(true);
    setWeather(null);
    fetchCityWeather(city).then((data) => {
      setWeather(data);
      setLoading(false);
      if (data && onWeatherLoaded) {
        onWeatherLoaded({ ...data, condition: weatherLabel(data.current.weathercode) });
      }
    });
  }, [city]);

  if (!city) return null;

  if (loading) {
    return (
      <div className="weather-widget weather-widget--loading">
        <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 32, width: 140, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 10, width: 200 }} />
      </div>
    );
  }

  if (!weather) return null;

  const { current, daily } = weather;
  const today = new Date();

  const windDir = windDirLabel(current.winddirection);

  return (
    <div className="weather-widget">
      <div className="weather-main">
        <div className="weather-icon">{weatherIcon(current.weathercode)}</div>
        <div className="weather-temp-block">
          <div className="weather-temp">{Math.round(current.temperature)}°C</div>
          <div className="weather-desc">{weatherLabel(current.weathercode)}</div>
          <div className="weather-city">{weather.city}, {weather.country}</div>
        </div>
        <div className="weather-forecast">
          {daily.time.slice(0, 7).map((date, i) => {
            const d = new Date(date);
            return (
              <div className="weather-day" key={date}>
                <div className="weather-day-name">{i === 0 ? 'Today' : DAY_NAMES[d.getDay()]}</div>
                <div className="weather-day-icon">{weatherIcon(daily.weathercode[i])}</div>
                <div className="weather-day-temps">
                  <span className="weather-day-hi">{Math.round(daily.temperature_2m_max[i])}°</span>
                  <span className="weather-day-lo">{Math.round(daily.temperature_2m_min[i])}°</span>
                </div>
                <div className="weather-day-rain">{daily.precipitation_probability_max[i]}%</div>
              </div>
            );
          })}
        </div>
        <div className="weather-conditions">
          <div className="weather-cond-item">
            <span className="weather-cond-icon">💨</span>
            <div>
              <div className="weather-cond-value">{Math.round(current.windspeed)} km/h</div>
              <div className="weather-cond-label">Wind {windDir}</div>
            </div>
          </div>
          <div className="weather-cond-item">
            <span className="weather-cond-icon">🌧</span>
            <div>
              <div className="weather-cond-value">{daily.precipitation_probability_max[0]}%</div>
              <div className="weather-cond-label">Rain today</div>
            </div>
          </div>
          <div className="weather-cond-item">
            <span className="weather-cond-icon">↕</span>
            <div>
              <div className="weather-cond-value">
                {Math.round(daily.temperature_2m_max[0])}° / {Math.round(daily.temperature_2m_min[0])}°
              </div>
              <div className="weather-cond-label">High / Low</div>
            </div>
          </div>
        </div>
      </div>
      <div className="weather-note">Live 7-day forecast · Open-Meteo</div>
    </div>
  );
}
