import { useState } from 'react';
import { Card } from '../../../components/layout/Card';
import { Container } from '../../../components/layout/Container';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { useGoalsStore } from '../../../stores/useGoalsStore';
import { Goal } from '../../../types';

/**
 * 10-Year Goals Screen - Vision for the distant future
 *
 * Features:
 * - Add/edit/delete long-term goals
 * - Clean list interface
 * - Auto-saves changes (debounced)
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
    // Update in store
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
    <Container size="lg">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Цели на 10 лет
          </h1>
          <p className="text-lg text-gray-600">
            Опишите вашу жизнь через 10 лет. Каким человеком вы станете?
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-gray-800">
              <strong>💡 Совет:</strong> Думайте масштабно. Долгосрочные цели
              задают направление всей вашей жизни. Они не обязательно должны быть
              конкретными — важна общая картина и вдохновение.
            </p>
          </div>
        </Card>

        {/* Goals List */}
        <div className="space-y-4 mb-6">
          {goals.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  У вас пока нет целей на 10 лет
                </p>
                <Button onClick={handleAdd}>Добавить первую цель</Button>
              </div>
            </Card>
          )}

          {goals.map((goal, index) => (
            <Card key={goal.id}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Цель {index + 1}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(goal.id)}
                    className="text-danger hover:text-danger hover:bg-red-50"
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

                <div className="text-xs text-gray-400">
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

        {/* Examples */}
        <Card className="mt-8">
          <h3 className="font-semibold text-gray-800 mb-3">
            Примеры целей на 10 лет:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Стать финансово независимым с пассивным доходом 500к+ в месяц</li>
            <li>• Построить бизнес-империю из 3-5 прибыльных компаний</li>
            <li>• Жить в собственном доме у моря с семьёй</li>
            <li>• Быть здоровым, энергичным, в отличной физической форме</li>
            <li>• Создать образовательную платформу, которая помогла 100 000+ людей</li>
          </ul>
        </Card>
      </div>
    </Container>
  );
}
