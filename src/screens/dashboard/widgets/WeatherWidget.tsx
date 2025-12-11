import { useQuery } from '@tanstack/react-query';

interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

const getWeatherDescription = (code: number): string => {
  // WMO Weather interpretation codes
  const weatherCodes: Record<number, string> = {
    0: 'Ясно',
    1: 'Преимущественно ясно',
    2: 'Переменная облачность',
    3: 'Пасмурно',
    45: 'Туман',
    48: 'Изморозь',
    51: 'Легкая морось',
    53: 'Морось',
    55: 'Сильная морось',
    61: 'Легкий дождь',
    63: 'Дождь',
    65: 'Сильный дождь',
    71: 'Легкий снег',
    73: 'Снег',
    75: 'Сильный снег',
    77: 'Снежная крупа',
    80: 'Ливни',
    81: 'Сильные ливни',
    82: 'Очень сильные ливни',
    85: 'Снегопад',
    86: 'Сильный снегопад',
    95: 'Гроза',
    96: 'Гроза с градом',
    99: 'Гроза с сильным градом',
  };
  return weatherCodes[code] || 'Неизвестно';
};

const fetchWeather = async (): Promise<WeatherData> => {
  const ALMATY_LAT = 43.2220;
  const ALMATY_LON = 76.8512;

  // Open-Meteo API - free, no API key required
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${ALMATY_LAT}&longitude=${ALMATY_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather');
  }

  const data: OpenMeteoResponse = await response.json();
  const current = data.current;

  return {
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    description: getWeatherDescription(current.weather_code),
    weatherCode: current.weather_code,
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m * 10) / 10, // Round to 1 decimal
  };
};

/**
 * Weather Widget for Almaty
 * Uses Open-Meteo API via TanStack Query (free, no API key required)
 */
export function WeatherWidget() {
  const { data: weather, isLoading, isError } = useQuery({
    queryKey: ['weather', 'almaty'],
    queryFn: fetchWeather,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
  });

  const getWeatherEmoji = (code: number): string => {
    // Map WMO weather codes to emojis
    if (code === 0) return '☀️'; // Clear
    if (code === 1) return '🌤️'; // Mainly clear
    if (code === 2) return '⛅'; // Partly cloudy
    if (code === 3) return '☁️'; // Overcast
    if (code === 45 || code === 48) return '🌫️'; // Fog
    if (code >= 51 && code <= 55) return '🌦️'; // Drizzle
    if (code >= 61 && code <= 65) return '🌧️'; // Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 80 && code <= 82) return '🌧️'; // Showers
    if (code >= 85 && code <= 86) return '🌨️'; // Snow showers
    if (code >= 95 && code <= 99) return '⛈️'; // Thunderstorm
    return '🌤️'; // Default
  };

  if (isLoading) {
    return (
      <div className="glass p-6">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Погода (Алматы)</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !weather) {
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
        <div className="text-6xl mb-2">{getWeatherEmoji(weather.weatherCode)}</div>
        <div className="text-4xl font-bold gradient-text mb-1">
          {weather.temp}°C
        </div>
        <div className="text-text-secondary">{weather.description}</div>
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
