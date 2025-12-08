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
 *
 * Features:
 * - 3 tasks with checkbox + text input
 * - Completion tracking
 * - Triggers victory message when all 3 completed
 * - Auto-saves changes (immediate for checkboxes, debounced for text)
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

  return (
    <>
      <Card
        title="3 (главное)"
        subtitle="Конкретные шаги на сегодня для продвижения проектов выше"
      >
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={task.id} className="flex items-start gap-3">
              {/* Task Number */}
              <span className="text-primary font-bold text-xl mt-2">
                {index + 1}.
              </span>

              {/* Checkbox */}
              <div className="mt-2">
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
                  className={task.completed ? 'line-through text-gray-500' : ''}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Выполнено: <strong>{tasks.filter((t) => t.completed).length} / 3</strong>
            </span>
            {!isCompleted && tasks.filter((t) => t.completed).length > 0 && (
              <span className="text-xs text-gray-500">
                Завершите все 3 задачи для победы дня 🎯
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
