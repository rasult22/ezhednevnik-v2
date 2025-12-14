import { create } from 'zustand';
import type { Sketch, CreateSketchPayload, UpdateSketchPayload } from '../types/sketch';
import { chromeStorage } from '../services/chrome-storage-adapter';

interface SketchesState {
  sketches: Sketch[];
  isLoading: boolean;
  error: string | null;

  // CRUD operations
  createSketch: (payload: CreateSketchPayload) => Sketch;
  updateSketch: (id: string, payload: UpdateSketchPayload) => void;
  deleteSketch: (id: string) => void;
  getSketch: (id: string) => Sketch | undefined;
  
  // Persistence
  loadSketches: () => Promise<void>;
  saveSketches: () => Promise<void>;
}

const STORAGE_KEY = 'sketches-storage';

/**
 * Sketches Store - Manages Excalidraw sketches with chrome.storage persistence
 * Uses chrome.storage.local for unlimited storage capacity (handles images)
 */
export const useSketchesStore = create<SketchesState>((set, get) => ({
  sketches: [],
  isLoading: false,
  error: null,

  createSketch: (payload: CreateSketchPayload) => {
    const now = new Date().toISOString();
    const newSketch: Sketch = {
      id: crypto.randomUUID(),
      title: payload.title || 'Untitled Sketch',
      createdAt: now,
      updatedAt: now,
      excalidrawData: {
        elements: payload.elements,
        appState: payload.appState,
        files: payload.files,
      },
    };

    set((state) => ({
      sketches: [...state.sketches, newSketch],
    }));

    // Auto-save to chrome.storage
    get().saveSketches();

    return newSketch;
  },

  updateSketch: (id: string, payload: UpdateSketchPayload) => {
    set((state) => ({
      sketches: state.sketches.map((sketch) => {
        if (sketch.id !== id) return sketch;

        return {
          ...sketch,
          title: payload.title ?? sketch.title,
          updatedAt: new Date().toISOString(),
          excalidrawData: {
            elements: payload.elements ?? sketch.excalidrawData.elements,
            appState: payload.appState ?? sketch.excalidrawData.appState,
            files: payload.files ?? sketch.excalidrawData.files,
          },
        };
      }),
    }));

    // Auto-save to chrome.storage
    get().saveSketches();
  },

  deleteSketch: (id: string) => {
    set((state) => ({
      sketches: state.sketches.filter((sketch) => sketch.id !== id),
    }));

    // Auto-save to chrome.storage
    get().saveSketches();
  },

  getSketch: (id: string) => {
    return get().sketches.find((sketch) => sketch.id === id);
  },

  loadSketches: async () => {
    try {
      set({ isLoading: true, error: null });

      const stored = await chromeStorage.getItem(STORAGE_KEY);
      if (stored) {
        const sketches = JSON.parse(stored) as Sketch[];
        
        // Fix: Restore Map for collaborators (gets serialized to object in JSON)
        const fixedSketches = sketches.map((sketch) => ({
          ...sketch,
          excalidrawData: {
            ...sketch.excalidrawData,
            appState: {
              ...sketch.excalidrawData.appState,
              collaborators: new Map(), // Always use empty Map after deserialization
            },
          },
        }));
        
        set({ sketches: fixedSketches, isLoading: false });
      } else {
        set({ sketches: [], isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load sketches:', error);
      set({
        error: 'Failed to load sketches from storage',
        isLoading: false,
      });
    }
  },

  saveSketches: async () => {
    try {
      const { sketches } = get();
      await chromeStorage.setItem(STORAGE_KEY, JSON.stringify(sketches));
    } catch (error) {
      console.error('Failed to save sketches:', error);
      set({ error: 'Failed to save sketches to storage' });
    }
  },
}));
