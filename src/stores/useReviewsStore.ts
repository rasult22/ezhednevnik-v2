import { create } from 'zustand';
import { WeeklyReview, STORAGE_KEYS } from '../types';
import { storageService } from '../services/storage-service';
import { dateNavigationService } from '../services/date-navigation-service';
import { useDailyStore } from './useDailyStore';

interface ReviewsState {
  reviews: WeeklyReview[];
  isLoading: boolean;

  // Actions
  loadReviews: () => void;
  canCreateReview: () => {
    allowed: boolean;
    completedCount: number;
    lastCompletedDates: string[];
  };
  createReview: (content: string, startDate: string, endDate: string) => void;
  updateReview: (reviewId: string, content: string) => void;
  deleteReview: (reviewId: string) => void;
  getReview: (reviewId: string) => WeeklyReview | undefined;
}

/**
 * Reviews Store - Manages weekly reviews
 *
 * Weekly reviews unlock after 7 completed daily pages
 */
export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: [],
  isLoading: true,

  /**
   * Load reviews from LocalStorage
   */
  loadReviews: () => {
    const reviews = storageService.load<WeeklyReview[]>(
      STORAGE_KEYS.WEEKLY_REVIEWS
    );

    if (!reviews) {
      storageService.saveImmediate(STORAGE_KEYS.WEEKLY_REVIEWS, []);
      set({ reviews: [], isLoading: false });
    } else {
      // Sort by start date descending (newest first)
      const sorted = [...reviews].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      set({ reviews: sorted, isLoading: false });
    }
  },

  /**
   * Check if user can create a weekly review
   * Requires 7 completed daily pages
   */
  canCreateReview: () => {
    const dailyPages = useDailyStore.getState().dailyPages;
    return dateNavigationService.canCreateWeeklyReview(dailyPages);
  },

  /**
   * Create a new weekly review
   */
  createReview: (content: string, startDate: string, endDate: string) => {
    const { reviews } = get();
    const dailyPages = useDailyStore.getState().dailyPages;

    // Get dates included in this review
    const completedDates = dateNavigationService
      .getRecentCompletedDates(dailyPages, 7)
      .filter((date) => date >= startDate && date <= endDate);

    const newReview: WeeklyReview = {
      id: crypto.randomUUID(),
      startDate,
      endDate,
      content,
      dailyPagesIncluded: completedDates,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];

    storageService.saveImmediate(STORAGE_KEYS.WEEKLY_REVIEWS, updatedReviews);
    set({ reviews: updatedReviews });
  },

  /**
   * Update an existing review
   */
  updateReview: (reviewId: string, content: string) => {
    const { reviews } = get();

    const updatedReviews = reviews.map((review) =>
      review.id === reviewId
        ? { ...review, content, updatedAt: new Date().toISOString() }
        : review
    );

    storageService.saveDebounced(STORAGE_KEYS.WEEKLY_REVIEWS, updatedReviews);
    set({ reviews: updatedReviews });
  },

  /**
   * Delete a review
   */
  deleteReview: (reviewId: string) => {
    const { reviews } = get();
    const updatedReviews = reviews.filter((r) => r.id !== reviewId);

    storageService.saveImmediate(STORAGE_KEYS.WEEKLY_REVIEWS, updatedReviews);
    set({ reviews: updatedReviews });
  },

  /**
   * Get a specific review by ID
   */
  getReview: (reviewId: string) => {
    return get().reviews.find((r) => r.id === reviewId);
  },
}));
