import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useHabitsStore } from '../../../stores/useHabitsStore';

interface HabitSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Predefined colors for habits (vibrant palette)
const HABIT_COLORS = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
];

/**
 * Habit Settings Modal
 * Manage habits: add, delete, edit colors
 */
export function HabitSettingsModal({ isOpen, onClose }: HabitSettingsModalProps) {
  const habits = useHabitsStore((state) => state.habits);
  const addHabit = useHabitsStore((state) => state.addHabit);
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);
  const updateHabit = useHabitsStore((state) => state.updateHabit);

  const [newHabitName, setNewHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]!);

  const handleAddHabit = () => {
    if (newHabitName.trim() === '') return;

    addHabit(newHabitName.trim(), selectedColor);
    setNewHabitName('');
    setSelectedColor(HABIT_COLORS[0]!);
  };

  const handleDeleteHabit = (id: string) => {
    if (confirm('Удалить эту привычку? Вся история будет потеряна.')) {
      deleteHabit(id);
    }
  };

  const handleColorChange = (habitId: string, color: string) => {
    updateHabit(habitId, { color });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Управление привычками"
      size="md"
    >
      <div className="space-y-6">
        {/* Add New Habit */}
        <div className="bg-glass-light rounded-glass-sm p-4 border border-glass-border">
          <h4 className="text-sm font-semibold text-text-primary mb-3">
            Добавить привычку
          </h4>

          <div className="space-y-3">
            {/* Habit Name */}
            <Input
              type="text"
              placeholder="Название привычки (напр. 'Спорт', 'Чтение')"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddHabit();
                }
              }}
            />

            {/* Color Picker */}
            <div>
              <label className="text-xs text-text-secondary mb-2 block">
                Выберите цвет
              </label>
              <div className="flex gap-2 flex-wrap">
                {HABIT_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      w-10 h-10 rounded-lg transition-all
                      ${
                        selectedColor === color
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-300 scale-110'
                          : 'hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Add Button */}
            <Button
              variant="primary"
              onClick={handleAddHabit}
              disabled={newHabitName.trim() === ''}
              className="w-full"
            >
              Добавить
            </Button>
          </div>
        </div>

        {/* Existing Habits List */}
        {habits.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3">
              Мои привычки ({habits.length})
            </h4>

            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="bg-glass-light rounded-glass-sm p-4 border border-glass-border hover:border-accent-blue/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Habit Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-6 h-6 rounded-md flex-shrink-0"
                        style={{ backgroundColor: habit.color }}
                      />
                      <span className="text-sm font-medium text-text-primary truncate">
                        {habit.name}
                      </span>
                    </div>

                    {/* Color Selector (mini) */}
                    <div className="flex items-center gap-1">
                      {HABIT_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorChange(habit.id, color)}
                          className={`
                            w-5 h-5 rounded-md transition-all
                            ${
                              habit.color === color
                                ? 'ring-1 ring-white scale-110'
                                : 'opacity-50 hover:opacity-100 hover:scale-105'
                            }
                          `}
                          style={{ backgroundColor: color }}
                          title={`Изменить цвет на ${color}`}
                        />
                      ))}
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-2 text-text-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                      title="Удалить привычку"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="mt-2 text-xs text-text-muted">
                    {habit.completedDates.length} дней выполнено
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-accent-blue/10 border border-accent-blue/30 p-3 rounded-glass-sm">
          <p className="text-xs text-text-secondary">
            💡 Отмечайте привычки ежедневно на главной странице. Кликните на квадратик, чтобы
            отметить выполнение за конкретный день.
          </p>
        </div>
      </div>
    </Modal>
  );
}
