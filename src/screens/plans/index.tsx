import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { usePlansStore } from '../../stores/usePlansStore';
import { formatDateRU } from '../../utils/date-formatters';

/**
 * 90-Day Plans List Screen - Overview of all quarterly plans
 *
 * Features:
 * - Shows all plans (active, completed, archived)
 * - Active plan highlighted at top
 * - Navigation to create new plan or view existing
 * - Status badges
 */
export default function PlansListScreen() {
  const navigate = useNavigate();
  const plans = usePlansStore((state) => state.plans);

  // Sort plans: active first, then by start date descending
  const sortedPlans = [...plans].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const getStatusBadge = (status: string) => {
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
        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${badges[status as keyof typeof badges]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <Container size="lg">
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Планы на 90 дней
            </h1>
            <p className="text-lg text-gray-600">
              Квартальное планирование для достижения годовых целей
            </p>
          </div>
          <Button onClick={() => navigate('/plans/new')} size="lg">
            + Создать новый план
          </Button>
        </div>

        {/* Info Card */}
        <Card className="mb-6">
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
            <p className="text-sm text-gray-800">
              <strong>💡 Система 90 дней:</strong> Каждые 90 дней вы фокусируетесь
              на 3-6 главных проектах, которые приближают вас к годовым целям.
              Из этих проектов вы выбираете 3 для ежедневного фокуса.
            </p>
          </div>
        </Card>

        {/* Plans List */}
        {sortedPlans.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                У вас пока нет планов на 90 дней
              </h3>
              <p className="text-gray-500 mb-6">
                Создайте свой первый квартальный план для структурированного
                достижения целей
              </p>
              <Button onClick={() => navigate('/plans/new')}>
                Создать первый план
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedPlans.map((plan) => (
              <Card
                key={plan.id}
                className={
                  plan.status === 'active'
                    ? 'border-2 border-primary shadow-md'
                    : ''
                }
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        План: {formatDateRU(plan.startDate)} -{' '}
                        {formatDateRU(plan.endDate)}
                      </h3>
                      {getStatusBadge(plan.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      Создан: {new Date(plan.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/plans/${plan.id}`)}
                  >
                    Открыть
                  </Button>
                </div>

                {/* Projects List */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Проекты ({plan.projects.length}):
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {plan.projects.map((project) => (
                      <div
                        key={project.id}
                        className={`p-3 rounded border ${
                          project.completed
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">
                            {project.completed ? '✅' : '⭕'}
                          </span>
                          <span className="text-sm text-gray-800 flex-1">
                            {project.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Завершено проектов:{' '}
                      <strong>
                        {plan.projects.filter((p) => p.completed).length} /{' '}
                        {plan.projects.length}
                      </strong>
                    </span>
                    {plan.status === 'active' && (
                      <span className="text-primary font-medium">
                        🔥 Активный план
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {sortedPlans.length > 0 && (
          <Card className="mt-8">
            <h3 className="font-semibold text-gray-800 mb-3">
              📈 Статистика:
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {sortedPlans.length}
                </div>
                <div className="text-sm text-gray-600">Всего планов</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {
                    sortedPlans.filter((p) => p.status === 'completed')
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">Завершённых</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {sortedPlans.reduce(
                    (acc, p) =>
                      acc + p.projects.filter((pr) => pr.completed).length,
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Выполненных проектов
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Container>
  );
}
