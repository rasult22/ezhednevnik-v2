import { useState } from 'react';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { getDayOfMonth } from '../../../utils/date-formatters';
import { NinetyDayPlan } from '../../../types';
import { EditWarningModal } from './EditWarningModal';

interface MainForMonthBlockProps {
  date: string;
  projects: [string, string, string];
  isReadOnly: boolean;
  activePlan: NinetyDayPlan | null;
}

/**
 * MainForMonthBlock - Display 3 main projects for the month
 */
export function MainForMonthBlock({
  date,
  projects,
  isReadOnly,
  activePlan,
}: MainForMonthBlockProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const dayOfMonth = getDayOfMonth(date);
  const isFirstDayOfMonth = dayOfMonth === 1;

  const handleEditClick = () => {
    if (isFirstDayOfMonth || isReadOnly) {
      return;
    }
    setShowEditModal(true);
  };

  return (
    <>
      <Card
        title="Главное на месяц"
        subtitle="3 проекта, на которых вы сфокусированы"
        variant="gradient"
        accentColor="purple"
      >
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-accent-purple font-bold text-lg mt-2">
                {index + 1}.
              </span>
              <div className="flex-1 bg-accent-purple/10 border border-accent-purple/20 rounded-glass-sm px-4 py-3">
                <p className="text-text-primary font-medium">{project || 'Не указано'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Edit button (only shown mid-month and when not read-only) */}
        {!isFirstDayOfMonth && !isReadOnly && (
          <div className="mt-4 pt-4 border-t border-glass-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditClick}
              className="text-warning"
            >
              Изменить (требуется подтверждение)
            </Button>
          </div>
        )}

        {/* Info note for first day of month */}
        {isFirstDayOfMonth && !isReadOnly && (
          <div className="mt-4 p-3 bg-accent-cyan/10 border border-accent-cyan/20 rounded-glass-sm">
            <p className="text-xs text-text-secondary">
              Первый день месяца — идеальное время для планирования
            </p>
          </div>
        )}
      </Card>

      {/* Edit Warning Modal */}
      {showEditModal && (
        <EditWarningModal
          date={date}
          currentProjects={projects}
          activePlan={activePlan}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
