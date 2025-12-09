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
      variant="gradient"
      accentColor="orange"
    >
      <div className="space-y-4">
        {/* Affirmation Textarea */}
        <Textarea
          value={affirmation}
          onChange={(e) => handleAffirmationChange(e.target.value)}
          placeholder="Я получаю в качестве суммарного денежного вознаграждения 500 000 рублей в месяц"
          rows={3}
          disabled={isReadOnly}
        />

        {/* Confirmation Checkbox */}
        <div className="flex items-center gap-3 pt-3 border-t border-glass-border">
          <Checkbox
            checked={confirmed}
            onChange={handleConfirmToggle}
            disabled={isReadOnly}
          />
          <label className="text-sm font-medium text-text-secondary cursor-pointer">
            Подтверждаю установку (подпись)
          </label>
        </div>

        {confirmed && (
          <div className="p-3 bg-success/20 border border-success/30 rounded-glass-sm">
            <p className="text-sm text-success font-medium">
              Установка подтверждена
            </p>
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-accent-orange/10 border border-accent-orange/20 rounded-glass-sm">
          <p className="text-xs text-text-secondary">
            Формулируйте в настоящем времени, как уже достигнутый результат
          </p>
        </div>
      </div>
    </Card>
  );
}
