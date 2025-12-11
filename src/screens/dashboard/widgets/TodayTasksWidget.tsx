import { useDailyStore } from '../../../stores/useDailyStore';
import { getCurrentDateISO } from '../../../utils/date-formatters';
import { Link } from 'react-router-dom';

/**
 * Today Tasks Widget
 * Shows main 3 tasks from today's daily page
 */
export function TodayTasksWidget() {
  const getDailyPage = useDailyStore((state) => state.getDailyPage);
  const toggleTask = useDailyStore((state) => state.toggleTask);
  const todayISO = getCurrentDateISO();
  const todayPage = getDailyPage(todayISO);

  const tasks = todayPage?.mainThree || [];
  const hasTasks = tasks.some((t) => t.content.trim().length > 0);

  const handleToggle = (taskId: string) => {
    toggleTask(todayISO, taskId, 'main');
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.filter((t) => t.content.trim().length > 0).length;

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold gradient-text">Главное на сегодня</h3>
        <Link
          to="/daily"
          className="text-sm text-accent-blue hover:text-accent-blue/80 transition-colors"
        >
          Открыть →
        </Link>
      </div>

      {!hasTasks ? (
        <div className="text-center py-8 text-text-muted">
          <p>Нет задач на сегодня</p>
          <Link
            to="/daily"
            className="text-accent-blue hover:underline text-sm mt-2 inline-block"
          >
            Добавить задачи
          </Link>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          {totalTasks > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Прогресс</span>
                <span className="font-semibold text-accent-blue">
                  {completedCount}/{totalTasks}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-300"
                  style={{ width: `${(completedCount / totalTasks) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Tasks List */}
          <div className="space-y-3">
            {tasks.map((task) => {
              if (!task.content.trim()) return null;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-glass-sm transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-success/10 border border-success/20'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => handleToggle(task.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        task.completed
                          ? 'bg-success border-success'
                          : 'border-text-muted/30 hover:border-accent-blue'
                      }`}
                    >
                      {task.completed && <span className="text-white text-sm">✓</span>}
                    </div>
                    <p
                      className={`flex-1 leading-relaxed ${
                        task.completed
                          ? 'line-through text-text-muted'
                          : 'text-text-primary'
                      }`}
                    >
                      {task.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion Message */}
          {completedCount === totalTasks && totalTasks > 0 && (
            <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-glass-sm text-center">
              <p className="text-success font-semibold">🎉 Все задачи выполнены!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
