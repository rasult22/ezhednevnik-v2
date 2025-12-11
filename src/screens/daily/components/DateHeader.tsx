import { formatDateRU, addDays, subtractDays } from '../../../utils/date-formatters';
import { Button } from '../../../components/ui/Button';

interface DateHeaderProps {
  currentDate: string; // ISO format
  isPastDate: boolean;
  onDateChange: (date: string) => void;
  hasSkippedDays: boolean;
}

/**
 * DateHeader - Glassmorphism date display with navigation
 */
export function DateHeader({
  currentDate,
  isPastDate,
  onDateChange,
  hasSkippedDays,
}: DateHeaderProps) {
  const handlePreviousDay = () => {
    const previousDate = subtractDays(currentDate, 1);
    onDateChange(previousDate);
  };

  const handleNextDay = () => {
    const nextDate = addDays(currentDate, 1);
    onDateChange(nextDate);
  };

  const handleToday = () => {
    onDateChange(addDays(new Date().toISOString().split('T')[0]!, 0));
  };

  // Check if we can navigate forward (not future)
  const today = new Date().toISOString().split('T')[0]!;
  const canGoForward = currentDate < today;

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between">
        {/* Left: Navigation */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePreviousDay}
            title="Предыдущий день"
          >
            ← Назад
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleNextDay}
            disabled={!canGoForward}
            title={canGoForward ? 'Следующий день' : 'Будущее недоступно'}
          >
            Вперед →
          </Button>

          {currentDate !== today && (
            <Button variant="ghost" size="sm" onClick={handleToday}>
              Сегодня
            </Button>
          )}
        </div>

        {/* Center: Date Display */}
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text">
            {formatDateRU(currentDate)}
          </h1>
          {isPastDate && (
            <p className="text-sm text-accent-blue mt-2">
              Прошедшая дата (можно дозаполнить)
            </p>
          )}
        </div>

        {/* Right: Warnings/Status */}
        <div className="w-32 flex justify-end">
          {hasSkippedDays && (
            <div className="bg-warning/20 border border-warning/30 px-4 py-2 rounded-glass-sm">
              <span className="text-xs font-medium text-warning">
                Есть пропуски
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
