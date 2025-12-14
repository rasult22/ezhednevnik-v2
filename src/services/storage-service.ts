/**
 * Storage Service - Handles all Chrome Storage operations with error handling
 * Migrated from localStorage to chrome.storage.local for unlimited storage
 */

import { chromeStorage } from './chrome-storage-adapter';

class StorageService {
  private saveQueue: Map<string, unknown> = new Map();
  private saveTimeout: number | null = null;
  private readonly QUOTA_WARNING_THRESHOLD = 0.7; // Warn at 70% usage

  /**
   * Saves data immediately to Chrome Storage
   */
  async saveImmediate<T>(key: string, data: T): Promise<boolean> {
    try {
      const serialized = JSON.stringify(data);
      await chromeStorage.setItem(key, serialized);
      this.checkQuota();
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        this.handleQuotaExceeded();
        return false;
      }
      console.error(`Error saving to chrome.storage (key: ${key}):`, error);
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
   * Flushes all pending saves to Chrome Storage
   */
  private async flush(): Promise<void> {
    const promises: Promise<boolean>[] = [];
    this.saveQueue.forEach((data, key) => {
      promises.push(this.saveImmediate(key, data));
    });
    await Promise.all(promises);
    this.saveQueue.clear();
  }

  /**
   * Loads data from Chrome Storage with type safety
   */
  async load<T>(key: string): Promise<T | null> {
    try {
      const item = await chromeStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error loading from chrome.storage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Removes an item from storage
   */
  async remove(key: string): Promise<void> {
    try {
      await chromeStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from storage (key: ${key}):`, error);
    }
  }

  /**
   * Clears all data from storage
   */
  async clear(): Promise<void> {
    try {
      await chromeStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  /**
   * Checks if a key exists in storage
   */
  async has(key: string): Promise<boolean> {
    const item = await chromeStorage.getItem(key);
    return item !== null;
  }

  /**
   * Gets the current storage usage as a percentage
   */
  async getUsagePercentage(): Promise<number> {
    try {
      const bytesInUse = await chromeStorage.getBytesInUse();
      // Chrome extension storage limit is much higher (unlimited with permission)
      // For localStorage, typical limit is 5-10MB
      const ESTIMATED_LIMIT = 5 * 1024 * 1024; // 5MB in bytes
      return bytesInUse / ESTIMATED_LIMIT;
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return 0;
    }
  }

  /**
   * Checks storage quota and warns if approaching limit
   */
  private async checkQuota(): Promise<void> {
    const usage = await this.getUsagePercentage();
    if (usage >= this.QUOTA_WARNING_THRESHOLD) {
      console.warn(
        `Storage usage at ${(usage * 100).toFixed(1)}%. Consider exporting data.`
      );

      // Dispatch custom event for UI to show warning
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('storage-quota-warning', { detail: { usage } })
        );
      }
    }
  }

  /**
   * Handles quota exceeded error
   */
  private handleQuotaExceeded(): void {
    console.error('Storage quota exceeded!');

    // Dispatch custom event for UI to show error
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('storage-quota-exceeded', {
          detail: { message: 'Превышен лимит хранилища. Экспортируйте данные.' },
        })
      );
    }
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
