import { useEffect, useState } from 'react';
import { useAzkarStore } from '../../../stores/useAzkarStore';
import { AzkarType } from '../../../data/azkarTypes';
import { AzkarViewer } from './AzkarViewer';

interface AzkarWidgetProps {
  type: AzkarType;
  title: string;
  icon: string;
}

/**
 * Azkar Widget - Dashboard widget for morning/evening azkar
 */
export function AzkarWidget({ type, title, icon }: AzkarWidgetProps) {
  const loadAzkar = useAzkarStore((state) => state.loadAzkar);
  const isLoading = useAzkarStore((state) => state.isLoading);
  const openViewer = useAzkarStore((state) => state.openViewer);
  const isComplete = useAzkarStore((state) => state.isComplete);
  const getCompletedCount = useAzkarStore((state) => state.getCompletedCount);
  const getAzkarList = useAzkarStore((state) => state.getAzkarList);
  const isViewerOpen = useAzkarStore((state) => state.isViewerOpen);
  const activeType = useAzkarStore((state) => state.activeType);

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      loadAzkar();
      setHasLoaded(true);
    }
  }, [loadAzkar, hasLoaded]);

  const completed = isComplete(type);
  const completedCount = getCompletedCount(type);
  const totalCount = getAzkarList(type).length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleClick = () => {
    openViewer(type);
  };

  if (isLoading) {
    return (
      <div className="glass p-6 animate-pulse">
        <div className="h-6 bg-white/10 rounded mb-4 w-3/4"></div>
        <div className="h-2 bg-white/10 rounded w-full"></div>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={`glass p-6 cursor-pointer transition-all hover:scale-[1.02] ${
          completed
            ? 'border-success/30 shadow-glow-success bg-gradient-to-r from-accent-emerald/10 via-accent-cyan/10 to-accent-blue/10'
            : 'hover:border-accent-blue/30'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{completed ? '✅' : icon}</span>
            <h3 className="text-lg font-semibold gradient-text">{title}</h3>
          </div>
          <span className="text-sm text-accent-blue hover:text-accent-blue/80 transition-colors">
            Открыть →
          </span>
        </div>

        {completed ? (
          <div className="p-4 bg-success/10 border border-success/20 rounded-glass-sm text-center">
            <p className="text-success font-semibold">🎉 Все азкары прочитаны!</p>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Прогресс</span>
                <span className="font-semibold text-accent-blue">
                  {completedCount}/{totalCount}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Viewer Modal */}
      {isViewerOpen && activeType === type && <AzkarViewer type={type} />}
    </>
  );
}
