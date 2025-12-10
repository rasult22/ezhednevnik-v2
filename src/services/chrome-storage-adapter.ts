/**
 * Chrome Storage Adapter - Provides unified interface for localStorage and chrome.storage.local
 * Automatically uses chrome.storage.local in extension context, localStorage otherwise
 */

// Declare chrome global for TypeScript
declare const chrome: typeof globalThis.chrome | undefined;

// Type guard to check if we're in a Chrome extension context
const isChromeExtension = (): boolean => {
  return typeof chrome !== 'undefined' && 
         chrome.storage && 
         chrome.storage.local !== undefined;
};

/**
 * Unified storage interface that works in both web and extension contexts
 */
export class ChromeStorageAdapter {
  /**
   * Get item from storage (async)
   */
  async getItem(key: string): Promise<string | null> {
    if (isChromeExtension()) {
      return new Promise((resolve) => {
        chrome!.storage.local.get([key], (result: { [key: string]: string }) => {
          resolve(result[key] || null);
        });
      });
    } else {
      return Promise.resolve(localStorage.getItem(key));
    }
  }

  /**
   * Set item in storage (async)
   */
  async setItem(key: string, value: string): Promise<void> {
    if (isChromeExtension()) {
      return new Promise((resolve, reject) => {
        chrome!.storage.local.set({ [key]: value }, () => {
          if (chrome!.runtime.lastError) {
            reject(chrome!.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } else {
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
  }

  /**
   * Remove item from storage (async)
   */
  async removeItem(key: string): Promise<void> {
    if (isChromeExtension()) {
      return new Promise((resolve) => {
        chrome!.storage.local.remove([key], () => {
          resolve();
        });
      });
    } else {
      localStorage.removeItem(key);
      return Promise.resolve();
    }
  }

  /**
   * Clear all storage (async)
   */
  async clear(): Promise<void> {
    if (isChromeExtension()) {
      return new Promise((resolve) => {
        chrome!.storage.local.clear(() => {
          resolve();
        });
      });
    } else {
      localStorage.clear();
      return Promise.resolve();
    }
  }

  /**
   * Get all keys from storage (async)
   */
  async getAllKeys(): Promise<string[]> {
    if (isChromeExtension()) {
      return new Promise((resolve) => {
        chrome!.storage.local.get(null, (items: { [key: string]: unknown }) => {
          resolve(Object.keys(items));
        });
      });
    } else {
      return Promise.resolve(Object.keys(localStorage));
    }
  }

  /**
   * Get storage usage info (async)
   */
  async getBytesInUse(): Promise<number> {
    if (isChromeExtension()) {
      return new Promise((resolve) => {
        // Call without parameters to get total bytes in use
        chrome!.storage.local.getBytesInUse((bytes: number) => {
          resolve(bytes);
        });
      });
    } else {
      // Calculate localStorage size
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
      return Promise.resolve(totalSize);
    }
  }
}

// Singleton instance
export const chromeStorage = new ChromeStorageAdapter();
