import { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherMatrix = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: You'll need to sign up for a free API key at OpenWeatherMap
    // and replace 'YOUR_API_KEY' with your actual key
    const API_KEY = '2e4258bb0bf95a243c659bbc539e7862';
    
    const fetchWeather = async () => {
      try {
        // Using New York as default location
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=New York&units=metric&appid=${API_KEY}`
        );
        
        setWeather(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 minutes
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="cyber-card animate-pulse">
        <h2 className="text-xl font-bold text-cyber-yellow mb-4">Loading Weather Data...</h2>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="cyber-card">
        <h2 className="text-xl font-bold text-cyber-yellow mb-4">Weather Matrix</h2>
        <p className="text-cyber-pink">Error loading weather data</p>
      </div>
    );
  }

  const getWeatherIcon = (code) => {
    // Map weather codes to cyberpunk-style icons
    if (code >= 200 && code < 300) return '⚡'; // Thunderstorm
    if (code >= 300 && code < 400) return '🌧'; // Drizzle
    if (code >= 500 && code < 600) return '☔'; // Rain
    if (code >= 600 && code < 700) return '❄'; // Snow
    if (code >= 700 && code < 800) return '🌫'; // Atmosphere
    if (code === 800) return '☀'; // Clear
    return '☁'; // Clouds
  };

  return (
    <div className="cyber-card">
      <h2 className="text-xl font-bold text-cyber-yellow mb-4">Weather Matrix</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-cyber-dark border border-cyber-blue rounded-lg">
          <div className="text-4xl mb-2">
            {getWeatherIcon(weather.weather[0].id)}
          </div>
          <div className="text-lg capitalize">
            {weather.weather[0].description}
          </div>
        </div>
        
        <div className="text-center p-4 bg-cyber-dark border border-cyber-pink rounded-lg">
          <div className="text-4xl mb-2">
            {Math.round(weather.main.temp)}°C
          </div>
          <div className="text-sm">
            Feels like {Math.round(weather.main.feels_like)}°C
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-3 bg-cyber-dark border border-cyber-yellow rounded-lg">
          <div className="text-sm text-cyber-yellow">Humidity</div>
          <div className="text-xl">{weather.main.humidity}%</div>
        </div>
        
        <div className="p-3 bg-cyber-dark border border-cyber-yellow rounded-lg">
          <div className="text-sm text-cyber-yellow">Wind</div>
          <div className="text-xl">{Math.round(weather.wind.speed)} m/s</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-cyber-blue text-center">
        Location: {weather.name}, {weather.sys.country}
      </div>
    </div>
  );
};

export default WeatherMatrix;
