import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColourPalette, UserPreferences } from '../engine/types';

const SAVED_PALETTES_STORAGE_KEY = '@colorcraft_saved_palettes_v1';
const RECENT_PALETTES_STORAGE_KEY = '@colorcraft_recent_palettes_v1';

export interface RoomPhotoData {
  uri: string;
  roomType: string;
  source: 'camera' | 'gallery';
  timestamp: number;
}

interface AppState {
  // Current Recommendation Preferences
  preferences: UserPreferences;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  resetPreferences: () => void;

  // Selected Photo State
  selectedPhoto: RoomPhotoData | null;
  setSelectedPhoto: (photo: RoomPhotoData | null) => void;

  // Saved / Favourite Palettes
  savedPaletteIds: string[];
  isHydrated: boolean;
  loadSavedPalettes: () => Promise<void>;
  toggleSavePalette: (paletteId: string) => Promise<boolean>;
  isPaletteSaved: (paletteId: string) => boolean;

  // Comparison State (Max 3 palettes)
  comparisonPaletteIds: string[];
  toggleComparisonPalette: (paletteId: string) => boolean;
  clearComparison: () => void;
  isPaletteInComparison: (paletteId: string) => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  preferences: {
    selectedRoom: 'living_room',
    selectedStyle: 'modern',
    selectedTone: 'warm',
    roomSize: 'any',
    roomLighting: 'any',
    roomMood: 'balanced',
    budgetTier: 'standard',
  },

  setPreferences: (newPrefs) => {
    set((state) => ({
      preferences: {
        ...state.preferences,
        ...newPrefs,
      },
    }));
  },

  resetPreferences: () => {
    set({
      preferences: {
        selectedRoom: 'living_room',
        selectedStyle: 'modern',
        selectedTone: 'warm',
        roomSize: 'any',
        roomLighting: 'any',
        roomMood: 'balanced',
        budgetTier: 'standard',
      },
    });
  },

  selectedPhoto: null,
  setSelectedPhoto: (photo) => set({ selectedPhoto: photo }),

  savedPaletteIds: [],
  isHydrated: false,

  loadSavedPalettes: async () => {
    try {
      const stored = await AsyncStorage.getItem(SAVED_PALETTES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          set({ savedPaletteIds: parsed, isHydrated: true });
          return;
        }
      }
      set({ savedPaletteIds: [], isHydrated: true });
    } catch (e) {
      console.warn('Failed to load saved palettes from AsyncStorage:', e);
      set({ savedPaletteIds: [], isHydrated: true });
    }
  },

  toggleSavePalette: async (paletteId: string) => {
    const { savedPaletteIds } = get();
    const exists = savedPaletteIds.includes(paletteId);
    let nextIds: string[];

    if (exists) {
      nextIds = savedPaletteIds.filter((id) => id !== paletteId);
    } else {
      nextIds = [paletteId, ...savedPaletteIds];
    }

    set({ savedPaletteIds: nextIds });
    try {
      await AsyncStorage.setItem(SAVED_PALETTES_STORAGE_KEY, JSON.stringify(nextIds));
    } catch (e) {
      console.warn('Failed to persist saved palettes:', e);
    }
    return !exists;
  },

  isPaletteSaved: (paletteId: string) => {
    return get().savedPaletteIds.includes(paletteId);
  },

  comparisonPaletteIds: [],

  toggleComparisonPalette: (paletteId: string) => {
    const { comparisonPaletteIds } = get();
    if (comparisonPaletteIds.includes(paletteId)) {
      set({
        comparisonPaletteIds: comparisonPaletteIds.filter((id) => id !== paletteId),
      });
      return false;
    }
    if (comparisonPaletteIds.length >= 3) {
      // Max 3 palettes for side-by-side comparison on mobile screens
      return false;
    }
    set({ comparisonPaletteIds: [...comparisonPaletteIds, paletteId] });
    return true;
  },

  clearComparison: () => set({ comparisonPaletteIds: [] }),

  isPaletteInComparison: (paletteId: string) => {
    return get().comparisonPaletteIds.includes(paletteId);
  },
}));
