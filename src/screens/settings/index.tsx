import { useState } from 'react';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../stores/useAppStore';
import { useGoalsStore } from '../../stores/useGoalsStore';
import { usePlansStore } from '../../stores/usePlansStore';
import { useDailyStore } from '../../stores/useDailyStore';
import { useReviewsStore } from '../../stores/useReviewsStore';
import { STORAGE_KEYS } from '../../types';

/**
 * Settings Screen - Data management, statistics, export/import
 *
 * Features:
 * - Statistics overview (all data counts)
 * - Export all data to JSON
 * - Import data from JSON with validation
 * - Reset all data (danger zone)
 */
export default function SettingsScreen() {
  const userProfile = useAppStore((state) => state.userProfile);
  const goals = useGoalsStore((state) => state.goals);
  const plans = usePlansStore((state) => state.plans);
  const dailyPages = useDailyStore((state) => state.dailyPages);
  const reviews = useReviewsStore((state) => state.reviews);

  const [importError, setImportError] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState(false);

  // Calculate statistics
  const stats = {
    totalGoals:
      goals.tenYear.length + goals.fiveYear.length + goals.oneYear.length,
    totalPlans: plans.length,
    totalDailyPages: Object.keys(dailyPages).length,
    completedDays: Object.values(dailyPages).filter(
      (page) => page.status === 'completed'
    ).length,
    totalReviews: reviews.length,
    storageUsed: calculateStorageUsage(),
  };

  /**
   * Calculate approximate localStorage usage in KB
   */
  function calculateStorageUsage(): number {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return Math.round(total / 1024); // Convert to KB
    } catch (e) {
      return 0;
    }
  }

  /**
   * Export all data to JSON file
   */
  const handleExport = () => {
    const allData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        profile: localStorage.getItem(STORAGE_KEYS.USER_PROFILE),
        goals: localStorage.getItem(STORAGE_KEYS.GOALS),
        plans: localStorage.getItem(STORAGE_KEYS.PLANS_90DAY),
        dailyPages: localStorage.getItem(STORAGE_KEYS.DAILY_PAGES),
        weeklyReviews: localStorage.getItem(STORAGE_KEYS.WEEKLY_REVIEWS),
      },
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `ezhednevnik-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Import data from JSON file
   */
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        // Validate structure
        if (!importedData.version || !importedData.data) {
          throw new Error('Неверный формат файла');
        }

        // Confirm import
        const confirmImport = window.confirm(
          'Импорт данных заменит все текущие данные. Вы уверены?\n\nРекомендуется сначала создать резервную копию текущих данных.'
        );

        if (!confirmImport) {
          event.target.value = '';
          return;
        }

        // Import data
        const { data } = importedData;

        if (data.profile)
          localStorage.setItem(STORAGE_KEYS.USER_PROFILE, data.profile);
        if (data.goals) localStorage.setItem(STORAGE_KEYS.GOALS, data.goals);
        if (data.plans)
          localStorage.setItem(STORAGE_KEYS.PLANS_90DAY, data.plans);
        if (data.dailyPages)
          localStorage.setItem(STORAGE_KEYS.DAILY_PAGES, data.dailyPages);
        if (data.weeklyReviews)
          localStorage.setItem(STORAGE_KEYS.WEEKLY_REVIEWS, data.weeklyReviews);

        setImportSuccess(true);

        // Reload page to reinitialize stores
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        setImportError(
          error instanceof Error
            ? error.message
            : 'Ошибка при чтении файла. Проверьте формат JSON.'
        );
      }
    };

    reader.onerror = () => {
      setImportError('Ошибка при чтении файла');
    };

    reader.readAsText(file);
  };

  /**
   * Reset all data (danger zone)
   */
  const handleResetAll = () => {
    const confirmReset = window.confirm(
      '⚠️ ВНИМАНИЕ!\n\nЭто действие удалит ВСЕ данные без возможности восстановления:\n\n• Все цели (10 лет, 5 лет, 1 год)\n• Все планы на 90 дней\n• Все ежедневные страницы\n• Все еженедельные обзоры\n• Настройки профиля\n\nВы УВЕРЕНЫ?'
    );

    if (!confirmReset) return;

    const doubleConfirm = window.confirm(
      'Последнее предупреждение!\n\nВсе данные будут безвозвратно удалены. Продолжить?'
    );

    if (!doubleConfirm) return;

    // Clear all localStorage
    localStorage.clear();

    // Reload page
    window.location.href = '/';
  };

  return (
    <Container size="lg">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Настройки</h1>
          <p className="text-lg text-gray-600">
            Управление данными, экспорт и импорт
          </p>
        </div>

        {/* Profile Info */}
        {userProfile && (
          <Card className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Информация о профиле:
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>ID профиля:</span>
                <span className="font-medium font-mono text-xs">
                  {userProfile.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Дата создания:</span>
                <span className="font-medium">
                  {new Date(userProfile.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Онбординг пройден:</span>
                <span className="font-medium">
                  {userProfile.onboardingCompleted ? 'Да' : 'Нет'}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Statistics */}
        <Card className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            📊 Статистика данных:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {stats.totalGoals}
              </div>
              <div className="text-sm text-gray-600">Всего целей</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalPlans}
              </div>
              <div className="text-sm text-gray-600">Планов на 90 дней</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalDailyPages}
              </div>
              <div className="text-sm text-gray-600">Ежедневных страниц</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.completedDays}
              </div>
              <div className="text-sm text-gray-600">Завершённых дней</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {stats.totalReviews}
              </div>
              <div className="text-sm text-gray-600">Еженедельных обзоров</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {stats.storageUsed} KB
              </div>
              <div className="text-sm text-gray-600">Использовано памяти</div>
            </div>
          </div>
        </Card>

        {/* Export Data */}
        <Card className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            💾 Экспорт данных:
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Создайте резервную копию всех ваших данных в формате JSON. Вы
            сможете импортировать её позже на этом или другом устройстве.
          </p>
          <Button onClick={handleExport} variant="secondary">
            📥 Скачать резервную копию (JSON)
          </Button>
        </Card>

        {/* Import Data */}
        <Card className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            📤 Импорт данных:
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Восстановите данные из ранее созданной резервной копии. Это
            заменит все текущие данные.
          </p>

          {importSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800">
                ✅ Данные успешно импортированы! Страница обновится через
                несколько секунд...
              </p>
            </div>
          )}

          {importError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">❌ {importError}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark file:cursor-pointer cursor-pointer"
            />
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-2 border-red-300">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-4">
              ⚠️ Опасная зона:
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Удаление всех данных без возможности восстановления. Используйте
              только если уверены, что хотите начать с чистого листа.
            </p>
            <Button variant="secondary" onClick={handleResetAll}>
              🗑️ Удалить все данные
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}
