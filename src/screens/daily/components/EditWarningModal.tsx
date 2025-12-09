import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useDailyStore } from '../../../stores/useDailyStore';
import { NinetyDayPlan } from '../../../types';

interface EditWarningModalProps {
  date: string;
  currentProjects: [string, string, string];
  activePlan: NinetyDayPlan | null;
  onClose: () => void;
}

const CONFIRMATION_TEXT = 'Я ПОНИМАЮ';

/**
 * EditWarningModal - High-friction confirmation for mid-month changes
 *
 * Philosophy:
 * - Changing monthly focus mid-month disrupts neural pathway formation
 * - Disperses high-quality morning energy
 * - Requires explicit confirmation to proceed
 *
 * Features:
 * - Warning message about consequences
 * - Confirmation input ("Я ПОНИМАЮ")
 * - Project selection from active 90-day plan or custom input
 * - Hint about result-oriented formulation
 */
export function EditWarningModal({
  date,
  currentProjects,
  activePlan,
  onClose,
}: EditWarningModalProps) {
  const setMainForMonth = useDailyStore((state) => state.setMainForMonth);

  const [confirmationText, setConfirmationText] = useState('');
  const [showProjectEdit, setShowProjectEdit] = useState(false);
  const [newProjects, setNewProjects] = useState<[string, string, string]>(currentProjects);

  const isConfirmationValid = confirmationText === CONFIRMATION_TEXT;
  const allProjectsFilled = newProjects.every((p) => p.trim() !== '');

  const planProjects = activePlan?.projects.map((p) => p.title) || [];

  const handleConfirm = () => {
    if (!isConfirmationValid) return;
    setShowProjectEdit(true);
  };

  const handleSave = () => {
    if (!allProjectsFilled) return;
    setMainForMonth(date, newProjects);
    onClose();
  };

  const handleProjectChange = (index: number, value: string) => {
    const updated = [...newProjects] as [string, string, string];
    updated[index] = value;
    setNewProjects(updated);
  };

  const handleSelectFromPlan = (index: number, projectTitle: string) => {
    const updated = [...newProjects] as [string, string, string];
    updated[index] = projectTitle;
    setNewProjects(updated);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={showProjectEdit ? 'Изменить проекты' : '⚠️ Внимание!'}
      size="lg"
    >
      {!showProjectEdit ? (
        /* Step 1: Warning and Confirmation */
        <div className="space-y-6">
          {/* Warning Message */}
          <div className="bg-accent-orange/10 border-l-4 border-accent-orange/50 p-4 rounded-glass-sm">
            <p className="text-text-secondary leading-relaxed">
              <strong className="text-text-primary">Изменение главных проектов в середине месяца</strong>{' '}
              подрывает формирование нейронных путей и рассеивает высококачественную
              утреннюю энергию.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-text-primary font-medium">
              Вы уверены, что хотите изменить проекты?
            </p>
            <p className="text-sm text-text-secondary">
              Для подтверждения введите <strong>"{CONFIRMATION_TEXT}"</strong> в поле ниже:
            </p>
          </div>

          {/* Confirmation Input */}
          <Input
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={`Введите: ${CONFIRMATION_TEXT}`}
            className="font-medium"
          />

          {/* Hint */}
          <div className="bg-accent-blue/10 border border-accent-blue/30 p-3 rounded-glass-sm">
            <p className="text-xs text-text-secondary">
              <strong>💡 Совет:</strong> Формулируйте проекты как завершенный результат.
              <br />
              Вместо "плохая спина" → "Создал(а) сильную, здоровую спину к 31.12.2024"
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!isConfirmationValid}
            >
              Продолжить
            </Button>
          </div>
        </div>
      ) : (
        /* Step 2: Project Edit */
        <div className="space-y-6">
          <p className="text-text-secondary">
            Выберите новые проекты для фокуса на этот месяц:
          </p>

          {/* Project Inputs */}
          <div className="space-y-4">
            {newProjects.map((project, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Проект {index + 1}
                </label>
                <Input
                  value={project}
                  onChange={(e) => handleProjectChange(index, e.target.value)}
                  placeholder={`Введите проект ${index + 1}...`}
                />

                {/* Quick select from 90-day plan */}
                {planProjects.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs text-text-muted">Или выберите:</span>
                    {planProjects.map((planProject) => (
                      <button
                        key={planProject}
                        type="button"
                        onClick={() => handleSelectFromPlan(index, planProject)}
                        className="text-xs px-2 py-1 bg-glass-light hover:bg-primary hover:text-white rounded transition-colors border border-glass-border"
                      >
                        {planProject}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="bg-glass-light p-3 rounded-glass-sm border border-glass-border">
            <p className="text-sm text-text-secondary">
              Заполнено: <strong>{newProjects.filter((p) => p.trim()).length} / 3</strong>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!allProjectsFilled}
            >
              Сохранить изменения
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
