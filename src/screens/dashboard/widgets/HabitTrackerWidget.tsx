import { useState, useEffect, useMemo } from 'react';
import { useHabitsStore } from '../../../stores/useHabitsStore';
import { subtractDays, getCurrentDateISO, formatDateRU } from '../../../utils/date-formatters';
import { HabitSettingsModal } from './HabitSettingsModal';

/**
 * Habit Tracker Widget
 * Shows habits with GitHub-style contribution graph for last 7 days
 */
export function HabitTrackerWidget() {
  const habits = useHabitsStore((state) => state.habits);
  const loadHabits = useHabitsStore((state) => state.loadHabits);
  const toggleHabitDate = useHabitsStore((state) => state.toggleHabitDate);
  const isHabitCompletedOnDate = useHabitsStore((state) => state.isHabitCompletedOnDate);

  const [showSettings, setShowSettings] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<{ date: string; habitId: string } | null>(null);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  // Get last 7 days (today inclusive)
  const last7Days = useMemo(() => {
    const today = getCurrentDateISO();
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      days.push(subtractDays(today, i));
    }
    return days;
  }, []);

  const handleToggle = (habitId: string, date: string) => {
    toggleHabitDate(habitId, date);
  };

  return (
    <>
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold gradient-text">Трекер привычек</h3>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-text-muted hover:text-accent-blue transition-colors rounded-lg hover:bg-white/5"
            title="Настройки привычек"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            <p>Нет привычек</p>
            <button
              onClick={() => setShowSettings(true)}
              className="text-accent-blue hover:underline text-sm mt-2"
            >
              Добавить привычку
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="space-y-2">
                {/* Habit Name */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="text-sm font-medium text-text-primary">
                    {habit.name}
                  </span>
                </div>

                {/* GitHub-style contribution graph */}
                <div className="flex gap-1.5">
                  {last7Days.map((date) => {
                    const isCompleted = isHabitCompletedOnDate(habit.id, date);
                    const isToday = date === getCurrentDateISO();
                    const isHovered =
                      hoveredDate?.date === date && hoveredDate?.habitId === habit.id;

                    return (
                      <div key={date} className="relative">
                        <button
                          onClick={() => handleToggle(habit.id, date)}
                          onMouseEnter={() => setHoveredDate({ date, habitId: habit.id })}
                          onMouseLeave={() => setHoveredDate(null)}
                          className={`
                            w-8 h-8 rounded-md transition-all duration-200
                            ${
                              isCompleted
                                ? 'opacity-100 shadow-sm'
                                : 'opacity-30 hover:opacity-50'
                            }
                            ${isToday ? 'ring-2 ring-accent-blue ring-offset-2 ring-offset-dark-300' : ''}
                            hover:scale-110
                          `}
                          style={{
                            backgroundColor: isCompleted ? habit.color : '#374151',
                          }}
                          title={formatDateRU(date)}
                        >
                          {isCompleted && (
                            <svg
                              className="w-5 h-5 mx-auto text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>

                        {/* Tooltip on hover */}
                        {isHovered && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-100 border border-glass-border rounded-md text-xs text-text-primary whitespace-nowrap z-10 shadow-lg">
                            {formatDateRU(date)}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                              <div className="w-2 h-2 bg-dark-100 border-r border-b border-glass-border rotate-45" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Day labels (shown once at the bottom) */}
            <div className="flex gap-1.5 pt-2 border-t border-glass-border/30">
              {last7Days.map((date) => {
                const dayName = new Date(date + 'T00:00:00').toLocaleDateString('ru-RU', {
                  weekday: 'short',
                });
                return (
                  <div key={date} className="w-8 text-center">
                    <span className="text-xs text-text-muted">
                      {dayName.slice(0, 2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <HabitSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}
