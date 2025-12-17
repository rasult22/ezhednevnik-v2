import { create } from 'zustand';
import { STORAGE_KEYS } from '../types';
import { storageService } from '../services/storage-service';
import { AzkarType, AzkarProgress, AzkarData } from '../data/azkarTypes';
import { getCurrentDateISO } from '../utils/date-formatters';
import azkarMorning from '../data/azkarMorning';
import azkarEvening from '../data/azkarEvening';

interface AzkarState {
  data: AzkarData;
  isLoading: boolean;
  isViewerOpen: boolean;
  activeType: AzkarType | null;

  // Actions
  loadAzkar: () => Promise<void>;
  openViewer: (type: AzkarType) => void;
  closeViewer: () => void;
  getProgress: (type: AzkarType) => AzkarProgress | null;
  getCurrentAzkar: (type: AzkarType) => typeof azkarMorning[0] | null;
  getAzkarList: (type: AzkarType) => typeof azkarMorning;
  nextAzkar: (type: AzkarType) => void;
  prevAzkar: (type: AzkarType) => void;
  incrementRepetition: (type: AzkarType) => void;
  markComplete: (type: AzkarType) => void;
  isComplete: (type: AzkarType) => boolean;
  getCompletedCount: (type: AzkarType) => number;
}

const getDefaultProgress = (): AzkarProgress => ({
  date: getCurrentDateISO(),
  currentIndex: 0,
  completedRepetitions: 0,
  completedAzkarIds: [],
  isComplete: false,
});

/**
 * Azkar Store - Manages daily azkar reading progress
 */
export const useAzkarStore = create<AzkarState>((set, get) => ({
  data: {
    morning: null,
    evening: null,
    lastModified: new Date().toISOString(),
  },
  isLoading: true,
  isViewerOpen: false,
  activeType: null,

  loadAzkar: async () => {
    const data = await storageService.load<AzkarData>(STORAGE_KEYS.AZKAR);
    const today = getCurrentDateISO();

    if (!data) {
      const initialData: AzkarData = {
        morning: null,
        evening: null,
        lastModified: new Date().toISOString(),
      };
      await storageService.saveImmediate(STORAGE_KEYS.AZKAR, initialData);
      set({ data: initialData, isLoading: false });
    } else {
      // Reset if it's a new day
      const resetMorning = data.morning?.date !== today ? null : data.morning;
      const resetEvening = data.evening?.date !== today ? null : data.evening;

      const updatedData: AzkarData = {
        morning: resetMorning,
        evening: resetEvening,
        lastModified: data.lastModified,
      };

      if (resetMorning !== data.morning || resetEvening !== data.evening) {
        await storageService.saveImmediate(STORAGE_KEYS.AZKAR, updatedData);
      }

      set({ data: updatedData, isLoading: false });
    }
  },

  openViewer: (type: AzkarType) => {
    const { data } = get();
    const progress = data[type];
    const today = getCurrentDateISO();

    // Initialize progress if not exists or from different day
    if (!progress || progress.date !== today) {
      const newProgress = getDefaultProgress();
      const updatedData: AzkarData = {
        ...data,
        [type]: newProgress,
        lastModified: new Date().toISOString(),
      };
      storageService.saveImmediate(STORAGE_KEYS.AZKAR, updatedData);
      set({ data: updatedData, isViewerOpen: true, activeType: type });
    } else {
      set({ isViewerOpen: true, activeType: type });
    }
  },

  closeViewer: () => {
    set({ isViewerOpen: false, activeType: null });
  },

  getProgress: (type: AzkarType): AzkarProgress | null => {
    const { data } = get();
    const today = getCurrentDateISO();
    const progress = data[type];
    return progress?.date === today ? progress : null;
  },

  getAzkarList: (type: AzkarType) => {
    return type === 'morning' ? azkarMorning : azkarEvening;
  },

  getCurrentAzkar: (type: AzkarType) => {
    const { data } = get();
    const progress = data[type];
    const list = type === 'morning' ? azkarMorning : azkarEvening;

    if (!progress) return list[0] || null;
    return list[progress.currentIndex] || null;
  },

  nextAzkar: (type: AzkarType) => {
    const { data } = get();
    const progress = data[type];
    const list = type === 'morning' ? azkarMorning : azkarEvening;

    if (!progress) return;

    const nextIndex = Math.min(progress.currentIndex + 1, list.length - 1);
    const updatedProgress: AzkarProgress = {
      ...progress,
      currentIndex: nextIndex,
      completedRepetitions: 0,
    };

    const updatedData: AzkarData = {
      ...data,
      [type]: updatedProgress,
      lastModified: new Date().toISOString(),
    };

    storageService.saveImmediate(STORAGE_KEYS.AZKAR, updatedData);
    set({ data: updatedData });
  },

  prevAzkar: (type: AzkarType) => {
    const { data } = get();
    const progress = data[type];

    if (!progress) return;

    const prevIndex = Math.max(progress.currentIndex - 1, 0);
    const updatedProgress: AzkarProgress = {
      ...progress,
      currentIndex: prevIndex,
      completedRepetitions: 0,
    };

    const updatedData: AzkarData = {
      ...data,
      [type]: updatedProgress,
      lastModified: new Date().toISOString(),
    };

    storageService.saveImmediate(STORAGE_KEYS.AZKAR, updatedData);
    set({ data: updatedData });
  },

  incrementRepetition: (type: AzkarType) => {
    const { data, nextAzkar } = get();
    const progress = data[type];
    const list = type === 'morning' ? azkarMorning : azkarEvening;

    if (!progress) return;

    const currentAzkar = list[progress.currentIndex];
    if (!currentAzkar) return;
    
    const newRepCount = progress.completedRepetitions + 1;

    if (newRepCount >= currentAzkar.repetition) {
      // Mark current azkar as complete
      const completedIds = [...progress.completedAzkarIds];
      if (!completedIds.includes(currentAzkar.id)) {
        completedIds.push(currentAzkar.id);
      }

      const updatedProgress: AzkarProgress = {
        ...progress,
        completedRepetitions: 0,
        completedAzkarIds: completedIds,
      };

      const updatedData: AzkarData = {
        ...data,
        [type]: updatedProgress,
        lastModified: new Date().toISOString(),
      };

      storageService.saveImmediate(STORAGE_KEYS.AZKAR, updatedData);
      set({ data: updatedData });

      // Auto-advance if not last azkar (with delay so user sees completion)
      if (progress.currentIndex < list.length - 1) {
        setTimeout(() => nextAzkar(type), 800);
      }
    } else {
      const updatedProgress: AzkarProgress = {
        ...progress,
        completedRepetitions: newRepCount,
      };

      const updatedData: AzkarData = {
        ...data,
        [type]: updatedProgress,
        lastModified: new Date().toISOString(),
      };

      storageService.saveImmediate(STORAGE_KEYS.AZKAR, updatedData);
      set({ data: updatedData });
    }
  },

  markComplete: (type: AzkarType) => {
    const { data } = get();
    const progress = data[type];
    const list = type === 'morning' ? azkarMorning : azkarEvening;

    if (!progress) return;

    // Mark all azkar as completed
    const allIds = list.map((a) => a.id);
    const updatedProgress: AzkarProgress = {
      ...progress,
      completedAzkarIds: allIds,
      isComplete: true,
    };

    const updatedData: AzkarData = {
      ...data,
      [type]: updatedProgress,
      lastModified: new Date().toISOString(),
    };

    storageService.saveImmediate(STORAGE_KEYS.AZKAR, updatedData);
    set({ data: updatedData, isViewerOpen: false, activeType: null });
  },

  isComplete: (type: AzkarType): boolean => {
    const { data } = get();
    const today = getCurrentDateISO();
    const progress = data[type];
    return progress?.date === today && progress.isComplete === true;
  },

  getCompletedCount: (type: AzkarType): number => {
    const { data } = get();
    const today = getCurrentDateISO();
    const progress = data[type];
    if (!progress || progress.date !== today) return 0;
    return progress.completedAzkarIds.length;
  },
}));
