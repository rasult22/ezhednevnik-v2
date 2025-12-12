import { useState, useEffect } from 'react';
import { Card } from '../../../components/layout/Card';
import { Button } from '../../../components/ui/Button';
import { quranService } from '../../../services/quran-service';
import type { QuranVerse, QuranChapterInfo } from '../../../types';

interface QuranBlockProps {
  onOpenModal: () => void;
}

/**
 * QuranBlock - Displays random verse with translation
 */
export function QuranBlock({ onOpenModal }: QuranBlockProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verse, setVerse] = useState<{
    chapterInfo: QuranChapterInfo;
    arabic: QuranVerse;
    russian: QuranVerse;
  } | null>(null);

  const loadRandomVerse = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const randomVerse = await quranService.getRandomVerse();
      setVerse(randomVerse);
    } catch (err) {
      setError('Не удалось загрузить аят');
      console.error('Failed to load verse:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRandomVerse();
  }, []);

  return (
    <Card
      title="Священный Коран"
      subtitle="Аят дня"
      variant="gradient"
      accentColor="emerald"
    >
      <div className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-success/30 border-t-success rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-4 bg-danger/20 border border-danger/30 rounded-glass-sm">
            <p className="text-sm text-danger font-medium">{error}</p>
          </div>
        )}

        {/* Verse Display */}
        {verse && !isLoading && (
          <div className="space-y-4">
            {/* Chapter Info */}
            <div className="p-3 bg-success/10 border border-success/20 rounded-glass-sm">
              <p className="text-xs font-semibold text-success">
                {verse.chapterInfo.translation}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Сура {verse.chapterInfo.id}, аят {verse.arabic.verse}
              </p>
            </div>

            {/* Arabic Text */}
            <div className="p-4 bg-dark-200/30 rounded-glass-sm border border-glass-border">
              <p className="text-right text-xl leading-relaxed font-arabic text-text-primary" dir="rtl">
                {verse.arabic.text}
              </p>
            </div>

            {/* Russian Translation */}
            <div className="p-4 bg-dark-200/30 rounded-glass-sm border border-glass-border">
              <p className="text-sm leading-relaxed text-text-secondary">
                {verse.russian.text}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={loadRandomVerse}
                className="flex-1"
              >
                Другой аят
              </Button>
              <Button
                variant="gradient"
                size="sm"
                onClick={onOpenModal}
                className="flex-1"
              >
                Открыть Коран
              </Button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-3 bg-success/10 border border-success/20 rounded-glass-sm">
          <p className="text-xs text-text-secondary">
            Читайте Священный Коран ежедневно для духовного роста
          </p>
        </div>
      </div>
    </Card>
  );
}
