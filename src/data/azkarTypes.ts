/**
 * Azkar Type Definitions
 */
export interface Azkar {
  id: string;
  text: string;
  transliteration: string;
  translation: string;
  repetition: number;
  source: string;
  effect: string;
}

export type AzkarType = 'morning' | 'evening';

export interface AzkarProgress {
  date: string; // ISO date (YYYY-MM-DD)
  currentIndex: number; // Current azkar index
  completedRepetitions: number; // Repetitions done for current azkar
  completedAzkarIds: string[]; // IDs of fully completed azkar
  isComplete: boolean; // All azkar completed for this session
}

export interface AzkarData {
  morning: AzkarProgress | null;
  evening: AzkarProgress | null;
  lastModified: string;
}
