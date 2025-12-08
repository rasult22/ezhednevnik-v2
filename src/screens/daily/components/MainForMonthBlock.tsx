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
 *
 * Features:
 * - Shows 3 monthly projects
 * - First day of month: Easy to edit
 * - Mid-month: Requires high-friction confirmation via EditWarningModal
 * - Read-only mode for past dates
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
      // On first day or read-only, just allow viewing (no edit modal)
      return;
    }
    // Mid-month: show warning modal
    setShowEditModal(true);
  };

  return (
    <>
      <Card
        title="Главное на этот месяц"
        subtitle="3 проекта, на которых вы сфокусированы ежедневно"
      >
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-primary font-bold text-lg mt-1">
                {index + 1}.
              </span>
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <p className="text-gray-900 font-medium">{project}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Edit button (only shown mid-month and when not read-only) */}
        {!isFirstDayOfMonth && !isReadOnly && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEditClick}
              className="text-warning"
            >
              ✏️ Изменить проекты (требуется подтверждение)
            </Button>
          </div>
        )}

        {/* Info note for first day of month */}
        {isFirstDayOfMonth && !isReadOnly && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 Первый день месяца — идеальное время для планирования. Эти проекты
              будут отображаться на каждой ежедневной странице в течение месяца.
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
