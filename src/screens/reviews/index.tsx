import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/layout/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useReviewsStore } from '../../stores/useReviewsStore';
import { formatDateRU } from '../../utils/date-formatters';

/**
 * Weekly Reviews Archive Screen - List of all weekly reviews
 *
 * Features:
 * - Shows all reviews in reverse chronological order
 * - Preview of review content
 * - Expandable full view
 * - Navigation to create new review
 */
export default function ReviewsArchiveScreen() {
  const navigate = useNavigate();
  const reviews = useReviewsStore((state) => state.reviews);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  // Sort reviews by start date descending (newest first)
  const sortedReviews = [...reviews].sort(
    (a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const selectedReviewData = sortedReviews.find(
    (r) => r.id === selectedReview
  );

  return (
    <Container size="lg">
      <div className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-3">
              Еженедельные обзоры
            </h1>
            <p className="text-lg text-gray-600">
              Архив ваших недельных рефлексий и анализа прогресса
            </p>
          </div>
          <Button onClick={() => navigate('/reviews/new')} size="lg">
            + Создать обзор
          </Button>
        </div>

        {/* Info Card */}
        <Card className="mb-6">
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4">
            <p className="text-sm text-gray-800">
              <strong>💡 Система обзоров:</strong> Еженедельный обзор
              разблокируется после 7 завершённых дней. Это ваше время для
              анализа успехов, инсайтов и планирования следующей недели.
            </p>
          </div>
        </Card>

        {/* Reviews List */}
        {sortedReviews.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                У вас пока нет еженедельных обзоров
              </h3>
              <p className="text-gray-500 mb-6">
                Завершите 7 дней работы, чтобы создать первый обзор
              </p>
              <Button onClick={() => navigate('/reviews/new')}>
                Создать обзор
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <Card key={review.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Обзор: {formatDateRU(review.startDate)} -{' '}
                      {formatDateRU(review.endDate)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Создан:{' '}
                      {new Date(review.createdAt).toLocaleDateString('ru-RU')} в{' '}
                      {new Date(review.createdAt).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedReview(review.id)}
                  >
                    Открыть
                  </Button>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {review.content || (
                      <em className="text-gray-400">Нет содержимого</em>
                    )}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    📅 {review.dailyPagesIncluded.length} дней включено
                  </span>
                  <span>
                    📝 {review.content.length} символов
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {sortedReviews.length > 0 && (
          <Card className="mt-8">
            <h3 className="font-semibold text-gray-800 mb-4">
              📊 Статистика обзоров:
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {sortedReviews.length}
                </div>
                <div className="text-sm text-gray-600">Всего обзоров</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {sortedReviews.reduce(
                    (acc, r) => acc + r.dailyPagesIncluded.length,
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600">Дней проанализировано</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600">
                  {Math.round(
                    sortedReviews.reduce(
                      (acc, r) => acc + r.content.length,
                      0
                    ) / sortedReviews.length
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Средняя длина (символы)
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Full Review Modal */}
        {selectedReviewData && (
          <Modal
            isOpen={true}
            onClose={() => setSelectedReview(null)}
            title={`Обзор: ${formatDateRU(
              selectedReviewData.startDate
            )} - ${formatDateRU(selectedReviewData.endDate)}`}
            size="lg"
          >
            <div className="space-y-4">
              {/* Meta */}
              <div className="bg-gray-50 p-4 rounded">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Создан:</span>{' '}
                    {new Date(
                      selectedReviewData.createdAt
                    ).toLocaleDateString('ru-RU')}
                  </div>
                  <div>
                    <span className="font-medium">Дней включено:</span>{' '}
                    {selectedReviewData.dailyPagesIncluded.length}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Содержание обзора:
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedReviewData.content || (
                      <em className="text-gray-400">Нет содержимого</em>
                    )}
                  </p>
                </div>
              </div>

              {/* Included Dates */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Включённые даты:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedReviewData.dailyPagesIncluded.map((date) => (
                    <span
                      key={date}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
                    >
                      {formatDateRU(date)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button onClick={() => setSelectedReview(null)}>
                  Закрыть
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Container>
  );
}
