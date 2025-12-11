import { useDailyStore } from '../../../stores/useDailyStore';
import { getCurrentDateISO } from '../../../utils/date-formatters';
import { Link } from 'react-router-dom';

/**
 * Monthly Focus Widget
 * Shows "Main for Month" projects from today's daily page
 */
export function MonthlyFocusWidget() {
  const getDailyPage = useDailyStore((state) => state.getDailyPage);
  const todayISO = getCurrentDateISO();
  const todayPage = getDailyPage(todayISO);

  const projects = todayPage?.mainForMonth || [];
  const hasProjects = projects.some((p) => p.trim().length > 0);

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold gradient-text">Главное на месяц</h3>
        <Link
          to="/daily"
          className="text-sm text-accent-blue hover:text-accent-blue/80 transition-colors"
        >
          Редактировать →
        </Link>
      </div>

      {!hasProjects ? (
        <div className="text-center py-8 text-text-muted">
          <p>Нет проектов на месяц</p>
          <Link
            to="/daily"
            className="text-accent-blue hover:underline text-sm mt-2 inline-block"
          >
            Добавить проекты
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => {
            if (!project.trim()) return null;

            return (
              <div
                key={index}
                className="bg-gradient-to-r from-accent-blue/10 to-transparent p-4 rounded-glass-sm border-l-4 border-accent-blue"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl font-bold text-accent-blue/50">
                    {index + 1}
                  </span>
                  <p className="flex-1 leading-relaxed">{project}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
