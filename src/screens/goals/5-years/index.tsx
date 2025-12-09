import { useState } from 'react';
import { Card } from '../../../components/layout/Card';
import { Container } from '../../../components/layout/Container';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { useGoalsStore } from '../../../stores/useGoalsStore';
import { Goal } from '../../../types';

/**
 * 5-Year Goals Screen - Glassmorphism dark theme
 */
export default function Goals5YearsScreen() {
  const goals5yr = useGoalsStore((state) => state.goals.fiveYear);
  const goals10yr = useGoalsStore((state) => state.goals.tenYear);
  const updateGoals = useGoalsStore((state) => state.updateGoals);

  const [editingGoals, setEditingGoals] = useState<Record<string, string>>({});

  const handleAdd = () => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateGoals('fiveYear', [...goals5yr, newGoal]);
    setEditingGoals({ ...editingGoals, [newGoal.id]: '' });
  };

  const handleChange = (id: string, content: string) => {
    setEditingGoals({ ...editingGoals, [id]: content });
    const updatedGoals = goals5yr.map((g) =>
      g.id === id
        ? { ...g, content, updatedAt: new Date().toISOString() }
        : g
    );
    updateGoals('fiveYear', updatedGoals);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Удалить эту цель?')) {
      const updatedGoals = goals5yr.filter((g) => g.id !== id);
      updateGoals('fiveYear', updatedGoals);
      const newEditing = { ...editingGoals };
      delete newEditing[id];
      setEditingGoals(newEditing);
    }
  };

  return (
    <Container size="xl">
      <div className="py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-3">
                Цели на 5 лет
              </h1>
              <p className="text-lg text-text-secondary">
                Промежуточные вехи на пути к 10-летним целям
              </p>
            </div>

            {/* Info Card */}
            <Card variant="gradient" accentColor="emerald">
              <p className="text-sm text-text-secondary">
                <strong className="text-text-primary">Совет:</strong> 5-летние цели должны быть мостом между
                вашим видением на 10 лет и конкретными шагами на 1 год. Они более
                конкретны, чем 10-летние, но всё ещё оставляют пространство для маневра.
              </p>
            </Card>

            {/* Goals List */}
            {goals5yr.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <p className="text-text-muted mb-4">
                    У вас пока нет целей на 5 лет
                  </p>
                  <Button onClick={handleAdd}>Добавить первую цель</Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {goals5yr.map((goal, index) => (
                  <Card key={goal.id} variant="accent" accentColor="emerald">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-accent-emerald">
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
                        placeholder="Опишите вашу цель на 5 лет..."
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
            )}

            {/* Add Button */}
            {goals5yr.length > 0 && (
              <Button onClick={handleAdd} variant="secondary" className="w-full">
                + Добавить ещё цель
              </Button>
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <div className="sticky top-4 space-y-6">
              {/* 10-Year Goals Context */}
              <Card>
                <h3 className="text-sm font-semibold text-text-primary mb-4">
                  Ваши цели на 10 лет:
                </h3>
                {goals10yr.length > 0 ? (
                  <ul className="space-y-3">
                    {goals10yr.map((goal) => (
                      <li key={goal.id} className="text-sm text-text-secondary leading-snug pb-3 border-b border-glass-border last:border-0">
                        {goal.content || <em className="text-text-muted">Пусто</em>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-text-muted italic">
                    Цели на 10 лет не указаны
                  </p>
                )}
              </Card>

              {/* Examples */}
              <Card>
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Примеры целей на 5 лет:
                </h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="p-2 bg-glass-light rounded-glass-sm">Запустить и масштабировать 1-2 бизнеса до 500к/мес</li>
                  <li className="p-2 bg-glass-light rounded-glass-sm">Накопить 10 млн руб инвестиционного капитала</li>
                  <li className="p-2 bg-glass-light rounded-glass-sm">Переехать в дом у моря</li>
                  <li className="p-2 bg-glass-light rounded-glass-sm">Пробежать марафон за 3:30</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
