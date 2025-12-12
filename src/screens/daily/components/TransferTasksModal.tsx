import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Task } from '../../../types';

interface TransferTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousDayTasks: {
    mainThree: Task[];
    secondaryNine: Task[];
  };
  onTransfer: (selectedTaskIds: string[]) => void;
}

/**
 * TransferTasksModal - Transfer incomplete tasks from previous day
 *
 * Features:
 * - Shows only incomplete tasks from previous day
 * - Allows selecting which tasks to transfer
 * - Separates main and secondary tasks
 * - "Select All" functionality for each section
 */
export function TransferTasksModal({
  isOpen,
  onClose,
  previousDayTasks,
  onTransfer,
}: TransferTasksModalProps) {
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());

  // Filter only incomplete tasks with content
  const incompleteMainTasks = previousDayTasks.mainThree.filter(
    (task) => !task.completed && task.content.trim() !== ''
  );
  const incompleteSecondaryTasks = previousDayTasks.secondaryNine.filter(
    (task) => !task.completed && task.content.trim() !== ''
  );

  const totalIncompleteTasks = incompleteMainTasks.length + incompleteSecondaryTasks.length;

  const handleToggleTask = (taskId: string) => {
    setSelectedTaskIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (tasks: Task[]) => {
    setSelectedTaskIds((prev) => {
      const newSet = new Set(prev);
      tasks.forEach((task) => newSet.add(task.id));
      return newSet;
    });
  };

  const handleDeselectAll = (tasks: Task[]) => {
    setSelectedTaskIds((prev) => {
      const newSet = new Set(prev);
      tasks.forEach((task) => newSet.delete(task.id));
      return newSet;
    });
  };

  const handleTransfer = () => {
    onTransfer(Array.from(selectedTaskIds));
    setSelectedTaskIds(new Set());
    onClose();
  };

  const isAllMainSelected =
    incompleteMainTasks.length > 0 &&
    incompleteMainTasks.every((task) => selectedTaskIds.has(task.id));

  const isAllSecondarySelected =
    incompleteSecondaryTasks.length > 0 &&
    incompleteSecondaryTasks.every((task) => selectedTaskIds.has(task.id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Перенести задачи с предыдущего дня"
      size="lg"
    >
      <div className="space-y-6">
        {/* Info Message */}
        <div className="bg-accent-blue/10 border-l-4 border-accent-blue/50 p-4 rounded-glass-sm">
          <p className="text-text-secondary text-sm">
            Выберите невыполненные задачи, которые хотите перенести на сегодня.
            Они будут добавлены в свободные слоты.
          </p>
        </div>

        {totalIncompleteTasks === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-muted text-lg">Все задачи выполнены!</p>
            <p className="text-text-secondary text-sm mt-2">
              Нет невыполненных задач для переноса
            </p>
          </div>
        ) : (
          <>
            {/* Main Three Tasks */}
            {incompleteMainTasks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Основные 3 задачи ({incompleteMainTasks.length})
                  </h3>
                  {incompleteMainTasks.length > 0 && (
                    <button
                      onClick={() =>
                        isAllMainSelected
                          ? handleDeselectAll(incompleteMainTasks)
                          : handleSelectAll(incompleteMainTasks)
                      }
                      className="text-xs text-accent-blue hover:text-accent-cyan transition-colors"
                    >
                      {isAllMainSelected ? 'Снять выбор' : 'Выбрать все'}
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {incompleteMainTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-glass-light rounded-glass-sm p-3 border border-glass-border hover:border-accent-blue/30 transition-colors"
                    >
                      <Checkbox
                        checked={selectedTaskIds.has(task.id)}
                        onChange={() => handleToggleTask(task.id)}
                        label={task.content}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary Nine Tasks */}
            {incompleteSecondaryTasks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Дополнительные 9 задач ({incompleteSecondaryTasks.length})
                  </h3>
                  {incompleteSecondaryTasks.length > 0 && (
                    <button
                      onClick={() =>
                        isAllSecondarySelected
                          ? handleDeselectAll(incompleteSecondaryTasks)
                          : handleSelectAll(incompleteSecondaryTasks)
                      }
                      className="text-xs text-accent-blue hover:text-accent-cyan transition-colors"
                    >
                      {isAllSecondarySelected ? 'Снять выбор' : 'Выбрать все'}
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {incompleteSecondaryTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-glass-light rounded-glass-sm p-3 border border-glass-border hover:border-accent-blue/30 transition-colors"
                    >
                      <Checkbox
                        checked={selectedTaskIds.has(task.id)}
                        onChange={() => handleToggleTask(task.id)}
                        label={task.content}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer with Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-glass-border">
              <p className="text-sm text-text-secondary">
                Выбрано: <strong>{selectedTaskIds.size}</strong> из {totalIncompleteTasks}
              </p>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>
                  Отмена
                </Button>
                <Button
                  variant="primary"
                  onClick={handleTransfer}
                  disabled={selectedTaskIds.size === 0}
                >
                  Перенести ({selectedTaskIds.size})
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
