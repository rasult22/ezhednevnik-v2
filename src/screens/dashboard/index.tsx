import { useState, useEffect } from 'react';
import { SearchWidget } from './widgets/SearchWidget';
import { QuickLinksWidget } from './widgets/QuickLinksWidget';
import { PrayerTimesWidget } from './widgets/PrayerTimesWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { MonthlyFocusWidget } from './widgets/MonthlyFocusWidget';
import { TodayTasksWidget } from './widgets/TodayTasksWidget';
import { ClockWidget } from './widgets/ClockWidget';

/**
 * Dashboard - Main home page with widgets
 *
 * Beautiful landing page with:
 * - Search widgets (Google, YouTube)
 * - Quick links (Claude, ChatGPT, Perplexity)
 * - Prayer times for Almaty
 * - Weather for Almaty
 * - Monthly focus from daily page
 * - Today's main tasks
 */
export default function DashboardScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-primary to-bg-dark p-6">
      <div className="max-w-[1600px] mx-auto flex flex-col items-center justify-center h-screen">
        {/* Top Section - Clock & Date */}
        <ClockWidget currentTime={currentTime} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6 mt-8">
          {/* Left Column - Search & Links */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <SearchWidget />
            <QuickLinksWidget />
          </div>

          {/* Middle Column - Focus & Tasks */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <MonthlyFocusWidget />
            <TodayTasksWidget />
          </div>

          {/* Right Column - Prayer & Weather */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <PrayerTimesWidget currentTime={currentTime} />
            <WeatherWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
