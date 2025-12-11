import { useState, useEffect } from 'react';

interface PrayerTime {
  name: string;
  time: string;
  emoji: string;
}

interface PrayerTimesWidgetProps {
  currentTime: Date;
}

/**
 * Prayer Times Widget for Almaty
 * Uses Aladhan API to fetch prayer times
 */
export function PrayerTimesWidget({ currentTime }: PrayerTimesWidgetProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  // Update next prayer when current time changes
  useEffect(() => {
    if (prayerTimes.length > 0) {
      findNextPrayer();
    }
  }, [currentTime, prayerTimes]);

  const fetchPrayerTimes = async () => {
    try {
      const today = new Date();
      const timestamp = Math.floor(today.getTime() / 1000);

      // Almaty coordinates: 43.2220, 76.8512
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${timestamp}?latitude=43.2220&longitude=76.8512&method=2`
      );

      const data = await response.json();

      if (data.code === 200) {
        const timings = data.data.timings;
        setPrayerTimes([
          { name: 'Фаджр', time: timings.Fajr, emoji: '🌅' },
          { name: 'Восход', time: timings.Sunrise, emoji: '🌄' },
          { name: 'Зухр', time: timings.Dhuhr, emoji: '☀️' },
          { name: 'Аср', time: timings.Asr, emoji: '🌤️' },
          { name: 'Магриб', time: timings.Maghrib, emoji: '🌆' },
          { name: 'Иша', time: timings.Isha, emoji: '🌙' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    } finally {
      setLoading(false);
    }
  };

  const findNextPrayer = () => {
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    for (const prayer of prayerTimes) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours! * 60 + minutes!;

      if (prayerMinutes > currentMinutes) {
        setNextPrayer(prayer.name);
        return;
      }
    }

    // If no prayer found, next is Fajr tomorrow
    setNextPrayer(prayerTimes[0]?.name || null);
  };

  if (loading) {
    return (
      <div className="glass p-6">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Время намаза (Алматы)</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
        </div>
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
