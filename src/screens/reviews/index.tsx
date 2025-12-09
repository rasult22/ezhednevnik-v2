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
            <p className="text-lg text-text-secondary">
              Архив ваших недельных рефлексий и анализа прогресса
            </p>
          </div>
          <Button onClick={() => navigate('/reviews/new')} size="lg">
            + Создать обзор
          </Button>
        </div>

        {/* Info Card */}
        <Card variant="gradient" accentColor="purple" className="mb-6">
          <p className="text-sm text-text-secondary">
            <strong className="text-text-primary">💡 Система обзоров:</strong> Еженедельный обзор
            разблокируется после 7 завершённых дней. Это ваше время для
            анализа успехов, инсайтов и планирования следующей недели.
          </p>
        </Card>

        {/* Reviews List */}
        {sortedReviews.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                У вас пока нет еженедельных обзоров
              </h3>
              <p className="text-text-muted mb-6">
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
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      Обзор: {formatDateRU(review.startDate)} -{' '}
                      {formatDateRU(review.endDate)}
                    </h3>
                    <p className="text-sm text-text-muted">
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
                <div className="bg-glass-light rounded-glass-sm p-4 border border-glass-border">
                  <p className="text-sm text-text-primary line-clamp-3">
                    {review.content || (
                      <em className="text-text-muted">Нет содержимого</em>
                    )}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="mt-3 flex items-center gap-4 text-xs text-text-muted">
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
            <h3 className="font-semibold text-text-primary mb-4">
              📊 Статистика обзоров:
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {sortedReviews.length}
                </div>
                <div className="text-sm text-text-secondary">Всего обзоров</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-emerald">
                  {sortedReviews.reduce(
                    (acc, r) => acc + r.dailyPagesIncluded.length,
                    0
                  )}
                </div>
                <div className="text-sm text-text-secondary">Дней проанализировано</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent-purple">
                  {Math.round(
                    sortedReviews.reduce(
                      (acc, r) => acc + r.content.length,
                      0
                    ) / sortedReviews.length
                  )}
                </div>
                <div className="text-sm text-text-secondary">
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
              <div className="bg-glass-light p-4 rounded-glass-sm">
                <div className="grid grid-cols-2 gap-4 text-sm text-text-secondary">
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
                <h4 className="font-semibold text-text-primary mb-3">
                  Содержание обзора:
                </h4>
                <div className="bg-glass-light border border-glass-border rounded-glass-sm p-4 max-h-96 overflow-y-auto custom-scrollbar">
                  <p className="text-text-primary whitespace-pre-wrap leading-relaxed">
                    {selectedReviewData.content || (
                      <em className="text-text-muted">Нет содержимого</em>
                    )}
                  </p>
                </div>
              </div>

              {/* Included Dates */}
              <div>
                <h4 className="font-semibold text-text-primary mb-3">
                  Включённые даты:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedReviewData.dailyPagesIncluded.map((date) => (
                    <span
                      key={date}
                      className="px-3 py-1 bg-accent-purple/20 text-accent-purple text-sm rounded-full border border-accent-purple/30"
                    >
                      {formatDateRU(date)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-glass-border">
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
