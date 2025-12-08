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
 * Step 5: 5-Year Goals (with 10-year goals sidebar)
 */
export function Step5Goals5Years({ onNext, onBack }: StepProps) {
  const goals = useGoalsStore((state) => state.goals.fiveYear);
  const goals10Year = useGoalsStore((state) => state.goals.tenYear);
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
    const goalsToSave = goalTexts
      .filter((text) => text.trim() !== '')
      .map((text) => ({
        id: crypto.randomUUID(),
        content: text.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

    updateGoals('fiveYear', goalsToSave);
    onNext();
  };

  const handleSkip = () => {
    updateGoals('fiveYear', []);
    onNext();
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="col-span-2">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Цели на 5 лет
        </h2>

        <p className="text-gray-600 mb-6">
          Что вы хотите достичь через 5 лет? Какие шаги приведут вас
          к 10-летним целям?
        </p>

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
              Пропустить
            </Button>
            <Button onClick={handleNext}>
              Далее
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar: 10-Year Goals */}
      <div className="col-span-1">
        <div className="bg-gray-50 rounded-lg p-4 sticky top-0">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            📌 Ваши цели на 10 лет:
          </h3>
          {goals10Year.length > 0 ? (
            <ul className="space-y-2">
              {goals10Year.map((goal) => (
                <li key={goal.id} className="text-sm text-gray-600 leading-snug">
                  • {goal.content}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">
              Не указаны
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
