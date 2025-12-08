import { formatDateRU, addDays, subtractDays } from '../../../utils/date-formatters';
import { Button } from '../../../components/ui/Button';

interface DateHeaderProps {
  currentDate: string; // ISO format
  isReadOnly: boolean;
  onDateChange: (date: string) => void;
  hasSkippedDays: boolean;
}

/**
 * DateHeader - Date display and navigation controls
 *
 * Features:
 * - Large date display (DD.MM.YYYY)
 * - Previous/next day navigation
 * - Read-only mode indicator for past dates
 * - Warning badge if there are skipped days
 * - Future dates blocked (next button disabled with tooltip)
 */
export function DateHeader({
  currentDate,
  isReadOnly,
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
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
          <h1 className="text-4xl font-bold text-gray-900">
            {formatDateRU(currentDate)}
          </h1>
          {isReadOnly && (
            <p className="text-sm text-gray-500 mt-1">
              📖 Режим просмотра (прошедшая дата)
            </p>
          )}
        </div>

        {/* Right: Warnings/Status */}
        <div className="w-32 flex justify-end">
          {hasSkippedDays && (
            <div className="bg-warning/10 border border-warning px-3 py-1 rounded-full">
              <span className="text-xs font-medium text-warning">
                ⚠️ Есть пропуски
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
