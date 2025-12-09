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
      active: 'bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30',
      completed: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
      archived: 'bg-glass-light text-text-muted border-glass-border',
    };
    const labels = {
      active: 'Активный',
      completed: 'Завершён',
      archived: 'Архивный',
    };
    return (
      <span
        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${badges[status as keyof typeof badges]}`}
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
            <h1 className="text-4xl font-bold gradient-text mb-3">
              Планы на 90 дней
            </h1>
            <p className="text-lg text-text-secondary">
              Квартальное планирование для достижения годовых целей
            </p>
          </div>
          <Button onClick={() => navigate('/plans/new')} size="lg">
            + Создать новый план
          </Button>
        </div>

        {/* Info Card */}
        <Card variant="gradient" accentColor="purple" className="mb-6">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">💡 Система 90 дней:</strong> Каждые 90 дней вы фокусируетесь
            на 3-6 главных проектах, которые приближают вас к годовым целям.
            Из этих проектов вы выбираете 3 для ежедневного фокуса.
          </p>
        </Card>

        {/* Plans List */}
        {sortedPlans.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                У вас пока нет планов на 90 дней
              </h3>
              <p className="text-text-muted mb-6">
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
                variant={plan.status === 'active' ? 'accent' : 'default'}
                accentColor={plan.status === 'active' ? 'purple' : 'blue'}
                className={
                  plan.status === 'active'
                    ? 'ring-2 ring-accent-purple/30'
                    : ''
                }
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-text-primary">
                        План: {formatDateRU(plan.startDate)} -{' '}
                        {formatDateRU(plan.endDate)}
                      </h3>
                      {getStatusBadge(plan.status)}
                    </div>
                    <p className="text-sm text-text-muted">
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
                  <h4 className="text-sm font-semibold text-text-primary mb-3">
                    Проекты ({plan.projects.length}):
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {plan.projects.map((project) => (
                      <div
                        key={project.id}
                        className={`p-3 rounded-glass-sm border backdrop-blur-sm transition-all ${
                          project.completed
                            ? 'bg-accent-emerald/10 border-accent-emerald/30'
                            : 'bg-glass-light border-glass-border'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">
                            {project.completed ? '✅' : '⭕'}
                          </span>
                          <span className="text-sm text-text-primary flex-1">
                            {project.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="mt-4 pt-4 border-t border-glass-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
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
            <h3 className="font-semibold text-text-primary mb-3">
              📈 Статистика:
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {sortedPlans.length}
                </div>
                <div className="text-sm text-text-secondary">Всего планов</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-emerald">
                  {
                    sortedPlans.filter((p) => p.status === 'completed')
                      .length
                  }
                </div>
                <div className="text-sm text-text-secondary">Завершённых</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-orange">
                  {sortedPlans.reduce(
                    (acc, p) =>
                      acc + p.projects.filter((pr) => pr.completed).length,
                    0
                  )}
                </div>
                <div className="text-sm text-text-secondary">
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
