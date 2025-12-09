import { Card } from '../../../components/layout/Card';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Input } from '../../../components/ui/Input';
import { useDailyStore } from '../../../stores/useDailyStore';
import { Task } from '../../../types';
import { VictoryMessage } from './VictoryMessage';

interface MainThreeBlockProps {
  date: string;
  tasks: [Task, Task, Task];
  isCompleted: boolean;
  isReadOnly: boolean;
}

/**
 * MainThreeBlock - 3 main daily tasks (the critical 20%)
 */
export function MainThreeBlock({
  date,
  tasks,
  isCompleted,
  isReadOnly,
}: MainThreeBlockProps) {
  const toggleTask = useDailyStore((state) => state.toggleTask);
  const updateTaskContent = useDailyStore((state) => state.updateTaskContent);

  const handleToggle = (taskId: string) => {
    if (isReadOnly) return;
    toggleTask(date, taskId, 'main');
  };

  const handleContentChange = (taskId: string, content: string) => {
    if (isReadOnly) return;
    updateTaskContent(date, taskId, content, 'main');
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <>
      <Card
        title="3 (главное)"
        subtitle="Конкретные шаги на сегодня для продвижения проектов"
        variant="accent"
        accentColor="blue"
      >
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={task.id} className="flex items-start gap-4">
              {/* Task Number */}
              <span className="text-accent-blue font-bold text-xl mt-3">
                {index + 1}.
              </span>

              {/* Checkbox */}
              <div className="mt-3">
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleToggle(task.id)}
                  disabled={isReadOnly}
                />
              </div>

              {/* Task Input */}
              <div className="flex-1">
                <Input
                  value={task.content}
                  onChange={(e) => handleContentChange(task.id, e.target.value)}
                  placeholder={`Главная задача ${index + 1}...`}
                  disabled={isReadOnly}
                  className={task.completed ? 'line-through opacity-60' : ''}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 pt-4 border-t border-glass-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">Выполнено:</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i < completedCount
                        ? 'bg-gradient-to-r from-accent-emerald to-accent-cyan shadow-glow-success'
                        : 'bg-glass-light border border-glass-border'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-text-primary">
                {completedCount} / 3
              </span>
            </div>
            {!isCompleted && completedCount > 0 && (
              <span className="text-xs text-text-muted">
                Завершите все 3 задачи для победы дня
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Victory Message (shown when all 3 tasks completed) */}
      {isCompleted && <VictoryMessage />}
    </>
  );
}
