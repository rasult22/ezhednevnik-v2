import { useState } from 'react';
import { Card } from '../../../components/layout/Card';
import { Container } from '../../../components/layout/Container';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { useGoalsStore } from '../../../stores/useGoalsStore';
import { Goal } from '../../../types';

/**
 * 10-Year Goals Screen - Glassmorphism style
 */
export default function Goals10YearsScreen() {
  const goals = useGoalsStore((state) => state.goals.tenYear);
  const updateGoals = useGoalsStore((state) => state.updateGoals);

  const [editingGoals, setEditingGoals] = useState<Record<string, string>>({});

  const handleAdd = () => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateGoals('tenYear', [...goals, newGoal]);
    setEditingGoals({ ...editingGoals, [newGoal.id]: '' });
  };

  const handleChange = (id: string, content: string) => {
    setEditingGoals({ ...editingGoals, [id]: content });
    const updatedGoals = goals.map((g) =>
      g.id === id
        ? { ...g, content, updatedAt: new Date().toISOString() }
        : g
    );
    updateGoals('tenYear', updatedGoals);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Удалить эту цель?')) {
      const updatedGoals = goals.filter((g) => g.id !== id);
      updateGoals('tenYear', updatedGoals);
      const newEditing = { ...editingGoals };
      delete newEditing[id];
      setEditingGoals(newEditing);
    }
  };

  return (
    <Container size="xl">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-3">
            Цели на 10 лет
          </h1>
          <p className="text-lg text-text-secondary">
            Опишите вашу жизнь через 10 лет. Каким человеком вы станете?
          </p>
        </div>

        {/* Two-column layout for wide screens */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main content - Goals List */}
          <div className="xl:col-span-2 space-y-4">
            {/* Info Card */}
            <Card variant="gradient" accentColor="purple">
              <p className="text-sm text-text-secondary">
                <strong className="text-text-primary">Совет:</strong> Думайте масштабно. Долгосрочные цели
                задают направление всей вашей жизни. Они не обязательно должны быть
                конкретными — важна общая картина и вдохновение.
              </p>
            </Card>

            {/* Empty state */}
            {goals.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <p className="text-text-muted mb-4">
                    У вас пока нет целей на 10 лет
                  </p>
                  <Button onClick={handleAdd}>Добавить первую цель</Button>
                </div>
              </Card>
            )}

            {/* Goals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {goals.map((goal, index) => (
                <Card key={goal.id} variant="accent" accentColor="purple">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-accent-purple">
                        Цель {index + 1}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(goal.id)}
                        className="text-danger hover:text-danger"
                      >
                        Удалить
                      </Button>
                    </div>

                    <Textarea
                      value={editingGoals[goal.id] ?? goal.content}
                      onChange={(e) => handleChange(goal.id, e.target.value)}
                      placeholder="Опишите вашу цель на 10 лет..."
                      rows={4}
                    />

                    <div className="text-xs text-text-muted">
                      Создано: {new Date(goal.createdAt).toLocaleDateString('ru-RU')}
                      {goal.updatedAt !== goal.createdAt && (
                        <> • Обновлено: {new Date(goal.updatedAt).toLocaleDateString('ru-RU')}</>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Add Button */}
            {goals.length > 0 && (
              <Button onClick={handleAdd} variant="secondary" className="w-full">
                + Добавить ещё цель
              </Button>
            )}
          </div>

          {/* Sidebar - Examples */}
          <div className="xl:col-span-1">
            <Card>
              <h3 className="font-semibold text-text-primary mb-4">
                Примеры целей на 10 лет:
              </h3>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="p-3 bg-glass-light rounded-glass-sm border border-glass-border-light">
                  Стать финансово независимым с пассивным доходом 500к+ в месяц
                </li>
                <li className="p-3 bg-glass-light rounded-glass-sm border border-glass-border-light">
                  Построить бизнес-империю из 3-5 прибыльных компаний
                </li>
                <li className="p-3 bg-glass-light rounded-glass-sm border border-glass-border-light">
                  Жить в собственном доме у моря с семьёй
                </li>
                <li className="p-3 bg-glass-light rounded-glass-sm border border-glass-border-light">
                  Быть здоровым, энергичным, в отличной физической форме
                </li>
                <li className="p-3 bg-glass-light rounded-glass-sm border border-glass-border-light">
                  Создать образовательную платформу, которая помогла 100 000+ людей
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
