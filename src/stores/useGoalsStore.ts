import { create } from 'zustand';
import { Goals, Goal, STORAGE_KEYS } from '../types';
import { storageService } from '../services/storage-service';

type GoalType = 'tenYear' | 'fiveYear' | 'oneYear';

interface GoalsState {
  goals: Goals;
  isLoading: boolean;

  // Actions
  loadGoals: () => Promise<void>;
  addGoal: (type: GoalType, content: string) => void;
  updateGoal: (type: GoalType, goalId: string, content: string) => void;
  deleteGoal: (type: GoalType, goalId: string) => void;
  updateGoals: (type: GoalType, goals: Goal[]) => void;
}

/**
 * Goals Store - Manages long-term goals (10 years, 5 years, 1 year)
 */
export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: {
    tenYear: [],
    fiveYear: [],
    oneYear: [],
    lastModified: new Date().toISOString(),
  },
  isLoading: true,

  /**
   * Load goals from Chrome Storage
   */
  loadGoals: async () => {
    const goals = await storageService.load<Goals>(STORAGE_KEYS.GOALS);

    if (!goals) {
      // Initialize empty goals
      const emptyGoals: Goals = {
        tenYear: [],
        fiveYear: [],
        oneYear: [],
        lastModified: new Date().toISOString(),
      };

      await storageService.saveImmediate(STORAGE_KEYS.GOALS, emptyGoals);

      set({ goals: emptyGoals, isLoading: false });
    } else {
      set({ goals, isLoading: false });
    }
  },

  /**
   * Add a new goal
   */
  addGoal: (type: GoalType, content: string) => {
    const { goals } = get();

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedGoals: Goals = {
      ...goals,
      [type]: [...goals[type], newGoal],
      lastModified: new Date().toISOString(),
    };

    storageService.saveDebounced(STORAGE_KEYS.GOALS, updatedGoals);
    set({ goals: updatedGoals });
  },

  /**
   * Update an existing goal
   */
  updateGoal: (type: GoalType, goalId: string, content: string) => {
    const { goals } = get();

    const updatedGoals: Goals = {
      ...goals,
      [type]: goals[type].map((goal) =>
        goal.id === goalId
          ? { ...goal, content, updatedAt: new Date().toISOString() }
          : goal
      ),
      lastModified: new Date().toISOString(),
    };

    storageService.saveDebounced(STORAGE_KEYS.GOALS, updatedGoals);
    set({ goals: updatedGoals });
  },

  /**
   * Delete a goal
   */
  deleteGoal: (type: GoalType, goalId: string) => {
    const { goals } = get();

    const updatedGoals: Goals = {
      ...goals,
      [type]: goals[type].filter((goal) => goal.id !== goalId),
      lastModified: new Date().toISOString(),
    };

    storageService.saveImmediate(STORAGE_KEYS.GOALS, updatedGoals);
    set({ goals: updatedGoals });
  },

  /**
   * Replace all goals of a specific type (used during onboarding)
   */
  updateGoals: (type: GoalType, goals: Goal[]) => {
    const currentGoals = get().goals;

    const updatedGoals: Goals = {
      ...currentGoals,
      [type]: goals,
      lastModified: new Date().toISOString(),
    };

    storageService.saveDebounced(STORAGE_KEYS.GOALS, updatedGoals);
    set({ goals: updatedGoals });
  },
}));
