import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { usePlansStore } from '../../../stores/usePlansStore';
import { useDailyStore } from '../../../stores/useDailyStore';
import { getCurrentDateISO } from '../../../utils/date-formatters';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

/**
 * Step 8: Monthly Focus - Select 3 main projects for this month
 * This is the final step that completes onboarding
 */
export function Step8MonthlyFocus({ onBack, onComplete }: StepProps) {
  const activePlan = usePlansStore((state) => state.activePlan);
  const setMainForMonth = useDailyStore((state) => state.setMainForMonth);

  const [selectedProjects, setSelectedProjects] = useState<string[]>(['', '', '']);
  const [customInputs, setCustomInputs] = useState<boolean[]>([true, true, true]);

  // Get projects from active 90-day plan
  const planProjects = activePlan?.projects.map((p) => p.title) || [];

  useEffect(() => {
    // Pre-fill with first 3 projects from plan if available
    if (planProjects.length >= 3 && selectedProjects.every((p) => p === '')) {
      setSelectedProjects([planProjects[0]!, planProjects[1]!, planProjects[2]!]);
      setCustomInputs([false, false, false]);
    }
  }, []);

  const handleSelectFromPlan = (index: number, projectTitle: string) => {
    const newProjects = [...selectedProjects];
    newProjects[index] = projectTitle;
    setSelectedProjects(newProjects);

    const newCustom = [...customInputs];
    newCustom[index] = false;
    setCustomInputs(newCustom);
  };

  const handleCustomInput = (index: number) => {
    const newCustom = [...customInputs];
    newCustom[index] = true;
    setCustomInputs(newCustom);

    const newProjects = [...selectedProjects];
    newProjects[index] = '';
    setSelectedProjects(newProjects);
  };

  const handleChange = (index: number, value: string) => {
    const newProjects = [...selectedProjects];
    newProjects[index] = value;
    setSelectedProjects(newProjects);
  };

  const handleComplete = () => {
    const validProjects = selectedProjects.filter((p) => p.trim() !== '');

    if (validProjects.length === 3) {
      const today = getCurrentDateISO();
      setMainForMonth(today, selectedProjects as [string, string, string]);
      onComplete();
    }
  };

  const allFilled = selectedProjects.every((p) => p.trim() !== '');

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="col-span-2">
        <h2 className="text-3xl font-bold text-text-primary mb-4">
          Главное на этот месяц
        </h2>

        <p className="text-text-secondary mb-4">
          Выберите 3 проекта, на которых вы сфокусируетесь ежедневно.
        </p>

        {/* Important Note */}
        <div className="bg-accent-orange/10 border border-warning/20 p-4 rounded-glass-sm mb-6">
          <p className="text-sm text-text-primary">
            <strong>⚠️ Важно:</strong> Эти 3 проекта будут отображаться на каждой
            ежедневной странице в течение месяца. Изменение в середине месяца возможно,
            но потребует подтверждения.
          </p>
        </div>

        {/* Hint Box */}
        <div className="bg-accent-blue/10 border border-accent-blue/20 p-4 rounded-glass-sm mb-6">
          <p className="text-sm text-text-secondary">
            <strong>💡 Подсказка:</strong> Формулируйте как завершенный результат.
            Вместо "плохая спина" → "Создал(а) сильную, здоровую спину к 31.12.2024"
          </p>
        </div>

        {/* Project Selection */}
        <div className="space-y-4 mb-6">
          {selectedProjects.map((project, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-text-secondary font-medium">
                  Проект {index + 1}:
                </span>
              </div>

              {customInputs[index] ? (
                // Custom input
                <div className="space-y-2">
                  <Input
                    value={project}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder="Введите название проекта..."
                  />
                  {planProjects.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-text-muted">Или выберите:</span>
                      {planProjects.map((planProject) => (
                        <button
                          key={planProject}
                          onClick={() => handleSelectFromPlan(index, planProject)}
                          className="text-xs px-2 py-1 bg-glass-light hover:bg-primary hover:text-white rounded transition-colors border border-glass-border"
                        >
                          {planProject}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Selected from plan
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-success/10 border border-success/30 px-4 py-2 rounded-glass-sm">
                    {project}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCustomInput(index)}
                  >
                    Изменить
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-glass-light p-4 rounded-glass-sm mb-6">
          <p className="text-sm text-text-secondary">
            Заполнено: <strong>{selectedProjects.filter((p) => p.trim()).length} / 3</strong>
          </p>
          {!allFilled && (
            <p className="text-sm text-warning mt-1">
              ⚠️ Заполните все 3 проекта
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={onBack}>
            Назад
          </Button>

          <Button onClick={handleComplete} disabled={!allFilled} size="lg">
            Начать работу 🚀
          </Button>
        </div>
      </div>

      {/* Sidebar: 90-Day Plan */}
      <div className="col-span-1">
        <div className="bg-glass-light rounded-glass-sm p-4 sticky top-0">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">
            📊 Ваш план на 90 дней:
          </h3>
          {planProjects.length > 0 ? (
            <ul className="space-y-2">
              {planProjects.map((project) => (
                <li key={project} className="text-sm text-text-secondary leading-snug">
                  • {project}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-muted italic">
              План не создан
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
