import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { usePlansStore } from '../../../stores/usePlansStore';
import { useGoalsStore } from '../../../stores/useGoalsStore';
import { getCurrentDateISO, addDays } from '../../../utils/date-formatters';
import { ProjectTransferModal } from '../components/ProjectTransferModal';

/**
 * Create New 90-Day Plan Screen
 *
 * Features:
 * - Date range selection (default: today + 90 days)
 * - 3-8 project inputs
 * - Project transfer from previous plan if exists
 * - Context sidebar with 1-year goals
 * - Validation
 */
export default function NewPlanScreen() {
  const navigate = useNavigate();
  const activePlan = usePlansStore((state) => state.activePlan);
  const createPlan = usePlansStore((state) => state.createPlan);
  const goalsOneYear = useGoalsStore((state) => state.goals.oneYear);

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [startDate, setStartDate] = useState(getCurrentDateISO());
  const [endDate, setEndDate] = useState(addDays(getCurrentDateISO(), 90));
  const [projects, setProjects] = useState<string[]>(['', '', '']);

  useEffect(() => {
    // Show transfer modal if there's an active plan
    if (activePlan) {
      setShowTransferModal(true);
    }
  }, [activePlan]);

  const handleProjectChange = (index: number, value: string) => {
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

  const handleTransfer = (selectedProjects: string[]) => {
    setProjects([...selectedProjects, '', '', '']);
    setShowTransferModal(false);
  };

  const handleSkipTransfer = () => {
    setShowTransferModal(false);
  };

  const handleCreate = () => {
    const validProjects = projects.filter((p) => p.trim() !== '');

    if (validProjects.length < 3) {
      alert('Минимум 3 проекта необходимо для создания плана');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      alert('Дата окончания должна быть позже даты начала');
      return;
    }

    createPlan(startDate, endDate, validProjects);
    navigate('/plans');
  };

  const filledProjects = projects.filter((p) => p.trim() !== '').length;
  const canCreate = filledProjects >= 3;

  return (
    <Container size="lg">
      <div className="py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold gradient-text mb-3">
                Создать план на 90 дней
              </h1>
              <p className="text-lg text-text-secondary">
                Выберите 3-6 главных проектов на следующий квартал
              </p>
            </div>

            {/* Warning if active plan exists */}
            {activePlan && (
              <Card variant="gradient" accentColor="orange" className="mb-6">
                <p className="text-sm text-text-secondary">
                  <strong className="text-text-primary">⚠️ Внимание:</strong> У вас уже есть активный план.
                  При создании нового плана текущий будет завершён автоматически.
                </p>
              </Card>
            )}

            {/* Date Range */}
            <Card className="mb-6">
              <h3 className="font-semibold text-text-primary mb-4">
                Период планирования:
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Дата начала:
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Дата окончания:
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Projects Input */}
            <Card className="mb-6">
              <h3 className="font-semibold text-text-primary mb-4">
                Проекты (3-8):
              </h3>

              {/* Hint */}
              <div className="bg-accent-orange/10 border border-accent-orange/30 p-4 rounded-glass-sm mb-4">
                <p className="text-sm text-text-secondary">
                  <strong className="text-text-primary">💡 Подсказка:</strong> Формулируйте как завершённые
                  результаты. Например: "Создал сайт компании", "Набрал 10
                  клиентов", "Завершил ремонт".
                </p>
              </div>

              {/* Project List */}
              <div className="space-y-3 mb-4">
                {projects.map((project, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-text-muted font-medium w-6">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <Input
                        value={project}
                        onChange={(e) =>
                          handleProjectChange(index, e.target.value)
                        }
                        placeholder={`Проект ${index + 1}...`}
                      />
                    </div>
                    {projects.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProject(index)}
                        className="text-text-muted hover:text-danger"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add More Button */}
              {projects.length < 8 && (
                <Button variant="secondary" onClick={handleAddProject}>
                  + Добавить проект
                </Button>
              )}
            </Card>

            {/* Progress Indicator */}
            <Card className="mb-6">
              <p className="text-sm text-text-secondary">
                Заполнено проектов:{' '}
                <strong>{filledProjects} / минимум 3</strong>
              </p>
              {!canCreate && (
                <p className="text-sm text-warning mt-2">
                  ⚠️ Заполните минимум 3 проекта для создания плана
                </p>
              )}
            </Card>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <Button variant="secondary" onClick={() => navigate('/plans')}>
                Отмена
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!canCreate}
                size="lg"
              >
                Создать план
              </Button>
            </div>
          </div>

          {/* Sidebar: 1-Year Goals */}
          <div className="col-span-1">
            <div className="sticky top-4">
              <Card>
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  🎯 Ваши цели на 1 год:
                </h3>
                {goalsOneYear.length > 0 ? (
                  <ul className="space-y-3">
                    {goalsOneYear.map((goal) => (
                      <li
                        key={goal.id}
                        className="text-sm text-text-secondary leading-snug pb-3 border-b border-glass-border-light last:border-0"
                      >
                        {goal.content || (
                          <em className="text-text-muted">Пусто</em>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-text-muted italic">
                    Цели на 1 год не указаны
                  </p>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Project Transfer Modal */}
        {showTransferModal && activePlan && (
          <ProjectTransferModal
            previousPlan={activePlan}
            onTransfer={handleTransfer}
            onSkip={handleSkipTransfer}
          />
        )}
      </div>
    </Container>
  );
}
