/**
 * Storage Service - Handles all LocalStorage operations with error handling
 */

class StorageService {
  private saveQueue: Map<string, unknown> = new Map();
  private saveTimeout: number | null = null;
  private readonly QUOTA_WARNING_THRESHOLD = 0.7; // Warn at 70% usage

  /**
   * Saves data immediately to LocalStorage
   */
  saveImmediate<T>(key: string, data: T): boolean {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      this.checkQuota();
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded();
        return false;
      }
      console.error(`Error saving to localStorage (key: ${key}):`, error);
      return false;
    }
  }

  /**
   * Saves data with debounce (default 300ms)
   */
  saveDebounced<T>(key: string, data: T, delay = 300): void {
    this.saveQueue.set(key, data);

    if (this.saveTimeout) {
      window.clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = window.setTimeout(() => {
      this.flush();
    }, delay);
  }

  /**
   * Flushes all pending saves to LocalStorage
   */
  private flush(): void {
    this.saveQueue.forEach((data, key) => {
      this.saveImmediate(key, data);
    });
    this.saveQueue.clear();
  }

  /**
   * Loads data from LocalStorage with type safety
   */
  load<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error loading from localStorage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Removes an item from LocalStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  }

  /**
   * Clears all data from LocalStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Checks if a key exists in LocalStorage
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Gets the current storage usage as a percentage
   */
  getUsagePercentage(): number {
    try {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }

      // Typical LocalStorage limit is 5-10MB, we use 5MB as conservative estimate
      const ESTIMATED_LIMIT = 5 * 1024 * 1024; // 5MB in bytes
      return totalSize / ESTIMATED_LIMIT;
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return 0;
    }
  }

  /**
   * Checks storage quota and warns if approaching limit
   */
  private checkQuota(): void {
    const usage = this.getUsagePercentage();
    if (usage >= this.QUOTA_WARNING_THRESHOLD) {
      console.warn(
        `LocalStorage usage at ${(usage * 100).toFixed(1)}%. Consider exporting data.`
      );

      // Dispatch custom event for UI to show warning
      window.dispatchEvent(
        new CustomEvent('storage-quota-warning', { detail: { usage } })
      );
    }
  }

  /**
   * Handles quota exceeded error
   */
  private handleQuotaExceeded(): void {
    console.error('LocalStorage quota exceeded!');

    // Dispatch custom event for UI to show error
    window.dispatchEvent(
      new CustomEvent('storage-quota-exceeded', {
        detail: { message: 'Превышен лимит хранилища. Экспортируйте данные.' },
      })
    );
  }

  /**
   * Flushes any pending saves before page unload
   */
  flushOnUnload(): void {
    if (this.saveTimeout) {
      window.clearTimeout(this.saveTimeout);
    }
    this.flush();
  }
}

// Singleton instance
export const storageService = new StorageService();

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    storageService.flushOnUnload();
  });
}
