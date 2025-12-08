import { Card } from '../../../components/layout/Card';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Input } from '../../../components/ui/Input';
import { useDailyStore } from '../../../stores/useDailyStore';
import { Task } from '../../../types';

interface SecondaryNineBlockProps {
  date: string;
  tasks: Task[];
  isReadOnly: boolean;
}

/**
 * SecondaryNineBlock - 9 secondary tasks (the remaining 80%)
 *
 * Features:
 * - 9 optional tasks for calls, errands, reminders
 * - Less visual emphasis (smaller, lighter styling)
 * - Not required for daily completion
 * - Auto-saves changes
 */
export function SecondaryNineBlock({
  date,
  tasks,
  isReadOnly,
}: SecondaryNineBlockProps) {
  const toggleTask = useDailyStore((state) => state.toggleTask);
  const updateTaskContent = useDailyStore((state) => state.updateTaskContent);

  const handleToggle = (taskId: string) => {
    if (isReadOnly) return;
    toggleTask(date, taskId, 'secondary');
  };

  const handleContentChange = (taskId: string, content: string) => {
    if (isReadOnly) return;
    updateTaskContent(date, taskId, content, 'secondary');
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <Card
      title="+9 (второстепенное)"
      subtitle="Звонки, мелкие поручения, напоминания"
    >
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div key={task.id} className="flex items-center gap-2">
            {/* Checkbox */}
            <Checkbox
              checked={task.completed}
              onChange={() => handleToggle(task.id)}
              disabled={isReadOnly}
            />

            {/* Task Input (smaller, lighter) */}
            <div className="flex-1">
              <Input
                value={task.content}
                onChange={(e) => handleContentChange(task.id, e.target.value)}
                placeholder={`Задача ${index + 1}...`}
                disabled={isReadOnly}
                className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      {completedCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Выполнено: {completedCount} / 9
          </span>
        </div>
      )}

      {/* Hint */}
      <div className="mt-4 bg-gray-50 p-3 rounded">
        <p className="text-xs text-gray-600">
          💡 Эти задачи опциональны. Главное — выполнить 3 задачи выше.
        </p>
      </div>
    </Card>
  );
}
