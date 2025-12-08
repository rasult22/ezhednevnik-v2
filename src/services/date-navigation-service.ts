import { DailyPage, DateAccessResult } from '../types';
import {
  getCurrentDateISO,
  isFuture,
  isPast,
  addDays,
} from '../utils/date-formatters';

/**
 * Date Navigation Service - Handles all date-related business logic
 */
class DateNavigationService {
  /**
   * Gets current date in ISO format
   */
  getCurrentDate(): string {
    return getCurrentDateISO();
  }

  /**
   * Checks if user can access a specific date
   * Returns access permission and reason if denied
   */
  canAccessDate(
    targetDate: string,
    dailyPages: Record<string, DailyPage>
  ): DateAccessResult {
    // Block future dates completely
    if (isFuture(targetDate)) {
      return { allowed: false, reason: 'future' };
    }

    // Allow past dates (will be read-only in UI)
    if (isPast(targetDate)) {
      return { allowed: true, reason: 'past_readonly' };
    }

    // For current date, check for skipped days
    const skippedDates = this.getSkippedDates(dailyPages);
    if (skippedDates.length > 0) {
      return { allowed: false, reason: 'skipped_days', skippedDates };
    }

    return { allowed: true };
  }

  /**
   * Gets all skipped dates between last completed date and today
   */
  getSkippedDates(dailyPages: Record<string, DailyPage>): string[] {
    const lastCompletedDate = this.getLastCompletedDate(dailyPages);
    if (!lastCompletedDate) {
      return []; // No previous entries, no skipped dates
    }

    const skipped: string[] = [];
    const today = this.getCurrentDate();

    // Start from day after last completed
    let currentDate = addDays(lastCompletedDate, 1);

    // Check each date until today (exclusive)
    while (currentDate < today) {
      const page = dailyPages[currentDate];
      if (!page || page.status === 'pending') {
        skipped.push(currentDate);
      }
      currentDate = addDays(currentDate, 1);
    }

    return skipped;
  }

  /**
   * Gets the most recent completed or skipped date
   */
  private getLastCompletedDate(
    dailyPages: Record<string, DailyPage>
  ): string | null {
    const completedDates = Object.entries(dailyPages)
      .filter(
        ([, page]) =>
          page.status === 'completed' || page.status === 'skipped'
      )
      .map(([date]) => date)
      .sort()
      .reverse();

    return completedDates[0] || null;
  }

  /**
   * Checks if date is read-only (past date)
   */
  isReadOnly(date: string): boolean {
    return isPast(date);
  }

  /**
   * Gets previous day's date (or null if no previous entries)
   */
  getPreviousDate(
    currentDate: string,
    dailyPages: Record<string, DailyPage>
  ): string | null {
    const dates = Object.keys(dailyPages).sort().reverse();
    const currentIndex = dates.indexOf(currentDate);

    if (currentIndex === -1 || currentIndex === dates.length - 1) {
      return null; // No previous date
    }

    return dates[currentIndex + 1] || null;
  }

  /**
   * Gets next day's date (or null if at current date)
   */
  getNextDate(currentDate: string): string | null {
    const today = this.getCurrentDate();

    if (currentDate >= today) {
      return null; // Can't go to future
    }

    return addDays(currentDate, 1);
  }

  /**
   * Gets the last 7 completed daily pages (for weekly review)
   */
  getRecentCompletedDates(
    dailyPages: Record<string, DailyPage>,
    count = 7
  ): string[] {
    return Object.entries(dailyPages)
      .filter(([, page]) => page.status === 'completed')
      .map(([date]) => date)
      .sort()
      .reverse()
      .slice(0, count);
  }

  /**
   * Checks if there are enough completed pages for weekly review
   */
  canCreateWeeklyReview(dailyPages: Record<string, DailyPage>): {
    allowed: boolean;
    completedCount: number;
    lastCompletedDates: string[];
  } {
    const recentCompleted = this.getRecentCompletedDates(dailyPages, 7);

    return {
      allowed: recentCompleted.length >= 7,
      completedCount: recentCompleted.length,
      lastCompletedDates: recentCompleted,
    };
  }
}

// Singleton instance
export const dateNavigationService = new DateNavigationService();
