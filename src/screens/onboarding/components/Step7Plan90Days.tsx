import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useGoalsStore } from '../../../stores/useGoalsStore';
import { usePlansStore } from '../../../stores/usePlansStore';
import { addDays, getCurrentDateISO } from '../../../utils/date-formatters';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

/**
 * Step 7: Create 90-Day Plan (simplified version for onboarding)
 */
export function Step7Plan90Days({ onNext, onBack }: StepProps) {
  const goalsOneYear = useGoalsStore((state) => state.goals.oneYear);
  const createPlan = usePlansStore((state) => state.createPlan);

  const [projects, setProjects] = useState<string[]>(['', '', '']);

  const handleChange = (index: number, value: string) => {
    const newProjects = [...projects];
    newProjects[index] = value;
    setProjects(newProjects);
  };

  const handleAddProject = () => {
    if (projects.length < 8) {
      setProjects([...projects, '']);
    }
  };

  const handleRemoveProject = (index: number) => {
    if (projects.length > 3) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  const handleNext = () => {
    const validProjects = projects.filter((p) => p.trim() !== '');

    if (validProjects.length >= 3) {
      const startDate = getCurrentDateISO();
      const endDate = addDays(startDate, 90);

      createPlan(startDate, endDate, validProjects);
      onNext();
    }
  };

  const filledProjects = projects.filter((p) => p.trim() !== '').length;
  const canProceed = filledProjects >= 3;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="col-span-2">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          План на 90 дней
        </h2>

        <p className="text-gray-600 mb-4">
          Выберите 3-6 главных проектов на ближайшие 90 дней,
          которые приведут вас к годовым целям.
        </p>

        {/* Hint Box */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700">
            <strong>💡 Подсказка:</strong> Формулируйте как проекты с конечным результатом.
            Например: "Создал сайт компании", "Набрал первых 10 клиентов",
            "Завершил ремонт в квартире"
          </p>
        </div>

        {/* Projects Input */}
        <div className="space-y-3 mb-6">
          {projects.map((project, index) => (
            <div key={index} className="flex gap-2 items-center">
              <span className="text-gray-400 font-medium w-6">
                {index + 1}.
              </span>
              <div className="flex-1">
                <Input
                  value={project}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={`Проект ${index + 1}...`}
                />
              </div>
              {projects.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProject(index)}
                  className="text-gray-400 hover:text-danger"
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Add More Button */}
        {projects.length < 8 && (
          <Button
            variant="secondary"
            onClick={handleAddProject}
            className="mb-6"
          >
            + Добавить проект (до 8 максимум)
          </Button>
        )}

        {/* Progress Indicator */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700">
            Заполнено проектов: <strong>{filledProjects} / минимум 3</strong>
          </p>
          {!canProceed && (
            <p className="text-sm text-warning mt-1">
              ⚠️ Заполните минимум 3 проекта для продолжения
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={onBack}>
            Назад
          </Button>

          <Button onClick={handleNext} disabled={!canProceed}>
            Далее
          </Button>
        </div>
      </div>

      {/* Sidebar: 1-Year Goals */}
      <div className="col-span-1">
        <div className="bg-gray-50 rounded-lg p-4 sticky top-0">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            📅 Ваши годовые цели:
          </h3>
          {goalsOneYear.length > 0 ? (
            <ul className="space-y-2">
              {goalsOneYear.map((goal) => (
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
