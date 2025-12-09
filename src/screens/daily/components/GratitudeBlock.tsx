import { Card } from '../../../components/layout/Card';
import { Input } from '../../../components/ui/Input';
import { useDailyStore } from '../../../stores/useDailyStore';

interface GratitudeBlockProps {
  date: string;
  gratitude: [string, string, string];
  isReadOnly: boolean;
}

/**
 * GratitudeBlock - 3 gratitude entries
 */
export function GratitudeBlock({
  date,
  gratitude,
  isReadOnly,
}: GratitudeBlockProps) {
  const updateGratitude = useDailyStore((state) => state.updateGratitude);

  const handleChange = (index: number, value: string) => {
    if (isReadOnly) return;
    updateGratitude(date, index, value);
  };

  return (
    <Card
      title="Благодарность"
      subtitle="Фокус на позитивном для правильного настроя"
      variant="gradient"
      accentColor="emerald"
    >
      <div className="space-y-3">
        {gratitude.map((entry, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-accent-emerald font-medium">{index + 1}.</span>
            <div className="flex-1">
              <Input
                value={entry}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="Я благодарен за..."
                disabled={isReadOnly}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-accent-emerald/10 border border-accent-emerald/20 rounded-glass-sm">
        <p className="text-xs text-text-secondary">
          Практика благодарности настраивает сознание на изобилие и возможности
        </p>
      </div>
    </Card>
  );
}
