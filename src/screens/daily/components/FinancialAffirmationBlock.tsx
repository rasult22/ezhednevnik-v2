import { Card } from '../../../components/layout/Card';
import { Textarea } from '../../../components/ui/Textarea';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useDailyStore } from '../../../stores/useDailyStore';

interface FinancialAffirmationBlockProps {
  date: string;
  affirmation: string;
  confirmed: boolean;
  isReadOnly: boolean;
}

/**
 * FinancialAffirmationBlock - Daily financial affirmation with confirmation
 *
 * Features:
 * - Textarea for affirmation statement
 * - Confirmation checkbox (acts as signature)
 * - Example provided as placeholder
 * - Auto-saves changes
 */
export function FinancialAffirmationBlock({
  date,
  affirmation,
  confirmed,
  isReadOnly,
}: FinancialAffirmationBlockProps) {
  const updateFinancialAffirmation = useDailyStore((state) => state.updateFinancialAffirmation);
  const confirmFinancialAffirmation = useDailyStore((state) => state.confirmFinancialAffirmation);

  const handleAffirmationChange = (value: string) => {
    if (isReadOnly) return;
    updateFinancialAffirmation(date, value);
  };

  const handleConfirmToggle = () => {
    if (isReadOnly) return;
    confirmFinancialAffirmation(date);
  };

  return (
    <Card
      title="Финансовая установка"
      subtitle="Ежедневное подтверждение финансовых целей"
    >
      <div className="space-y-4">
        {/* Affirmation Textarea */}
        <Textarea
          value={affirmation}
          onChange={(e) => handleAffirmationChange(e.target.value)}
          placeholder="Я получаю в качестве суммарного денежного вознаграждения 500 000 рублей в месяц"
          rows={4}
          disabled={isReadOnly}
        />

        {/* Confirmation Checkbox */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <Checkbox
            checked={confirmed}
            onChange={handleConfirmToggle}
            disabled={isReadOnly}
          />
          <label className="text-sm font-medium text-gray-700 cursor-pointer">
            ✓ Подтверждаю установку (подпись)
          </label>
        </div>

        {confirmed && (
          <div className="bg-green-50 border border-green-200 p-3 rounded">
            <p className="text-sm text-green-800">
              ✅ Установка подтверждена
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
          <p className="text-xs text-gray-700">
            💰 Формулируйте в настоящем времени, как уже достигнутый результат.
            Будьте конкретны в числах и сроках.
          </p>
        </div>
      </div>
    </Card>
  );
}
