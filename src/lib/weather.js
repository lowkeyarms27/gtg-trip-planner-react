export async function fetchCityWeather(cityName) {
  try {
    // Step 1: geocode the city name
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );
    if (!geoRes.ok) return null;
    const geoData = await geoRes.json();
    const loc = geoData.results?.[0];
    if (!loc) return null;

    // Step 2: fetch 7-day forecast
    const wxRes = await fetch(
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${loc.latitude}&longitude=${loc.longitude}` +
      `&current_weather=true` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` +
      `&timezone=auto&forecast_days=7`
    );
    if (!wxRes.ok) return null;
    const wx = await wxRes.json();

    return {
      city: loc.name,
      country: loc.country,
      current: wx.current_weather,
      daily: wx.daily,
    };
  } catch {
    return null;
  }
}

export function weatherLabel(code) {
  if (code === 0) return 'Clear sky';
  if (code <= 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 49) return 'Foggy';
  if (code <= 59) return 'Drizzle';
  if (code <= 69) return 'Rain';
  if (code <= 79) return 'Snow';
  if (code <= 84) return 'Rain showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

export function weatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 69) return '🌧️';
  if (code <= 79) return '❄️';
  if (code <= 84) return '🌦️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}
