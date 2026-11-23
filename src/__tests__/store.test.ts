import { useAppStore } from '../store/useAppStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('useAppStore Persistence & Comparison State', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppStore.setState({
      savedPaletteIds: [],
      comparisonPaletteIds: [],
      preferences: {
        selectedRoom: 'living_room',
        selectedStyle: 'modern',
        selectedTone: 'warm',
        roomSize: 'any',
        roomLighting: 'any',
        roomMood: 'balanced',
        budgetTier: 'standard',
      },
      selectedPhoto: null,
    });
  });

  test('toggles saving and removing favourite palettes', async () => {
    const store = useAppStore.getState();

    // 1. Save palette
    const added = await store.toggleSavePalette('nordic_warm_sanctuary');
    expect(added).toBe(true);
    expect(useAppStore.getState().savedPaletteIds).toContain('nordic_warm_sanctuary');
    expect(useAppStore.getState().isPaletteSaved('nordic_warm_sanctuary')).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@colorcraft_saved_palettes_v1',
      JSON.stringify(['nordic_warm_sanctuary'])
    );

    // 2. Remove palette
    const removed = await store.toggleSavePalette('nordic_warm_sanctuary');
    expect(removed).toBe(false);
    expect(useAppStore.getState().savedPaletteIds).not.toContain('nordic_warm_sanctuary');
    expect(useAppStore.getState().isPaletteSaved('nordic_warm_sanctuary')).toBe(false);
  });

  test('handles comparison queue with a maximum of 3 palettes', () => {
    const store = useAppStore.getState();

    expect(store.toggleComparisonPalette('pal_1')).toBe(true);
    expect(store.toggleComparisonPalette('pal_2')).toBe(true);
    expect(store.toggleComparisonPalette('pal_3')).toBe(true);

    // 4th palette rejected due to mobile viewport comparison limit
    expect(store.toggleComparisonPalette('pal_4')).toBe(false);
    expect(useAppStore.getState().comparisonPaletteIds).toEqual(['pal_1', 'pal_2', 'pal_3']);

    // Toggling existing removes it
    expect(store.toggleComparisonPalette('pal_2')).toBe(false);
    expect(useAppStore.getState().comparisonPaletteIds).toEqual(['pal_1', 'pal_3']);

    // Clear comparison
    store.clearComparison();
    expect(useAppStore.getState().comparisonPaletteIds).toEqual([]);
  });

  test('updates user preferences correctly', () => {
    const store = useAppStore.getState();
    store.setPreferences({
      selectedRoom: 'kitchen',
      roomLighting: 'low_light',
    });

    const current = useAppStore.getState().preferences;
    expect(current.selectedRoom).toBe('kitchen');
    expect(current.roomLighting).toBe('low_light');
    expect(current.selectedStyle).toBe('modern'); // Preserves other values
  });
});
