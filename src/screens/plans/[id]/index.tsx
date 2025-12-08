import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { usePlansStore } from '../../../stores/usePlansStore';
import { formatDateRU } from '../../../utils/date-formatters';

/**
 * Plan View/Edit Screen - View and manage a specific 90-day plan
 *
 * Features:
 * - View plan details (dates, projects, status)
 * - Toggle project completion (if active)
 * - Read-only mode for completed/archived plans
 * - Statistics and progress tracking
 */
export default function PlanViewScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const plans = usePlansStore((state) => state.plans);
  const toggleProjectCompletion = usePlansStore(
    (state) => state.toggleProjectCompletion
  );

  const [plan, setPlan] = useState(plans.find((p) => p.id === id));

  useEffect(() => {
    const foundPlan = plans.find((p) => p.id === id);
    if (!foundPlan) {
      navigate('/plans');
      return;
    }
    setPlan(foundPlan);
  }, [id, plans, navigate]);

  if (!plan) {
    return (
      <Container size="lg">
        <div className="py-8">
          <div className="text-center">
            <p className="text-gray-500">План не найден...</p>
            <Button onClick={() => navigate('/plans')} className="mt-4">
              Вернуться к списку
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const isEditable = plan.status === 'active';
  const completedCount = plan.projects.filter((p) => p.completed).length;
  const progressPercent = Math.round(
    (completedCount / plan.projects.length) * 100
  );

  const getStatusBadge = () => {
    const badges = {
      active: 'bg-green-100 text-green-800 border-green-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
      archived: 'bg-gray-100 text-gray-600 border-gray-300',
    };
    const labels = {
      active: 'Активный',
      completed: 'Завершён',
      archived: 'Архивный',
    };
    return (
      <span
        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${badges[plan.status]}`}
      >
        {labels[plan.status]}
      </span>
    );
  };

  return (
    <Container size="lg">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/plans')}
            className="mb-4"
          >
            ← Назад к списку
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                План на 90 дней
              </h1>
              <p className="text-lg text-gray-600">
                {formatDateRU(plan.startDate)} - {formatDateRU(plan.endDate)}
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        {/* Read-only Warning */}
        {!isEditable && (
          <Card className="mb-6">
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
              <p className="text-sm text-gray-700">
                📖 Этот план находится в режиме просмотра. Изменение проектов
                доступно только для активного плана.
              </p>
            </div>
          </Card>
        )}

        {/* Progress Card */}
        <Card className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Прогресс выполнения:
          </h3>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  {completedCount} / {plan.projects.length} проектов
                </span>
                <span className="font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {completedCount}
                </div>
                <div className="text-xs text-gray-600">Завершено</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {plan.projects.length - completedCount}
                </div>
                <div className="text-xs text-gray-600">В работе</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {plan.projects.length}
                </div>
                <div className="text-xs text-gray-600">Всего</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Projects List */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">
              Проекты ({plan.projects.length}):
            </h3>
            {isEditable && (
              <p className="text-sm text-gray-500">
                Отмечайте проекты как завершённые
              </p>
            )}
          </div>

          <div className="space-y-3">
            {plan.projects.map((project, index) => (
              <div
                key={project.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  project.completed
                    ? 'bg-green-50 border-green-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={project.completed}
                    onChange={() =>
                      isEditable &&
                      toggleProjectCompletion(plan.id, project.id)
                    }
                    disabled={!isEditable}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-gray-700">
                        Проект {index + 1}
                      </span>
                      {project.completed && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                          ✓ Завершён
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-gray-800 ${
                        project.completed ? 'line-through opacity-75' : ''
                      }`}
                    >
                      {project.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Plan Info */}
        <Card className="mt-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Информация о плане:
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Создан:</span>
              <span className="font-medium">
                {new Date(plan.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Статус:</span>
              <span className="font-medium">
                {plan.status === 'active' && 'Активный'}
                {plan.status === 'completed' && 'Завершённый'}
                {plan.status === 'archived' && 'Архивный'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Длительность:</span>
              <span className="font-medium">
                {Math.round(
                  (new Date(plan.endDate).getTime() -
                    new Date(plan.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{' '}
                дней
              </span>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}
