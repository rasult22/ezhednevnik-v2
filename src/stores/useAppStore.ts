import { create } from 'zustand';
import { UserProfile, AppSettings, STORAGE_KEYS } from '../types';
import { storageService } from '../services/storage-service';

interface AppState {
  userProfile: UserProfile | null;
  settings: AppSettings;
  isOnboarded: boolean;
  isLoading: boolean;

  // Actions
  initializeApp: () => void;
  completeOnboarding: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetApp: () => void;
}

/**
 * App Store - Manages user profile, onboarding status, and app settings
 */
export const useAppStore = create<AppState>((set, get) => ({
  userProfile: null,
  settings: {
    autoSaveInterval: 300, // 300ms default
    backgroundImage: '/bg-images/background.jpg', // default background
  },
  isOnboarded: false,
  isLoading: true,

  /**
   * Initialize app by loading data from LocalStorage
   */
  initializeApp: () => {
    const profile = storageService.load<UserProfile>(STORAGE_KEYS.USER_PROFILE);
    const settings = storageService.load<AppSettings>(STORAGE_KEYS.SETTINGS);

    if (!profile) {
      // First time user - create new profile
      const newProfile: UserProfile = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        onboardingCompleted: false,
        currentLanguage: 'ru',
      };

      storageService.saveImmediate(STORAGE_KEYS.USER_PROFILE, newProfile);

      set({
        userProfile: newProfile,
        isOnboarded: false,
        isLoading: false,
      });
    } else {
      set({
        userProfile: profile,
        settings: settings || get().settings,
        isOnboarded: profile.onboardingCompleted,
        isLoading: false,
      });
    }
  },

  /**
   * Mark onboarding as completed
   */
  completeOnboarding: () => {
    const { userProfile } = get();
    if (!userProfile) return;

    const updatedProfile: UserProfile = {
      ...userProfile,
      onboardingCompleted: true,
    };

    storageService.saveImmediate(STORAGE_KEYS.USER_PROFILE, updatedProfile);

    set({
      userProfile: updatedProfile,
      isOnboarded: true,
    });
  },

  /**
   * Update app settings
   */
  updateSettings: (newSettings: Partial<AppSettings>) => {
    const { settings } = get();
    const updatedSettings: AppSettings = {
      ...settings,
      ...newSettings,
    };

    storageService.saveImmediate(STORAGE_KEYS.SETTINGS, updatedSettings);

    set({ settings: updatedSettings });
  },

  /**
   * Reset entire app (dangerous operation)
   */
  resetApp: () => {
    storageService.clear();

    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
      currentLanguage: 'ru',
    };

    storageService.saveImmediate(STORAGE_KEYS.USER_PROFILE, newProfile);

    set({
      userProfile: newProfile,
      settings: {
        autoSaveInterval: 300,
        backgroundImage: '/bg-images/background.jpg',
      },
      isOnboarded: false,
    });
  },
}));
