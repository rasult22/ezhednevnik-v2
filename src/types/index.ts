// ============================================================================
// Type Definitions for Ежедневник Триллионера
// ============================================================================

/**
 * User Profile and Onboarding
 */
export interface UserProfile {
  id: string;
  createdAt: string; // ISO timestamp
  onboardingCompleted: boolean;
  currentLanguage: 'ru';
}

/**
 * Goals Structure (10 years, 5 years, 1 year)
 */
export interface Goal {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goals {
  tenYear: Goal[];
  fiveYear: Goal[];
  oneYear: Goal[];
  lastModified: string; // ISO timestamp
}

/**
 * 90-Day Plan
 */
export interface Project {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  transferredFrom?: string; // Previous plan ID if transferred
  createdAt: string;
  updatedAt: string;
}

export type PlanStatus = 'active' | 'completed' | 'archived';

export interface NinetyDayPlan {
  id: string;
  startDate: string; // ISO date (YYYY-MM-DD)
  endDate: string;
  projects: Project[]; // Max 6-8
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Daily Page (Core of the application)
 */
export interface Task {
  id: string;
  content: string;
  completed: boolean;
  completedAt?: string; // ISO timestamp
}

export type DailyPageStatus = 'pending' | 'completed' | 'skipped';

export interface DailyPage {
  date: string; // ISO date (YYYY-MM-DD) - serves as unique key
  status: DailyPageStatus;

  // Monthly focus (same for all days in month)
  mainForMonth: [string, string, string]; // Exactly 3 projects
  mainForMonthLockedAt?: string; // Timestamp when locked for the month

  // Daily tasks
  mainThree: [Task, Task, Task]; // Exactly 3 tasks
  secondaryNine: Task[]; // Exactly 9 tasks

  // Spiritual/mindset blocks
  gratitude: [string, string, string]; // Exactly 3
  financialAffirmation: string;
  financialAffirmationConfirmed: boolean;

  createdAt: string;
  completedAt?: string; // When all 3 main tasks completed
}

/**
 * Weekly Review
 */
export interface WeeklyReview {
  id: string;
  startDate: string; // Monday of the week (ISO date)
  endDate: string; // Sunday of the week (ISO date)
  content: string; // Large text area
  dailyPagesIncluded: string[]; // Array of ISO dates
  createdAt: string;
  updatedAt: string;
}

/**
 * Application Settings
 */
export interface AppSettings {
  theme?: 'light' | 'dark'; // Future-proof
  autoSaveInterval: number; // Milliseconds (default: 300)
  lastSyncedAt?: string;
}

/**
 * LocalStorage Keys
 */
export const STORAGE_KEYS = {
  USER_PROFILE: 'trillionaire_user_profile',
  GOALS: 'trillionaire_goals',
  PLANS_90DAY: 'trillionaire_90day_plans',
  DAILY_PAGES: 'trillionaire_daily_pages',
  WEEKLY_REVIEWS: 'trillionaire_weekly_reviews',
  SETTINGS: 'trillionaire_settings',
} as const;

/**
 * Date Access Rules
 */
export interface DateAccessResult {
  allowed: boolean;
  reason?: 'future' | 'past_readonly' | 'skipped_days';
  skippedDates?: string[];
}
