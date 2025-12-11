import { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

/**
 * Weather Widget for Almaty
 * Uses OpenWeatherMap API (requires API key)
 */
export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      // Note: This requires an API key from openweathermap.org
      // For demo purposes, we'll show fallback data
      // Users should replace 'DEMO_KEY' with their actual API key
      const API_KEY = 'DEMO_KEY';
      const ALMATY_LAT = 43.2220;
      const ALMATY_LON = 76.8512;

      if (API_KEY === 'DEMO_KEY') {
        // Show demo data
        setWeather({
          temp: 22,
          feelsLike: 20,
          description: 'Ясно',
          icon: '01d',
          humidity: 45,
          windSpeed: 3.5,
        });
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${ALMATY_LAT}&lon=${ALMATY_LON}&units=metric&lang=ru&appid=${API_KEY}`
      );

      if (!response.ok) throw new Error('Failed to fetch weather');

      const data = await response.json();

      setWeather({
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      });

      setError(false);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherEmoji = (icon: string) => {
    const iconMap: Record<string, string> = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️',
    };
    return iconMap[icon] || '🌤️';
  };

  if (loading) {
    return (
      <div className="glass p-6">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Погода (Алматы)</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="glass p-6">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Погода (Алматы)</h3>
        <p className="text-text-muted text-center py-4">
          Не удалось загрузить погоду
        </p>
      </div>
    );
  }

  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Погода (Алматы)</h3>

      <div className="text-center mb-4">
        <div className="text-6xl mb-2">{getWeatherEmoji(weather.icon)}</div>
        <div className="text-4xl font-bold gradient-text mb-1">
          {weather.temp}°C
        </div>
        <div className="text-text-secondary capitalize">{weather.description}</div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 bg-white/5 rounded-glass-sm">
          <span className="text-text-secondary">Ощущается</span>
          <span className="font-semibold">{weather.feelsLike}°C</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-white/5 rounded-glass-sm">
          <span className="text-text-secondary">Влажность</span>
          <span className="font-semibold">{weather.humidity}%</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-white/5 rounded-glass-sm">
          <span className="text-text-secondary">Ветер</span>
          <span className="font-semibold">{weather.windSpeed} м/с</span>
        </div>
      </div>
    </div>
  );
}
