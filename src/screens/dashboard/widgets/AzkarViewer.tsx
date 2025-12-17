import { motion, AnimatePresence } from 'framer-motion';
import { useAzkarStore } from '../../../stores/useAzkarStore';
import { AzkarType } from '../../../data/azkarTypes';

interface AzkarViewerProps {
  type: AzkarType;
}

/**
 * Azkar Viewer - Full-screen modal for reading azkar
 */
export function AzkarViewer({ type }: AzkarViewerProps) {
  const closeViewer = useAzkarStore((state) => state.closeViewer);
  const getCurrentAzkar = useAzkarStore((state) => state.getCurrentAzkar);
  const getAzkarList = useAzkarStore((state) => state.getAzkarList);
  const getProgress = useAzkarStore((state) => state.getProgress);
  const nextAzkar = useAzkarStore((state) => state.nextAzkar);
  const prevAzkar = useAzkarStore((state) => state.prevAzkar);
  const incrementRepetition = useAzkarStore((state) => state.incrementRepetition);
  const markComplete = useAzkarStore((state) => state.markComplete);

  const azkar = getCurrentAzkar(type);
  const list = getAzkarList(type);
  const progress = getProgress(type);

  if (!azkar || !progress) return null;

  const currentIndex = progress.currentIndex;
  const totalCount = list.length;
  const isLast = currentIndex === totalCount - 1;
  const isFirst = currentIndex === 0;
  const currentReps = progress.completedRepetitions;
  const totalReps = azkar.repetition;
  const isCurrentComplete = progress.completedAzkarIds.includes(azkar.id);

  const title = type === 'morning' ? 'Утренние азкары' : 'Вечерние азкары';

  const handleRepClick = () => {
    if (!isCurrentComplete) {
      incrementRepetition(type);
    }
  };

  // Animation variants for content transition
  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && closeViewer()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        layout
        className="w-full max-w-2xl h-[85vh] flex flex-col glass rounded-glass-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10 bg-dark-200/95">
          <h2 className="text-xl font-bold gradient-text">{title}</h2>
          <button
            onClick={closeViewer}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-text-muted hover:text-text-primary"
          >
            ✕
          </button>
        </div>

        {/* Progress */}
        <div className="flex-shrink-0 p-4 text-center border-b border-glass-border-light">
          <span className="text-sm text-text-secondary">
            Азкар {currentIndex + 1} из {totalCount}
          </span>
          <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-blue to-accent-purple"
              initial={false}
              animate={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={azkar.id}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Arabic Text */}
            <div className="text-center">
              <p
                className="text-2xl leading-loose text-text-primary font-arabic"
                style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
              >
                {azkar.text}
              </p>
            </div>

          {/* Transliteration */}
          {azkar.transliteration && (
            <div className="p-4 bg-white/5 rounded-glass-sm">
              <p className="text-base text-text-secondary italic whitespace-pre-line">
                {azkar.transliteration}
              </p>
            </div>
          )}

          {/* Translation */}
          <div className="p-4 bg-accent-blue/10 border border-accent-blue/20 rounded-glass-sm">
            <p className="text-base text-text-primary whitespace-pre-line">
              {azkar.translation}
            </p>
          </div>

          {/* Source */}
          <div className="text-center text-sm text-text-muted">
            Источник: {azkar.source}
          </div>

          {/* Effect */}
          {azkar.effect && (
            <div className="p-4 bg-accent-emerald/10 border border-accent-emerald/20 rounded-glass-sm">
              <p className="text-sm text-accent-emerald">{azkar.effect}</p>
            </div>
          )}

          {/* Repetition Counter */}
          <div className="flex justify-center">
            <button
              onClick={handleRepClick}
              disabled={isCurrentComplete}
              className={`px-8 py-4 rounded-glass-lg transition-all ${
                isCurrentComplete
                  ? 'bg-success/20 border border-success/30 cursor-default'
                  : 'bg-accent-blue/20 border border-accent-blue/30 hover:bg-accent-blue/30 active:scale-95'
              }`}
            >
              <div className="text-center">
                <p className={`text-xl font-bold ${isCurrentComplete ? 'text-success' : 'text-accent-blue'}`}>
                  {isCurrentComplete ? '✓ Завершено' : `${currentReps} / ${totalReps}`}
                </p>
                {!isCurrentComplete && (
                  <p className="text-sm text-text-muted mt-1">Нажмите для повторения</p>
                )}
              </div>
              {/* Progress bar under button */}
              {!isCurrentComplete && totalReps > 1 && (
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-blue transition-all duration-200"
                    style={{ width: `${(currentReps / totalReps) * 100}%` }}
                  />
                </div>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

        {/* Footer Navigation */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 bg-dark-200/95">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => prevAzkar(type)}
              disabled={isFirst}
              className={`flex-1 py-3 px-4 rounded-glass-sm transition-all ${
                isFirst
                  ? 'bg-white/5 text-text-muted cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-text-primary'
              }`}
            >
              ← Назад
            </button>

            {isLast ? (
              <button
                onClick={() => markComplete(type)}
                className="flex-1 py-3 px-4 rounded-glass-sm bg-success/20 border border-success/30 text-success font-semibold hover:bg-success/30 transition-all"
              >
                ✓ Отметить всё как прочитано
              </button>
            ) : (
              <button
                onClick={() => nextAzkar(type)}
                className="flex-1 py-3 px-4 rounded-glass-sm bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue font-semibold transition-all"
              >
                Вперёд →
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
