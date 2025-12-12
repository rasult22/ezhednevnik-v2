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
 * Settings Screen - Glassmorphism style with grid layout
 */
// Available background images
const BACKGROUND_IMAGES = [
  { path: '/bg-images/1.png', name: 'Фон 1' },
  { path: '/bg-images/2.png', name: 'Фон 2' },
  { path: '/bg-images/3.png', name: 'Фон 3' },
  { path: '/bg-images/4.jpg', name: 'Фон 4' },
  { path: '/bg-images/5.jpg', name: 'Фон 5' },
  { path: '/bg-images/6.jpg', name: 'Фон 6' },
  { path: '/bg-images/7.jpg', name: 'По умолчанию' },
];

export default function SettingsScreen() {
  const userProfile = useAppStore((state) => state.userProfile);
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
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

  function calculateStorageUsage(): number {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return Math.round(total / 1024);
    } catch (e) {
      return 0;
    }
  }

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

        if (!importedData.version || !importedData.data) {
          throw new Error('Неверный формат файла');
        }

        const confirmImport = window.confirm(
          'Импорт данных заменит все текущие данные. Вы уверены?\n\nРекомендуется сначала создать резервную копию текущих данных.'
        );

        if (!confirmImport) {
          event.target.value = '';
          return;
        }

        const { data } = importedData;

        // Данные в экспорте уже являются строками, просто записываем их в localStorage
        if (data.profile) {
          localStorage.setItem(STORAGE_KEYS.USER_PROFILE, data.profile);
        }
        if (data.goals) {
          localStorage.setItem(STORAGE_KEYS.GOALS, data.goals);
        }
        if (data.plans) {
          localStorage.setItem(STORAGE_KEYS.PLANS_90DAY, data.plans);
        }
        if (data.dailyPages) {
          localStorage.setItem(STORAGE_KEYS.DAILY_PAGES, data.dailyPages);
        }
        if (data.weeklyReviews) {
          localStorage.setItem(STORAGE_KEYS.WEEKLY_REVIEWS, data.weeklyReviews);
        }

        setImportSuccess(true);

        // Перезагружаем страницу для загрузки данных в Zustand stores
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

  const handleResetAll = () => {
    const confirmReset = window.confirm(
      'ВНИМАНИЕ!\n\nЭто действие удалит ВСЕ данные без возможности восстановления:\n\n• Все цели\n• Все планы на 90 дней\n• Все ежедневные страницы\n• Все еженедельные обзоры\n• Настройки профиля\n\nВы УВЕРЕНЫ?'
    );

    if (!confirmReset) return;

    const doubleConfirm = window.confirm(
      'Последнее предупреждение!\n\nВсе данные будут безвозвратно удалены. Продолжить?'
    );

    if (!doubleConfirm) return;

    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <Container size="xl">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-3">Настройки</h1>
          <p className="text-lg text-text-secondary">
            Управление данными, экспорт и импорт
          </p>
        </div>

        {/* Background Selection */}
        <Card variant="gradient" accentColor="purple" className="mb-6">
          <h3 className="font-semibold text-text-primary mb-4">
            Фоновое изображение
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Выберите фоновое изображение для приложения
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {BACKGROUND_IMAGES.map((bg) => (
              <button
                key={bg.path}
                onClick={() => updateSettings({ backgroundImage: bg.path })}
                className={`
                  relative group overflow-hidden rounded-glass-sm border-2 transition-all
                  ${
                    settings.backgroundImage === bg.path
                      ? 'border-accent-purple shadow-lg shadow-accent-purple/30'
                      : 'border-transparent hover:border-accent-blue/50'
                  }
                `}
              >
                <div className="aspect-video bg-dark-200">
                  <img
                    src={bg.path}
                    alt={bg.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-400/90 to-transparent flex items-end p-2">
                  <span className="text-xs text-white font-medium">{bg.name}</span>
                </div>
                {settings.backgroundImage === bg.path && (
                  <div className="absolute top-2 right-2 bg-accent-purple text-white rounded-full p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Grid layout for wide screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Profile Info */}
            {userProfile && (
              <Card variant="gradient" accentColor="blue">
                <h3 className="font-semibold text-text-primary mb-4">
                  Информация о профиле
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-3 bg-glass-light rounded-glass-sm">
                    <span className="text-text-secondary">ID профиля:</span>
                    <span className="font-mono text-xs text-text-muted">
                      {userProfile.id.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-glass-light rounded-glass-sm">
                    <span className="text-text-secondary">Дата создания:</span>
                    <span className="text-text-primary">
                      {new Date(userProfile.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-glass-light rounded-glass-sm">
                    <span className="text-text-secondary">Онбординг:</span>
                    <span className={userProfile.onboardingCompleted ? 'text-success' : 'text-warning'}>
                      {userProfile.onboardingCompleted ? 'Пройден' : 'Не пройден'}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Statistics */}
            <Card>
              <h3 className="font-semibold text-text-primary mb-4">
                Статистика данных
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-accent-blue/10 border border-accent-blue/20 rounded-glass-sm text-center">
                  <div className="text-2xl font-bold text-accent-blue">
                    {stats.totalGoals}
                  </div>
                  <div className="text-xs text-text-muted">Всего целей</div>
                </div>
                <div className="p-4 bg-accent-purple/10 border border-accent-purple/20 rounded-glass-sm text-center">
                  <div className="text-2xl font-bold text-accent-purple">
                    {stats.totalPlans}
                  </div>
                  <div className="text-xs text-text-muted">Планов 90 дней</div>
                </div>
                <div className="p-4 bg-accent-cyan/10 border border-accent-cyan/20 rounded-glass-sm text-center">
                  <div className="text-2xl font-bold text-accent-cyan">
                    {stats.totalDailyPages}
                  </div>
                  <div className="text-xs text-text-muted">Ежедневных страниц</div>
                </div>
                <div className="p-4 bg-success/10 border border-success/20 rounded-glass-sm text-center">
                  <div className="text-2xl font-bold text-success">
                    {stats.completedDays}
                  </div>
                  <div className="text-xs text-text-muted">Завершённых дней</div>
                </div>
                <div className="p-4 bg-accent-pink/10 border border-accent-pink/20 rounded-glass-sm text-center">
                  <div className="text-2xl font-bold text-accent-pink">
                    {stats.totalReviews}
                  </div>
                  <div className="text-xs text-text-muted">Недельных обзоров</div>
                </div>
                <div className="p-4 bg-accent-orange/10 border border-accent-orange/20 rounded-glass-sm text-center">
                  <div className="text-2xl font-bold text-accent-orange">
                    {stats.storageUsed} KB
                  </div>
                  <div className="text-xs text-text-muted">Использовано</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Export Data */}
            <Card variant="gradient" accentColor="emerald">
              <h3 className="font-semibold text-text-primary mb-4">
                Экспорт данных
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Создайте резервную копию всех ваших данных в формате JSON. Вы
                сможете импортировать её позже на этом или другом устройстве.
              </p>
              <Button onClick={handleExport} variant="secondary" className="w-full">
                Скачать резервную копию (JSON)
              </Button>
            </Card>

            {/* Import Data */}
            <Card>
              <h3 className="font-semibold text-text-primary mb-4">
                Импорт данных
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Восстановите данные из ранее созданной резервной копии. Это
                заменит все текущие данные.
              </p>

              {importSuccess && (
                <div className="p-4 bg-success/20 border border-success/30 rounded-glass-sm mb-4">
                  <p className="text-sm text-success">
                    Данные успешно импортированы! Страница обновится через несколько секунд...
                  </p>
                </div>
              )}

              {importError && (
                <div className="p-4 bg-danger/20 border border-danger/30 rounded-glass-sm mb-4">
                  <p className="text-sm text-danger">{importError}</p>
                </div>
              )}

              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="block w-full text-sm text-text-secondary
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-glass-sm file:border-0
                  file:text-sm file:font-medium
                  file:bg-accent-blue file:text-white
                  hover:file:bg-accent-purple
                  file:cursor-pointer cursor-pointer
                  file:transition-colors"
              />
            </Card>

            {/* Danger Zone */}
            <Card className="border-2 border-danger/30">
              <div className="p-4 bg-danger/10 rounded-glass-sm">
                <h3 className="font-semibold text-danger mb-4">
                  Опасная зона
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Удаление всех данных без возможности восстановления. Используйте
                  только если уверены, что хотите начать с чистого листа.
                </p>
                <Button variant="danger" onClick={handleResetAll} className="w-full">
                  Удалить все данные
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
