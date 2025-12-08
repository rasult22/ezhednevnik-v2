import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { useGoalsStore } from '../../../stores/useGoalsStore';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

/**
 * Step 4: 10-Year Goals
 */
export function Step4Goals10Years({ onNext, onBack }: StepProps) {
  const goals = useGoalsStore((state) => state.goals.tenYear);
  const updateGoals = useGoalsStore((state) => state.updateGoals);

  const [goalTexts, setGoalTexts] = useState<string[]>(() =>
    goals.length > 0 ? goals.map((g) => g.content) : ['']
  );

  const handleAddGoal = () => {
    setGoalTexts([...goalTexts, '']);
  };

  const handleRemoveGoal = (index: number) => {
    const newGoals = goalTexts.filter((_, i) => i !== index);
    setGoalTexts(newGoals.length > 0 ? newGoals : ['']);
  };

  const handleChange = (index: number, value: string) => {
    const newGoals = [...goalTexts];
    newGoals[index] = value;
    setGoalTexts(newGoals);
  };

  const handleNext = () => {
    // Save to store
    const goalsToSave = goalTexts
      .filter((text) => text.trim() !== '')
      .map((text) => ({
        id: crypto.randomUUID(),
        content: text.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

    updateGoals('tenYear', goalsToSave);
    onNext();
  };

  const handleSkip = () => {
    updateGoals('tenYear', []);
    onNext();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Цели на 10 лет
      </h2>

      <p className="text-gray-600 mb-6">
        Опишите вашу жизнь через 10 лет. Каким человеком вы станете?
        Чего достигнете? Как будет выглядеть ваша жизнь?
      </p>

      {/* Hint Box */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700">
          <strong>💡 Подсказка:</strong> Не думайте о "как". Просто мечтайте. Примеры:
          "Построил успешный бизнес с годовым доходом 100 млн руб.", "Живу в собственном доме у моря",
          "Владею 5 языками".
        </p>
      </div>

      {/* Goals Input */}
      <div className="space-y-4 mb-6">
        {goalTexts.map((text, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <Textarea
                value={text}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder={`Цель ${index + 1}...`}
                rows={3}
                autoSize
                maxHeight={200}
              />
            </div>
            {goalTexts.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveGoal(index)}
                className="text-gray-400 hover:text-danger"
              >
                ✕
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Add More Button */}
      {goalTexts.length < 10 && (
        <Button
          variant="secondary"
          onClick={handleAddGoal}
          className="mb-6"
        >
          + Добавить еще цель
        </Button>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="secondary" onClick={onBack}>
          Назад
        </Button>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleSkip}>
            Пропустить (вернуться позже)
          </Button>
          <Button onClick={handleNext}>
            Далее
          </Button>
        </div>
      </div>
    </div>
  );
}
