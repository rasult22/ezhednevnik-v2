import { create } from 'zustand';
import type { Idea, CreateIdeaPayload, UpdateIdeaPayload } from '../types/idea';
import { chromeStorage } from '../services/chrome-storage-adapter';
import { STORAGE_KEYS } from '../types';

interface IdeasState {
  ideas: Idea[];
  isLoading: boolean;
  error: string | null;

  // CRUD operations
  createIdea: (payload: CreateIdeaPayload) => Idea;
  updateIdea: (id: string, payload: UpdateIdeaPayload) => void;
  deleteIdea: (id: string) => void;
  getIdea: (id: string) => Idea | undefined;
  
  // Search
  searchIdeas: (query: string) => Idea[];
  
  // Persistence
  loadIdeas: () => Promise<void>;
  saveIdeas: () => Promise<void>;
}

/**
 * Ideas Store - Manages ideas with chrome.storage persistence
 * Uses chrome.storage.local for storage capacity
 */
export const useIdeasStore = create<IdeasState>((set, get) => ({
  ideas: [],
  isLoading: false,
  error: null,

  createIdea: (payload: CreateIdeaPayload) => {
    const now = new Date().toISOString();
    const newIdea: Idea = {
      id: crypto.randomUUID(),
      title: payload.title || 'Untitled Idea',
      content: payload.content,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      ideas: [newIdea, ...state.ideas], // Add to beginning for newest first
    }));

    // Auto-save to chrome.storage
    get().saveIdeas();

    return newIdea;
  },

  updateIdea: (id: string, payload: UpdateIdeaPayload) => {
    set((state) => ({
      ideas: state.ideas.map((idea) => {
        if (idea.id !== id) return idea;

        return {
          ...idea,
          title: payload.title ?? idea.title,
          content: payload.content ?? idea.content,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));

    // Auto-save to chrome.storage
    get().saveIdeas();
  },

  deleteIdea: (id: string) => {
    set((state) => ({
      ideas: state.ideas.filter((idea) => idea.id !== id),
    }));

    // Auto-save to chrome.storage
    get().saveIdeas();
  },

  getIdea: (id: string) => {
    return get().ideas.find((idea) => idea.id === id);
  },

  searchIdeas: (query: string) => {
    const { ideas } = get();
    if (!query.trim()) return ideas;

    const lowerQuery = query.toLowerCase();
    return ideas.filter((idea) => {
      // Search in title
      if (idea.title.toLowerCase().includes(lowerQuery)) return true;

      // Search in content blocks
      if (idea.content.blocks) {
        return idea.content.blocks.some((block: any) => {
          if (block.data?.text) {
            return block.data.text.toLowerCase().includes(lowerQuery);
          }
          return false;
        });
      }

      return false;
    });
  },

  loadIdeas: async () => {
    try {
      set({ isLoading: true, error: null });

      const stored = await chromeStorage.getItem(STORAGE_KEYS.IDEAS);
      if (stored) {
        const ideas = JSON.parse(stored) as Idea[];
        set({ ideas, isLoading: false });
      } else {
        set({ ideas: [], isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load ideas:', error);
      set({
        error: 'Failed to load ideas from storage',
        isLoading: false,
      });
    }
  },

  saveIdeas: async () => {
    try {
      const { ideas } = get();
      await chromeStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
    } catch (error) {
      console.error('Failed to save ideas:', error);
      set({ error: 'Failed to save ideas to storage' });
    }
  },
}));
