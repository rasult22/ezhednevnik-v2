import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useDailyStore } from '../../../stores/useDailyStore';
import { formatDateRU } from '../../../utils/date-formatters';

interface SkippedDaysModalProps {
  skippedDates: string[];
  onClose: () => void;
}

/**
 * SkippedDaysModal - Handle missing daily pages
 *
 * Features:
 * - Shows list of skipped dates
 * - Two options:
 *   1. Mark all as skipped (quick resolution)
 *   2. Fill retrospectively (navigate to first skipped date)
 * - Cannot be dismissed without choosing an option
 */
export function SkippedDaysModal({
  skippedDates,
  onClose,
}: SkippedDaysModalProps) {
  const navigate = useNavigate();
  const markDateAsSkipped = useDailyStore((state) => state.markDateAsSkipped);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMarkAllSkipped = () => {
    setIsProcessing(true);

    // Mark all dates as skipped
    skippedDates.forEach((date) => {
      markDateAsSkipped(date);
    });

    setIsProcessing(false);
    onClose();
  };

  const handleFillRetrospectively = () => {
    // Navigate to first skipped date
    const firstSkippedDate = skippedDates[0];
    if (firstSkippedDate) {
      navigate(`/daily/${firstSkippedDate}`);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => {}} // Prevent closing without action
      title="У вас есть пропущенные дни"
      size="md"
    >
      <div className="space-y-6">
        {/* Warning Message */}
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
          <p className="text-gray-800">
            Вы не можете продолжить, пока не разрешите пропущенные дни.
          </p>
        </div>

        {/* List of Skipped Dates */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Пропущенные даты:
          </h3>
          <div className="bg-gray-50 rounded p-4">
            <ul className="space-y-2">
              {skippedDates.map((date) => (
                <li key={date} className="text-gray-700">
                  • {formatDateRU(date)}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Всего пропущено: <strong>{skippedDates.length}</strong> {skippedDates.length === 1 ? 'день' : 'дней'}
          </p>
        </div>

        {/* Action Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">
            Выберите действие:
          </h3>

          {/* Option 1: Mark All Skipped */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">
              1. Отметить все как пропущенные
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Быстрое решение. Дни будут помечены как пропущенные и не будут блокировать доступ.
            </p>
            <Button
              variant="secondary"
              onClick={handleMarkAllSkipped}
              isLoading={isProcessing}
              className="w-full"
            >
              Отметить как пропущенные
            </Button>
          </div>

          {/* Option 2: Fill Retrospectively */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">
              2. Заполнить ретроспективно
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Откроет первую пропущенную дату ({formatDateRU(skippedDates[0]!)}) для заполнения.
            </p>
            <Button
              variant="primary"
              onClick={handleFillRetrospectively}
              className="w-full"
            >
              Заполнить ретроспективно
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 p-3 rounded">
          <p className="text-xs text-gray-700">
            💡 Рекомендация: Если прошло больше 2-3 дней, лучше отметить как пропущенные
            и сфокусироваться на текущем дне.
          </p>
        </div>
      </div>
    </Modal>
  );
}
