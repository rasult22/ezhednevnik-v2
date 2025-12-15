import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { useReviewsStore } from '../../../stores/useReviewsStore';
import { useDailyStore } from '../../../stores/useDailyStore';
import { formatDateRU } from '../../../utils/date-formatters';
import type { Task } from '../../../types';

/**
 * New Weekly Review Screen - Create a new weekly review
 *
 * Features:
 * - Checks eligibility (7 past days)
 * - Shows progress if not eligible
 * - Large textarea for review content
 * - Auto-calculates date range from past days
 */
export default function NewReviewScreen() {
  const navigate = useNavigate();
  const canCreateReview = useReviewsStore((state) => state.canCreateReview);
  const createReview = useReviewsStore((state) => state.createReview);
  const getDailyPage = useDailyStore((state) => state.getDailyPage);

  const [content, setContent] = useState('');
  const [eligibility, setEligibility] = useState<{
    allowed: boolean;
    completedCount: number;
    lastCompletedDates: string[];
  } | null>(null);
  const [completedTasks, setCompletedTasks] = useState<
    Array<{ date: string; tasks: Task[] }>
  >([]);

  // Check eligibility on mount
  useEffect(() => {
    const result = canCreateReview();
    setEligibility(result);

    // Fetch completed tasks from daily pages included in review
    if (result.allowed && result.lastCompletedDates.length > 0) {
      const tasksPerDay = result.lastCompletedDates
        .map((date) => {
          const page = getDailyPage(date);
          if (!page) return null;
          
          const completed = page.mainThree.filter(
            (task) => task.completed && task.content.trim() !== ''
          );
          
          return completed.length > 0 ? { date, tasks: completed } : null;
        })
        .filter((item): item is { date: string; tasks: Task[] } => item !== null);
      
      setCompletedTasks(tasksPerDay);
    }
  }, [canCreateReview, getDailyPage]);

  const handleSave = () => {
    if (!eligibility?.allowed || !content.trim()) {
      alert('Пожалуйста, заполните содержимое обзора');
      return;
    }

    // Calculate date range from completed dates
    const dates = eligibility.lastCompletedDates;
    const startDate = dates[dates.length - 1]!; // Oldest (last in reversed array)
    const endDate = dates[0]!; // Newest (first in reversed array)

    createReview(content, startDate, endDate);
    navigate('/reviews');
  };

  if (!eligibility) {
    return (
      <Container size="lg">
        <div className="py-8">
          <p className="text-center text-text-muted">Загрузка...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/reviews')}
            className="mb-4"
          >
            ← Назад к обзорам
          </Button>

          <h1 className="text-4xl font-bold gradient-text mb-3">
            Еженедельный обзор
          </h1>
          <p className="text-lg text-text-secondary">
            Успехи за неделю по главным 20% и важные мысли
          </p>
        </div>

        {/* Not Eligible - Show Progress */}
        {!eligibility.allowed && (
          <Card>
            <div className="bg-accent-orange/10 border-l-4 border-accent-orange/50 p-4 rounded-glass-sm mb-6">
              <p className="text-sm text-text-secondary mb-2">
                <strong className="text-text-primary">⏳ Еженедельный обзор пока недоступен</strong>
              </p>
              <p className="text-sm text-text-secondary">
                Для создания обзора необходимо иметь 7 прошедших дней в системе.
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-text-secondary mb-2">
                <span>Прогресс:</span>
                <span className="font-semibold">
                  {eligibility.completedCount} / 7 дней
                </span>
              </div>
              <div className="w-full bg-glass-light rounded-full h-3 border border-glass-border">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(eligibility.completedCount / 7) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Recent Past Days */}
            {eligibility.lastCompletedDates.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Последние прошедшие дни:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {eligibility.lastCompletedDates.map((date) => (
                    <span
                      key={date}
                      className="px-3 py-1 bg-accent-emerald/20 text-accent-emerald text-sm rounded-full border border-accent-emerald/30"
                    >
                      {formatDateRU(date)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {eligibility.lastCompletedDates.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-text-secondary">
                  У вас пока нет прошедших дней в системе. Начните заполнять ежедневную
                  страницу!
                </p>
                <Button onClick={() => navigate('/daily')} className="mt-4">
                  Перейти к сегодняшнему дню
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Eligible - Show Review Form */}
        {eligibility.allowed && (
          <>
            {/* Date Range Info */}
            <Card className="mb-6">
              <div className="bg-accent-emerald/10 border-l-4 border-accent-emerald/50 p-4 rounded-glass-sm">
                <p className="text-sm text-text-secondary">
                  <strong className="text-text-primary">✅ Готово к созданию обзора!</strong>
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Период обзора:{' '}
                  <strong>
                    {formatDateRU(
                      eligibility.lastCompletedDates[
                        eligibility.lastCompletedDates.length - 1
                      ]!
                    )}{' '}
                    -{' '}
                    {formatDateRU(eligibility.lastCompletedDates[0]!)}
                  </strong>
                </p>
              </div>
            </Card>

            {/* Two-column layout: Form + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Review Form (2/3 width) */}
              <div className="lg:col-span-2">
                <Card>
                  <div className="space-y-6">
                    {/* Instructions */}
                    <div>
                      <h3 className="font-semibold text-text-primary mb-2">
                        Содержание обзора:
                      </h3>
                      <p className="text-sm text-text-secondary mb-4">
                        Опишите ваши успехи за неделю, ключевые инсайты, важные мысли,
                        расчёты и планы. Это ваша рефлексия для анализа прогресса.
                      </p>
                    </div>

                    {/* Textarea */}
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={15}
                      placeholder="Например:&#10;&#10;• Главные достижения недели:&#10;  - Запустил новую рекламную кампанию&#10;  - Провёл 5 встреч с клиентами&#10;&#10;• Инсайты:&#10;  - Клиенты больше реагируют на эмоциональные истории&#10;  - Нужно оптимизировать процесс обработки заказов&#10;&#10;• Расчёты и планы:&#10;  - Выручка за неделю: 150 000 руб&#10;  - План на следующую неделю: выйти на 200 000 руб"
                      className="w-full"
                    />

                    {/* Character Count */}
                    <div className="text-sm text-text-muted">
                      Символов: {content.length}
                    </div>

                    {/* Included Dates */}
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary mb-3">
                        Включённые даты ({eligibility.lastCompletedDates.length}):
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {eligibility.lastCompletedDates.map((date) => (
                          <span
                            key={date}
                            className="px-3 py-1 bg-accent-purple/20 text-accent-purple text-sm rounded-full border border-accent-purple/30"
                          >
                            {formatDateRU(date)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-glass-border">
                      <Button
                        variant="ghost"
                        onClick={() => navigate('/reviews')}
                      >
                        Отменить
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={!content.trim()}
                        size="lg"
                      >
                        Сохранить обзор
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Completed Tasks Sidebar (1/3 width) */}
              <div className="lg:col-span-1">
                <Card>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-glass-border">
                      <span className="text-2xl">✅</span>
                      <h3 className="font-semibold text-text-primary">
                        Выполненные главные дела
                      </h3>
                    </div>

                    {completedTasks.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">📝</div>
                        <p className="text-sm text-text-secondary">
                          Пока нет выполненных задач в этом периоде
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {completedTasks.map(({ date, tasks }) => (
                          <div key={date} className="space-y-2">
                            <div className="text-xs font-semibold text-accent-emerald">
                              {formatDateRU(date)}
                            </div>
                            <div className="space-y-2">
                              {tasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="flex items-start gap-2 text-sm text-text-secondary bg-accent-emerald/5 p-2 rounded border border-accent-emerald/20"
                                >
                                  <span className="text-accent-emerald mt-0.5">✓</span>
                                  <span className="flex-1">{task.content}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {completedTasks.length > 0 && (
                      <div className="pt-3 border-t border-glass-border text-xs text-text-muted">
                        Всего выполнено:{' '}
                        {completedTasks.reduce((sum, day) => sum + day.tasks.length, 0)} задач
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
