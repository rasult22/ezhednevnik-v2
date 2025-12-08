import { useState } from 'react';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { useGoalsStore } from '../../../stores/useGoalsStore';
import { Goal } from '../../../types';

/**
 * 1-Year Goals Screen - Concrete annual objectives
 *
 * Features:
 * - Add/edit/delete 1-year goals
 * - Sidebar with 10-year and 5-year goals for context
 * - Most concrete and measurable goals
 * - Auto-saves changes
 */
export default function Goals1YearScreen() {
  const goals1yr = useGoalsStore((state) => state.goals.oneYear);
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
    updateGoals('oneYear', [...goals1yr, newGoal]);
    setEditingGoals({ ...editingGoals, [newGoal.id]: '' });
  };

  const handleChange = (id: string, content: string) => {
    setEditingGoals({ ...editingGoals, [id]: content });
    const updatedGoals = goals1yr.map((g) =>
      g.id === id
        ? { ...g, content, updatedAt: new Date().toISOString() }
        : g
    );
    updateGoals('oneYear', updatedGoals);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Удалить эту цель?')) {
      const updatedGoals = goals1yr.filter((g) => g.id !== id);
      updateGoals('oneYear', updatedGoals);
      const newEditing = { ...editingGoals };
      delete newEditing[id];
      setEditingGoals(newEditing);
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Цели на 1 год
            </h1>
            <p className="text-lg text-gray-600">
              Конкретные, измеримые цели на текущий год
            </p>
          </div>

          {/* Info Card */}
          <Card className="mb-6">
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <p className="text-sm text-gray-800">
                <strong>💡 Совет:</strong> Годовые цели должны быть максимально
                конкретными и измеримыми. Используйте числа, даты, результаты.
                Например: "Заработать 5 млн руб", "Запустить продукт к 1 июня",
                "Набрать 50 клиентов".
              </p>
            </div>
          </Card>

          {/* Goals List */}
          <div className="space-y-4 mb-6">
            {goals1yr.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    У вас пока нет целей на 1 год
                  </p>
                  <Button onClick={handleAdd}>Добавить первую цель</Button>
                </div>
              </Card>
            )}

            {goals1yr.map((goal, index) => (
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
                    placeholder="Опишите вашу цель на 1 год..."
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
          {goals1yr.length > 0 && (
            <Button onClick={handleAdd} variant="secondary" className="w-full">
              + Добавить ещё цель
            </Button>
          )}
        </div>

        {/* Sidebar: Context Goals */}
        <div className="col-span-1">
          <div className="sticky top-4 space-y-6">
            {/* 10-Year Goals */}
            <Card>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                🎯 Цели на 10 лет:
              </h3>
              {goals10yr.length > 0 ? (
                <ul className="space-y-3">
                  {goals10yr.map((goal) => (
                    <li key={goal.id} className="text-sm text-gray-600 leading-snug pb-3 border-b border-gray-100 last:border-0">
                      {goal.content || <em className="text-gray-400">Пусто</em>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Не указаны
                </p>
              )}
            </Card>

            {/* 5-Year Goals */}
            <Card>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                📊 Цели на 5 лет:
              </h3>
              {goals5yr.length > 0 ? (
                <ul className="space-y-3">
                  {goals5yr.map((goal) => (
                    <li key={goal.id} className="text-sm text-gray-600 leading-snug pb-3 border-b border-gray-100 last:border-0">
                      {goal.content || <em className="text-gray-400">Пусто</em>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Не указаны
                </p>
              )}
            </Card>

            {/* Examples */}
            <Card>
              <h3 className="text-xs font-semibold text-gray-700 mb-3">
                Примеры целей на 1 год:
              </h3>
              <ul className="space-y-2 text-xs text-gray-600">
                <li>• Заработать 5 млн руб за год</li>
                <li>• Запустить MVP продукта к 1 июня</li>
                <li>• Набрать 50 платящих клиентов</li>
                <li>• Пробежать полумарафон за 1:45</li>
                <li>• Прочитать 24 книги (2/месяц)</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
