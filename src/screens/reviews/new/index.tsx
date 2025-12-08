import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { useReviewsStore } from '../../../stores/useReviewsStore';
import { formatDateRU } from '../../../utils/date-formatters';

/**
 * New Weekly Review Screen - Create a new weekly review
 *
 * Features:
 * - Checks eligibility (7 completed daily pages)
 * - Shows progress if not eligible
 * - Large textarea for review content
 * - Auto-calculates date range from completed pages
 */
export default function NewReviewScreen() {
  const navigate = useNavigate();
  const canCreateReview = useReviewsStore((state) => state.canCreateReview);
  const createReview = useReviewsStore((state) => state.createReview);

  const [content, setContent] = useState('');
  const [eligibility, setEligibility] = useState<{
    allowed: boolean;
    completedCount: number;
    lastCompletedDates: string[];
  } | null>(null);

  // Check eligibility on mount
  useEffect(() => {
    const result = canCreateReview();
    setEligibility(result);
  }, [canCreateReview]);

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
          <p className="text-center text-gray-500">Загрузка...</p>
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

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Еженедельный обзор
          </h1>
          <p className="text-lg text-gray-600">
            Успехи за неделю по главным 20% и важные мысли
          </p>
        </div>

        {/* Not Eligible - Show Progress */}
        {!eligibility.allowed && (
          <Card>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-sm text-gray-800 mb-2">
                <strong>⏳ Еженедельный обзор пока недоступен</strong>
              </p>
              <p className="text-sm text-gray-700">
                Для создания обзора необходимо завершить 7 дней работы.
              </p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Прогресс:</span>
                <span className="font-semibold">
                  {eligibility.completedCount} / 7 дней
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(eligibility.completedCount / 7) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Recent Completed Days */}
            {eligibility.lastCompletedDates.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Последние завершённые дни:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {eligibility.lastCompletedDates.map((date) => (
                    <span
                      key={date}
                      className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full"
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
                <p className="text-gray-600">
                  У вас пока нет завершённых дней. Начните заполнять ежедневную
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
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-sm text-gray-800">
                  <strong>✅ Готово к созданию обзора!</strong>
                </p>
                <p className="text-sm text-gray-700 mt-1">
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

            {/* Review Form */}
            <Card>
              <div className="space-y-6">
                {/* Instructions */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Содержание обзора:
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
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
                <div className="text-sm text-gray-500">
                  Символов: {content.length}
                </div>

                {/* Included Dates */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Включённые даты ({eligibility.lastCompletedDates.length}):
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {eligibility.lastCompletedDates.map((date) => (
                      <span
                        key={date}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
                      >
                        {formatDateRU(date)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
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
          </>
        )}
      </div>
    </Container>
  );
}
