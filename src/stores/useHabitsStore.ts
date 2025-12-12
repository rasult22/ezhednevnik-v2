import { create } from 'zustand';
import { Habit, STORAGE_KEYS } from '../types';
import { storageService } from '../services/storage-service';

interface HabitsState {
  habits: Habit[];
  isLoading: boolean;

  // Actions
  loadHabits: () => void;
  addHabit: (name: string, color: string) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  toggleHabitDate: (habitId: string, date: string) => void;
  isHabitCompletedOnDate: (habitId: string, date: string) => boolean;
}

/**
 * Habits Store - Manages habit tracking
 *
 * Features:
 * - Create/delete habits
 * - Toggle completion for specific dates
 * - GitHub-style contribution graph visualization
 */
export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  isLoading: true,

  /**
   * Load all habits from LocalStorage
   */
  loadHabits: () => {
    const data = storageService.load<{ habits: Habit[]; lastModified: string }>(
      STORAGE_KEYS.HABITS
    );

    if (!data) {
      const initialData = { habits: [], lastModified: new Date().toISOString() };
      storageService.saveImmediate(STORAGE_KEYS.HABITS, initialData);
      set({ habits: [], isLoading: false });
    } else {
      set({ habits: data.habits, isLoading: false });
    }
  },

  /**
   * Add new habit
   */
  addHabit: (name: string, color: string) => {
    const { habits } = get();

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date().toISOString(),
      completedDates: [],
    };

    const updatedHabits = [...habits, newHabit];
    const data = {
      habits: updatedHabits,
      lastModified: new Date().toISOString(),
    };

    storageService.saveImmediate(STORAGE_KEYS.HABITS, data);
    set({ habits: updatedHabits });
  },

  /**
   * Delete habit
   */
  deleteHabit: (id: string) => {
    const { habits } = get();
    const updatedHabits = habits.filter((h) => h.id !== id);

    const data = {
      habits: updatedHabits,
      lastModified: new Date().toISOString(),
    };

    storageService.saveImmediate(STORAGE_KEYS.HABITS, data);
    set({ habits: updatedHabits });
  },

  /**
   * Update habit properties
   */
  updateHabit: (id: string, updates: Partial<Habit>) => {
    const { habits } = get();
    const updatedHabits = habits.map((h) =>
      h.id === id ? { ...h, ...updates } : h
    );

    const data = {
      habits: updatedHabits,
      lastModified: new Date().toISOString(),
    };

    storageService.saveImmediate(STORAGE_KEYS.HABITS, data);
    set({ habits: updatedHabits });
  },

  /**
   * Toggle habit completion for a specific date
   */
  toggleHabitDate: (habitId: string, date: string) => {
    const { habits } = get();
    const habit = habits.find((h) => h.id === habitId);

    if (!habit) return;

    const isCompleted = habit.completedDates.includes(date);
    const updatedCompletedDates = isCompleted
      ? habit.completedDates.filter((d) => d !== date)
      : [...habit.completedDates, date];

    const updatedHabits = habits.map((h) =>
      h.id === habitId
        ? { ...h, completedDates: updatedCompletedDates }
        : h
    );

    const data = {
      habits: updatedHabits,
      lastModified: new Date().toISOString(),
    };

    storageService.saveImmediate(STORAGE_KEYS.HABITS, data);
    set({ habits: updatedHabits });
  },

  /**
   * Check if habit is completed on specific date
   */
  isHabitCompletedOnDate: (habitId: string, date: string): boolean => {
    const { habits } = get();
    const habit = habits.find((h) => h.id === habitId);
    return habit ? habit.completedDates.includes(date) : false;
  },
}));
