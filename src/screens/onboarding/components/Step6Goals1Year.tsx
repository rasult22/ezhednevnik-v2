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
 * Step 6: 1-Year Goals (with 10-year and 5-year goals sidebar)
 */
export function Step6Goals1Year({ onNext, onBack }: StepProps) {
  const goals = useGoalsStore((state) => state.goals.oneYear);
  const goals10Year = useGoalsStore((state) => state.goals.tenYear);
  const goals5Year = useGoalsStore((state) => state.goals.fiveYear);
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

    updateGoals('oneYear', goalsToSave);
    onNext();
  };

  const handleSkip = () => {
    updateGoals('oneYear', []);
    onNext();
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="col-span-2">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Цели на 1 год
        </h2>

        <p className="text-gray-600 mb-4">
          Конкретные, измеримые цели на предстоящий год.
        </p>

        {/* Hint Box */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700">
            <strong>💡 Примеры:</strong> "Запустить бизнес по [направление]",
            "Заработать 5 млн рублей", "Похудеть на 15 кг", "Выучить английский до B2",
            "Купить квартиру"
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
              Пропустить
            </Button>
            <Button onClick={handleNext}>
              Далее
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar: 10-Year and 5-Year Goals */}
      <div className="col-span-1 space-y-4">
        {/* 10-Year Goals */}
        {goals10Year.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              🌟 Цели на 10 лет:
            </h3>
            <ul className="space-y-2">
              {goals10Year.map((goal) => (
                <li key={goal.id} className="text-xs text-gray-600 leading-snug">
                  • {goal.content}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5-Year Goals */}
        {goals5Year.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              🎯 Цели на 5 лет:
            </h3>
            <ul className="space-y-2">
              {goals5Year.map((goal) => (
                <li key={goal.id} className="text-xs text-gray-600 leading-snug">
                  • {goal.content}
                </li>
              ))}
            </ul>
          </div>
        )}

        {goals10Year.length === 0 && goals5Year.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-400 italic">
              Долгосрочные цели не указаны
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
