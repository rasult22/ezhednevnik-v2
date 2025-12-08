import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { NinetyDayPlan } from '../../../types';
import { formatDateRU } from '../../../utils/date-formatters';

interface ProjectTransferModalProps {
  previousPlan: NinetyDayPlan;
  onTransfer: (selectedProjects: string[]) => void;
  onSkip: () => void;
}

/**
 * ProjectTransferModal - Transfer uncompleted projects from previous plan
 *
 * Features:
 * - Shows all projects from previous plan
 * - Checkbox selection for transfer
 * - Completed projects shown but disabled
 * - Can skip transfer entirely
 */
export function ProjectTransferModal({
  previousPlan,
  onTransfer,
  onSkip,
}: ProjectTransferModalProps) {
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set(
      previousPlan.projects
        .filter((p) => !p.completed)
        .map((p) => p.title)
    )
  );

  const handleToggle = (projectTitle: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectTitle)) {
      newSelected.delete(projectTitle);
    } else {
      newSelected.add(projectTitle);
    }
    setSelectedProjects(newSelected);
  };

  const handleTransfer = () => {
    onTransfer(Array.from(selectedProjects));
  };

  return (
    <Modal isOpen={true} onClose={onSkip} title="Перенести проекты из предыдущего плана?" size="lg">
      <div className="space-y-6">
        {/* Info */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-gray-800">
            У вас есть активный план, который будет завершён при создании нового.
            Вы можете перенести незавершённые проекты в новый план.
          </p>
        </div>

        {/* Previous Plan Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Предыдущий план:
          </h3>
          <p className="text-sm text-gray-600">
            {formatDateRU(previousPlan.startDate)} -{' '}
            {formatDateRU(previousPlan.endDate)}
          </p>
        </div>

        {/* Projects Selection */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Выберите проекты для переноса:
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {previousPlan.projects.map((project) => (
              <div
                key={project.id}
                className={`flex items-start gap-3 p-3 rounded border ${
                  project.completed
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Checkbox
                  checked={selectedProjects.has(project.title)}
                  onChange={() => handleToggle(project.title)}
                  disabled={project.completed}
                />
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      project.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {project.title}
                  </p>
                  {project.completed && (
                    <p className="text-xs text-green-600 mt-1">
                      ✅ Уже завершён
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Summary */}
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-700">
            Выбрано для переноса:{' '}
            <strong>{selectedProjects.size} проектов</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button variant="ghost" onClick={onSkip}>
            Пропустить перенос
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onSkip}>
              Начать с нуля
            </Button>
            <Button
              variant="primary"
              onClick={handleTransfer}
              disabled={selectedProjects.size === 0}
            >
              Перенести выбранные ({selectedProjects.size})
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
