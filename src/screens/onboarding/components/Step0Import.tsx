import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { STORAGE_KEYS } from '../../../types';
import { chromeStorage } from '../../../services/chrome-storage-adapter';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onSkipToEnd?: () => void;
}

/**
 * Step 0: Import Data or Start Fresh - Glassmorphism
 */
export function Step0Import({ onNext }: StepProps) {
  const navigate = useNavigate();
  const [importError, setImportError] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError('');
    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        if (!importedData.version || !importedData.data) {
          throw new Error('Неверный формат файла');
        }

        const confirmImport = window.confirm(
          'Импорт данных восстановит все ваши цели, планы и страницы.\n\nПродолжить?'
        );

        if (!confirmImport) {
          event.target.value = '';
          setIsImporting(false);
          return;
        }

        const { data } = importedData;

        // Import all data to chrome.storage
        let importedCount = 0;

        if (data.profile) {
          await chromeStorage.setItem(STORAGE_KEYS.USER_PROFILE, data.profile);
          importedCount++;
        }
        if (data.goals) {
          await chromeStorage.setItem(STORAGE_KEYS.GOALS, data.goals);
          importedCount++;
        }
        if (data.plans) {
          await chromeStorage.setItem(STORAGE_KEYS.PLANS_90DAY, data.plans);
          importedCount++;
        }
        if (data.dailyPages) {
          await chromeStorage.setItem(STORAGE_KEYS.DAILY_PAGES, data.dailyPages);
          importedCount++;
        }
        if (data.weeklyReviews) {
          await chromeStorage.setItem(STORAGE_KEYS.WEEKLY_REVIEWS, data.weeklyReviews);
          importedCount++;
        }
        if (data.sketches) {
          await chromeStorage.setItem(STORAGE_KEYS.SKETCHES, data.sketches);
          importedCount++;
        }

        if (importedCount === 0) {
          throw new Error('Файл не содержит данных для импорта');
        }

        setImportSuccess(true);
        setIsImporting(false);

        // После успешного импорта перенаправляем на главную страницу
        // Используем navigate с replace и перезагрузку для загрузки данных в stores
        setTimeout(() => {
          navigate('/daily', { replace: true });
          // Перезагружаем страницу чтобы stores загрузили новые данные
          window.location.reload();
        }, 2000);
      } catch (error) {
        setImportError(
          error instanceof Error
            ? error.message
            : 'Ошибка при чтении файла. Проверьте формат JSON.'
        );
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      setImportError('Ошибка при чтении файла');
      setIsImporting(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mb-8">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-purple rounded-full flex items-center justify-center text-5xl shadow-glow-blue">
          📥
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">
        <span className="gradient-text">Начало работы</span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-text-secondary mb-8">
        У вас есть резервная копия данных?
      </p>

      {/* Description */}
      <div className="max-w-xl mx-auto mb-8 text-left space-y-4 text-text-secondary">
        <p>
          Если вы ранее использовали приложение и создали резервную копию,
          вы можете восстановить все свои данные сейчас.
        </p>
        <p>
          Если вы впервые используете приложение, нажмите "Начать с нуля".
        </p>
      </div>

      {/* Import Section */}
      <div className="max-w-md mx-auto mb-8">
        <div className="p-6 bg-glass-light border border-glass-border rounded-glass-lg">
          <h3 className="font-semibold text-text-primary mb-4">
            Импорт данных
          </h3>

          {importSuccess && (
            <div className="p-4 bg-success/20 border border-success/30 rounded-glass-sm mb-4">
              <p className="text-sm text-success">
                ✅ Данные успешно импортированы! Перенаправление...
              </p>
            </div>
          )}

          {importError && (
            <div className="p-4 bg-danger/20 border border-danger/30 rounded-glass-sm mb-4">
              <p className="text-sm text-danger">{importError}</p>
            </div>
          )}

          {isImporting && !importSuccess && (
            <div className="p-4 bg-accent-blue/20 border border-accent-blue/30 rounded-glass-sm mb-4">
              <p className="text-sm text-accent-blue">
                Импорт данных... Пожалуйста, подождите.
              </p>
            </div>
          )}

          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="block w-full text-sm text-text-secondary
                file:mr-4 file:py-3 file:px-6
                file:rounded-glass-sm file:border-0
                file:text-sm file:font-medium
                file:bg-accent-blue file:text-white
                hover:file:bg-accent-purple
                file:cursor-pointer cursor-pointer
                file:transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                file:disabled:cursor-not-allowed"
            />
          </label>

          <p className="mt-3 text-xs text-text-muted">
            Поддерживаются только файлы .json, созданные через экспорт данных
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center max-w-md mx-auto mb-8">
        <div className="flex-1 h-px bg-glass-border"></div>
        <span className="px-4 text-sm text-text-muted">или</span>
        <div className="flex-1 h-px bg-glass-border"></div>
      </div>

      {/* Start Fresh Button */}
      <Button size="lg" onClick={onNext} className="px-12" disabled={isImporting}>
        Начать с нуля
      </Button>

      {/* Additional Info */}
      <p className="mt-8 text-sm text-text-muted">
        Вы всегда сможете импортировать данные позже через Настройки
      </p>
    </div>
  );
}
