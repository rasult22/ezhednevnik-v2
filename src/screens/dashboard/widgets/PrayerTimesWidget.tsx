import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

interface PrayerTime {
  name: string;
  time: string;
  emoji: string;
}

interface PrayerTimesWidgetProps {
  currentTime: Date;
}

interface AladhanResponse {
  code: number;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
  };
}

const fetchPrayerTimes = async (): Promise<PrayerTime[]> => {
  const today = new Date();
  const timestamp = Math.floor(today.getTime() / 1000);

  // Almaty coordinates: 43.2220, 76.8512
  const response = await fetch(
    `https://api.aladhan.com/v1/timings/${timestamp}?latitude=43.2220&longitude=76.8512&method=2`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch prayer times');
  }

  const data: AladhanResponse = await response.json();

  if (data.code !== 200) {
    throw new Error('Invalid response from prayer times API');
  }

  const timings = data.data.timings;
  return [
    { name: 'Фаджр', time: timings.Fajr, emoji: '🌅' },
    { name: 'Восход', time: timings.Sunrise, emoji: '🌄' },
    { name: 'Зухр', time: timings.Dhuhr, emoji: '☀️' },
    { name: 'Аср', time: timings.Asr, emoji: '🌤️' },
    { name: 'Магриб', time: timings.Maghrib, emoji: '🌆' },
    { name: 'Иша', time: timings.Isha, emoji: '🌙' },
  ];
};

/**
 * Prayer Times Widget for Almaty
 * Uses Aladhan API via TanStack Query
 */
export function PrayerTimesWidget({ currentTime }: PrayerTimesWidgetProps) {
  const { data: prayerTimes, isLoading, isError } = useQuery({
    queryKey: ['prayerTimes'],
    queryFn: fetchPrayerTimes,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours (prayer times change daily)
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Find next prayer based on current time
  const nextPrayer = useMemo(() => {
    if (!prayerTimes) return null;

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    for (const prayer of prayerTimes) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours! * 60 + minutes!;

      if (prayerMinutes > currentMinutes) {
        return prayer.name;
      }
    }

    // If no prayer found, next is Fajr tomorrow
    return prayerTimes[0]?.name || null;
  }, [currentTime, prayerTimes]);

  if (isLoading) {
    return (
      <div className="glass p-6">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Время намаза (Алматы)</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !prayerTimes) {
    return (
      <div className="glass p-6">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Время намаза (Алматы)</h3>
        <p className="text-text-muted text-center py-4">
          Не удалось загрузить время намаза
        </p>
      </div>
    );
  }

  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Время намаза (Алматы)</h3>

      <div className="space-y-3">
        {prayerTimes.map((prayer) => (
          <div
            key={prayer.name}
            className={`flex items-center justify-between p-3 rounded-glass-sm transition-all ${
              prayer.name === nextPrayer
                ? 'bg-accent-blue/20 border border-accent-blue/30'
                : 'bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{prayer.emoji}</span>
              <span className="font-medium">{prayer.name}</span>
            </div>
            <span className="text-lg font-bold text-accent-blue">{prayer.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
