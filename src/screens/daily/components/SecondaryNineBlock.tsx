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
      {/* 3-column grid on wider screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {tasks.map((task, index) => (
          <div key={task.id} className="flex items-center gap-3">
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
                placeholder={`${index + 1}`}
                disabled={isReadOnly}
                className={`text-sm py-2 ${task.completed ? 'line-through opacity-50' : ''}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      {completedCount > 0 && (
        <div className="mt-4 pt-4 border-t border-glass-border">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-glass-light rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-purple to-accent-pink transition-all duration-300"
                style={{ width: `${(completedCount / 9) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-muted">
              {completedCount} / 9
            </span>
          </div>
        </div>
      )}

      {/* Hint */}
      <div className="mt-4 p-3 bg-glass-light rounded-glass-sm border border-glass-border-light">
        <p className="text-xs text-text-muted">
          Эти задачи опциональны. Главное — выполнить 3 задачи выше.
        </p>
      </div>
    </Card>
  );
}
