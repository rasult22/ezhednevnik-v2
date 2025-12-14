import { create } from 'zustand';
import { DailyPage, Task, STORAGE_KEYS, DateAccessResult } from '../types';
import { storageService } from '../services/storage-service';
import { dateNavigationService } from '../services/date-navigation-service';
import { getCurrentDateISO, getDayOfMonth } from '../utils/date-formatters';

interface DailyState {
  dailyPages: Record<string, DailyPage>;
  currentDate: string;
  isLoading: boolean;

  // Actions
  loadDailyPages: () => Promise<void>;
  getDailyPage: (date: string) => DailyPage | null;
  createOrGetDailyPage: (date: string) => DailyPage;
  updateDailyPage: (date: string, updates: Partial<DailyPage>) => void;

  // Main for Month
  setMainForMonth: (date: string, projects: [string, string, string]) => void;

  // Tasks
  toggleTask: (date: string, taskId: string, type: 'main' | 'secondary') => void;
  updateTaskContent: (
    date: string,
    taskId: string,
    content: string,
    type: 'main' | 'secondary'
  ) => void;

  // Gratitude and Affirmation
  updateGratitude: (date: string, index: number, content: string) => void;
  updateFinancialAffirmation: (date: string, content: string) => void;
  confirmFinancialAffirmation: (date: string) => void;

  // Date Navigation
  canAccessDate: (date: string) => DateAccessResult;
  markDateAsSkipped: (date: string) => void;
  getSkippedDates: () => string[];

  // Transfer tasks
  transferTasks: (fromDate: string, toDate: string, taskIds: string[]) => void;

  // Utilities
  setCurrentDate: (date: string) => void;
  checkAndUpdateCompletion: (date: string) => void;
}

/**
 * Daily Store - Manages daily pages (most complex store)
 *
 * Critical business logic:
 * - Date access control (past read-only, future blocked)
 * - Automatic completion detection when all 3 main tasks done
 * - Monthly project locking after first day
 * - Skipped dates tracking
 */
export const useDailyStore = create<DailyState>((set, get) => ({
  dailyPages: {},
  currentDate: getCurrentDateISO(),
  isLoading: true,

  /**
   * Load all daily pages from Chrome Storage
   */
  loadDailyPages: async () => {
    const pages = await storageService.load<Record<string, DailyPage>>(
      STORAGE_KEYS.DAILY_PAGES
    );

    if (!pages) {
      await storageService.saveImmediate(STORAGE_KEYS.DAILY_PAGES, {});
      set({ dailyPages: {}, isLoading: false });
    } else {
      set({ dailyPages: pages, isLoading: false });
    }
  },

  /**
   * Get daily page for a specific date
   */
  getDailyPage: (date: string) => {
    return get().dailyPages[date] || null;
  },

  /**
   * Create or get existing daily page
   * Automatically inherits "Main for Month" from current month
   */
  createOrGetDailyPage: (date: string) => {
    const { dailyPages } = get();
    const existing = dailyPages[date];

    if (existing) {
      return existing;
    }

    // Find "Main for Month" from any page in the same month
    const monthKey = date.substring(0, 7); // YYYY-MM
    const pagesThisMonth = Object.entries(dailyPages).filter(([d]) =>
      d.startsWith(monthKey)
    );

    let mainForMonth: [string, string, string] = ['', '', ''];
    if (pagesThisMonth.length > 0) {
      // Inherit from first page of month
      mainForMonth = pagesThisMonth[0]![1]!.mainForMonth;
    }

    // Create empty tasks
    const createEmptyTask = (): Task => ({
      id: crypto.randomUUID(),
      content: '',
      completed: false,
    });

    const newPage: DailyPage = {
      date,
      status: 'pending',
      mainForMonth,
      mainThree: [createEmptyTask(), createEmptyTask(), createEmptyTask()],
      secondaryNine: Array.from({ length: 9 }, createEmptyTask),
      gratitude: ['', '', ''],
      financialAffirmation: '',
      financialAffirmationConfirmed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedPages = { ...dailyPages, [date]: newPage };
    storageService.saveImmediate(STORAGE_KEYS.DAILY_PAGES, updatedPages);
    set({ dailyPages: updatedPages });

    return newPage;
  },

  /**
   * Update daily page
   */
  updateDailyPage: (date: string, updates: Partial<DailyPage>) => {
    const { dailyPages } = get();
    const page = dailyPages[date];
    if (!page) return;

    const updatedPage = { ...page, ...updates };
    const updatedPages = { ...dailyPages, [date]: updatedPage };

    storageService.saveDebounced(STORAGE_KEYS.DAILY_PAGES, updatedPages);
    set({ dailyPages: updatedPages });
  },

  /**
   * Set "Main for Month" for a specific date
   * Updates all days in the same month
   */
  setMainForMonth: (date: string, projects: [string, string, string]) => {
    const { dailyPages } = get();
    const monthKey = date.substring(0, 7); // YYYY-MM

    const updatedPages: Record<string, DailyPage> = {};

    // Update all pages in the same month
    Object.entries(dailyPages).forEach(([pageDate, page]) => {
      if (pageDate.startsWith(monthKey)) {
        updatedPages[pageDate] = {
          ...page,
          mainForMonth: projects,
          mainForMonthLockedAt: getDayOfMonth(date) === 1
            ? undefined
            : new Date().toISOString(),
        };
      } else {
        updatedPages[pageDate] = page;
      }
    });

    storageService.saveImmediate(STORAGE_KEYS.DAILY_PAGES, updatedPages);
    set({ dailyPages: updatedPages });
  },

  /**
   * Toggle task completion
   * Automatically checks if day is completed after toggling
   */
  toggleTask: (date: string, taskId: string, type: 'main' | 'secondary') => {
    const { dailyPages } = get();
    const page = dailyPages[date];
    if (!page) return;

    let updatedPage: DailyPage;

    if (type === 'main') {
      updatedPage = {
        ...page,
        mainThree: page.mainThree.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : undefined,
              }
            : task
        ) as [Task, Task, Task],
      };
    } else {
      updatedPage = {
        ...page,
        secondaryNine: page.secondaryNine.map((task) =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date().toISOString() : undefined,
              }
            : task
        ),
      };
    }

    const updatedPages = { ...dailyPages, [date]: updatedPage };
    storageService.saveImmediate(STORAGE_KEYS.DAILY_PAGES, updatedPages);
    set({ dailyPages: updatedPages });

    // Check if day is completed (all 3 main tasks done)
    if (type === 'main') {
      get().checkAndUpdateCompletion(date);
    }
  },

  /**
   * Update task content (text)
   */
  updateTaskContent: (
    date: string,
    taskId: string,
    content: string,
    type: 'main' | 'secondary'
  ) => {
    const { dailyPages } = get();
    const page = dailyPages[date];
    if (!page) return;

    let updatedPage: DailyPage;

    if (type === 'main') {
      updatedPage = {
        ...page,
        mainThree: page.mainThree.map((task) =>
          task.id === taskId ? { ...task, content } : task
        ) as [Task, Task, Task],
      };
    } else {
      updatedPage = {
        ...page,
        secondaryNine: page.secondaryNine.map((task) =>
          task.id === taskId ? { ...task, content } : task
        ),
      };
    }

    const updatedPages = { ...dailyPages, [date]: updatedPage };
    storageService.saveDebounced(STORAGE_KEYS.DAILY_PAGES, updatedPages);
    set({ dailyPages: updatedPages });
  },

  /**
   * Update gratitude entry
   */
  updateGratitude: (date: string, index: number, content: string) => {
    const { dailyPages } = get();
    const page = dailyPages[date];
    if (!page) return;

    const gratitude: [string, string, string] = [...page.gratitude] as [
      string,
      string,
      string
    ];
    gratitude[index] = content;

    get().updateDailyPage(date, { gratitude });
  },

  /**
   * Update financial affirmation
   */
  updateFinancialAffirmation: (date: string, content: string) => {
    get().updateDailyPage(date, { financialAffirmation: content });
  },

  /**
   * Confirm financial affirmation (signature)
   */
  confirmFinancialAffirmation: (date: string) => {
    const { dailyPages } = get();
    const page = dailyPages[date];
    if (!page) return;

    get().updateDailyPage(date, {
      financialAffirmationConfirmed: !page.financialAffirmationConfirmed,
    });
  },

  /**
   * Check if date can be accessed
   * Uses date-navigation-service for business logic
   */
  canAccessDate: (date: string): DateAccessResult => {
    const { dailyPages } = get();
    return dateNavigationService.canAccessDate(date, dailyPages);
  },

  /**
   * Mark a date as skipped
   */
  markDateAsSkipped: (date: string) => {
    const page = get().createOrGetDailyPage(date);

    const updatedPage: DailyPage = {
      ...page,
      status: 'skipped',
    };

    const { dailyPages } = get();
    const updatedPages = { ...dailyPages, [date]: updatedPage };

    storageService.saveImmediate(STORAGE_KEYS.DAILY_PAGES, updatedPages);
    set({ dailyPages: updatedPages });
  },

  /**
   * Get all skipped dates
   */
  getSkippedDates: (): string[] => {
    const { dailyPages } = get();
    return dateNavigationService.getSkippedDates(dailyPages);
  },

  /**
   * Transfer tasks from one date to another
   * Copies selected tasks to empty slots in target date
   * Main tasks go to main slots, secondary tasks go to secondary slots
   */
  transferTasks: (fromDate: string, toDate: string, taskIds: string[]) => {
    const { dailyPages } = get();
    const fromPage = dailyPages[fromDate];
    const toPage = dailyPages[toDate];

    if (!fromPage || !toPage) return;

    // Separate main and secondary tasks to transfer
    const mainTasksToTransfer = fromPage.mainThree.filter((task) =>
      taskIds.includes(task.id)
    );
    const secondaryTasksToTransfer = fromPage.secondaryNine.filter((task) =>
      taskIds.includes(task.id)
    );

    if (mainTasksToTransfer.length === 0 && secondaryTasksToTransfer.length === 0) return;

    // Find empty slots in target page
    const emptyMainSlots: number[] = [];
    const emptySecondarySlots: number[] = [];

    toPage.mainThree.forEach((task, index) => {
      if (task.content.trim() === '') {
        emptyMainSlots.push(index);
      }
    });

    toPage.secondaryNine.forEach((task, index) => {
      if (task.content.trim() === '') {
        emptySecondarySlots.push(index);
      }
    });

    // Create copies of tasks with new IDs
    const updatedMainThree = [...toPage.mainThree];
    const updatedSecondaryNine = [...toPage.secondaryNine];

    // Transfer main tasks to main slots only
    let mainSlotIndex = 0;
    mainTasksToTransfer.forEach((task) => {
      if (mainSlotIndex < emptyMainSlots.length) {
        const slotIndex = emptyMainSlots[mainSlotIndex]!;
        updatedMainThree[slotIndex] = {
          id: crypto.randomUUID(),
          content: task.content,
          completed: false,
        };
        mainSlotIndex++;
      }
      // If no empty main slots available, task is not transferred
    });

    // Transfer secondary tasks to secondary slots only
    let secondarySlotIndex = 0;
    secondaryTasksToTransfer.forEach((task) => {
      if (secondarySlotIndex < emptySecondarySlots.length) {
        const slotIndex = emptySecondarySlots[secondarySlotIndex]!;
        updatedSecondaryNine[slotIndex] = {
          id: crypto.randomUUID(),
          content: task.content,
          completed: false,
        };
        secondarySlotIndex++;
      }
      // If no empty secondary slots available, task is not transferred
    });

    // Update the target page
    const updatedPage: DailyPage = {
      ...toPage,
      mainThree: updatedMainThree as [Task, Task, Task],
      secondaryNine: updatedSecondaryNine,
    };

    const updatedPages = { ...dailyPages, [toDate]: updatedPage };
    storageService.saveImmediate(STORAGE_KEYS.DAILY_PAGES, updatedPages);
    set({ dailyPages: updatedPages });
  },

  /**
   * Set current viewing date
   */
  setCurrentDate: (date: string) => {
    set({ currentDate: date });
  },

  /**
   * Check if all 3 main tasks are completed
   * If yes, mark day as completed
   */
  checkAndUpdateCompletion: (date: string) => {
    const { dailyPages } = get();
    const page = dailyPages[date];
    if (!page) return;

    const allMainTasksCompleted = page.mainThree.every((task) => task.completed);

    if (allMainTasksCompleted && page.status !== 'completed') {
      const updatedPage: DailyPage = {
        ...page,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };

      const updatedPages = { ...dailyPages, [date]: updatedPage };
      storageService.saveImmediate(STORAGE_KEYS.DAILY_PAGES, updatedPages);
      set({ dailyPages: updatedPages });
    } else if (!allMainTasksCompleted && page.status === 'completed') {
      // Uncomplete if task was unchecked
      const updatedPage: DailyPage = {
        ...page,
        status: 'pending',
        completedAt: undefined,
      };

      const updatedPages = { ...dailyPages, [date]: updatedPage };
      storageService.saveImmediate(STORAGE_KEYS.DAILY_PAGES, updatedPages);
      set({ dailyPages: updatedPages });
    }
  },
}));
