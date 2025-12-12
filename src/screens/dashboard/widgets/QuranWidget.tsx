import { useState, useEffect } from 'react';
import { quranService } from '../../../services/quran-service';
import { QuranModal } from '../../daily/components/QuranModal';
import type { QuranVerse, QuranChapterInfo } from '../../../types';

/**
 * Quran Widget - Displays random verse with translation
 */
export function QuranWidget() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verse, setVerse] = useState<{
    chapterInfo: QuranChapterInfo;
    arabic: QuranVerse;
    russian: QuranVerse;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadRandomVerse = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const randomVerse = await quranService.getRandomVerse();
      console.log('Loaded verse:', {
        arabic: randomVerse.arabic,
        russian: randomVerse.russian,
        chapter: randomVerse.chapterInfo,
      });
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

  if (isLoading) {
    return (
      <div className="glass p-6">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Священный Коран</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-success/30 border-t-success rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !verse) {
    return (
      <div className="glass p-6">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Священный Коран</h3>
        <p className="text-text-muted text-center py-4">{error || 'Ошибка загрузки'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold gradient-text">Священный Коран</h3>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-accent-emerald hover:text-accent-cyan transition-colors"
          >
            Открыть →
          </button>
        </div>

        <div className="space-y-4">
          {/* Chapter Info */}
          <div className="p-3 bg-success/10 border border-success/20 rounded-glass-sm">
            <p className="text-xs font-semibold text-success">
              {verse.chapterInfo.id}:{verse.arabic.verse || verse.russian.verse || verse.arabic.id}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {verse.chapterInfo.transliteration} • {verse.chapterInfo.total_verses} аятов
            </p>
          </div>

          {/* Arabic Text */}
          <div className="p-4 bg-white/5 rounded-glass-sm">
            <p className="text-right text-lg leading-relaxed font-arabic text-text-primary" dir="rtl">
              {verse.arabic.text}
            </p>
          </div>

          {/* Russian Translation */}
          <div className="p-4 bg-white/5 rounded-glass-sm">
            <p className="text-sm leading-relaxed text-text-secondary">
              {verse.russian.translation || 'Перевод не найден'}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={loadRandomVerse}
            className="w-full py-2 px-4 bg-accent-emerald/20 hover:bg-accent-emerald/30 border border-accent-emerald/30 rounded-glass-sm transition-all text-sm font-medium text-accent-emerald"
          >
            Другой аят
          </button>
        </div>
      </div>

      {/* Quran Modal */}
      <QuranModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
