import { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { quranService } from '../../../services/quran-service';
import type { QuranChapterInfo, QuranChapter } from '../../../types';

interface QuranModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'chapters' | 'reading';

/**
 * QuranModal - Full Quran reader with chapter navigation
 */
export function QuranModal({ isOpen, onClose }: QuranModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('chapters');
  const [chaptersInfo, setChaptersInfo] = useState<QuranChapterInfo[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [chapterData, setChapterData] = useState<{
    info: QuranChapterInfo;
    arabic: QuranChapter;
    russian: QuranChapter;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chapters list on mount
  useEffect(() => {
    if (!isOpen) return;

    const loadChapters = async () => {
      try {
        const chapters = await quranService.getChaptersInfo();
        setChaptersInfo(chapters);
      } catch (err) {
        setError('Не удалось загрузить список сур');
        console.error('Failed to load chapters:', err);
      }
    };

    loadChapters();
  }, [isOpen]);

  // Load selected chapter
  const loadChapter = async (chapterId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await quranService.getChapter(chapterId);
      setChapterData(data);
      setSelectedChapterId(chapterId);
      setViewMode('reading');
    } catch (err) {
      setError('Не удалось загрузить суру');
      console.error('Failed to load chapter:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextChapter = () => {
    if (!selectedChapterId || selectedChapterId >= 114) return;
    loadChapter(selectedChapterId + 1);
  };

  const goToPrevChapter = () => {
    if (!selectedChapterId || selectedChapterId <= 1) return;
    loadChapter(selectedChapterId - 1);
  };

  const handleClose = () => {
    setViewMode('chapters');
    setSelectedChapterId(null);
    setChapterData(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={viewMode === 'chapters' ? 'Священный Коран' : chapterData?.info.translation}
      size="xl"
    >
      {/* Chapters List View */}
      {viewMode === 'chapters' && (
        <div className="space-y-4">
          <div className="p-4 bg-success/10 border border-success/20 rounded-glass-sm">
            <p className="text-sm text-text-secondary">
              Выберите суру для чтения
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {chaptersInfo.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => loadChapter(chapter.id)}
                className="p-4 text-left bg-dark-200/50 border border-glass-border rounded-glass-sm hover:bg-dark-200/70 hover:border-success/30 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-success bg-success/20 px-2 py-1 rounded">
                        {chapter.id}
                      </span>
                      <p className="text-sm font-semibold text-text-primary group-hover:text-success transition-colors">
                        {chapter.translation}
                      </p>
                    </div>
                    <p className="text-xs text-text-secondary truncate">
                      {chapter.transliteration}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {chapter.total_verses} аятов • {chapter.type === 'meccan' ? 'Мекканская' : 'Мединская'}
                    </p>
                  </div>
                  <div className="text-right text-lg font-arabic text-text-primary" dir="rtl">
                    {chapter.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reading View */}
      {viewMode === 'reading' && (
        <div className="space-y-4">
          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-glass-border sticky top-0 bg-dark-100/90 backdrop-blur-glass z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewMode('chapters')}
            >
              ← Суры
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevChapter}
                disabled={!selectedChapterId || selectedChapterId <= 1}
              >
                ← Пред.
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextChapter}
                disabled={!selectedChapterId || selectedChapterId >= 114}
              >
                След. →
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-success/30 border-t-success rounded-full animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-4 bg-danger/20 border border-danger/30 rounded-glass-sm">
              <p className="text-sm text-danger font-medium">{error}</p>
            </div>
          )}

          {/* Chapter Content */}
          {chapterData && !isLoading && (
            <div className="space-y-4 pb-4">
              {/* Chapter Header */}
              <div className="p-4 bg-success/10 border border-success/20 rounded-glass-sm text-center">
                <p className="text-2xl font-arabic text-text-primary mb-2" dir="rtl">
                  {chapterData.info.name}
                </p>
                <p className="text-sm text-text-secondary">
                  {chapterData.info.translation} • {chapterData.info.total_verses} аятов
                </p>
              </div>

              {/* Bismillah (except for Surah 9) */}
              {chapterData.info.id !== 9 && (
                <div className="p-6 text-center">
                  <p className="text-2xl font-arabic text-success" dir="rtl">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-sm text-text-secondary mt-2">
                    Во имя Аллаха, Милостивого, Милосердного
                  </p>
                </div>
              )}

              {/* Verses */}
              <div className="space-y-6">
                {chapterData.arabic.verses.map((verse, index) => {
                  const russianVerse = chapterData.russian.verses[index];

                  return (
                    <div
                      key={verse.id}
                      className="p-4 bg-dark-200/30 rounded-glass-sm border border-glass-border hover:border-success/30 transition-colors"
                    >
                      {/* Verse Number */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-success bg-success/20 px-2 py-1 rounded">
                          {verse.verse}
                        </span>
                      </div>

                      {/* Arabic Text */}
                      <p className="text-right text-xl leading-loose font-arabic text-text-primary mb-4" dir="rtl">
                        {verse.text}
                      </p>

                      {/* Russian Translation */}
                      {russianVerse && russianVerse.translation && (
                        <p className="text-sm leading-relaxed text-text-secondary border-t border-glass-border pt-3">
                          {russianVerse.translation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-glass-border sticky bottom-0 bg-dark-100/90 backdrop-blur-glass">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={goToPrevChapter}
                  disabled={!selectedChapterId || selectedChapterId <= 1}
                >
                  ← Предыдущая сура
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={goToNextChapter}
                  disabled={!selectedChapterId || selectedChapterId >= 114}
                >
                  Следующая сура →
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
