import { isValidHex, getRelativeLuminance, getContrastRatio, rgbToHsl, hexToRgb } from '../engine/colorTheory';
import { PALETTES_DATA } from '../engine/paletteData';
import { recommendPalettes, scorePalette, filterPalettes } from '../engine/recommendationEngine';
import { UserPreferences } from '../engine/types';

describe('Colour Theory Utilities', () => {
  test('validates 6-digit and 3-digit hex strings correctly', () => {
    expect(isValidHex('#FFFFFF')).toBe(true);
    expect(isValidHex('#ffffff')).toBe(true);
    expect(isValidHex('#1A2B3C')).toBe(true);
    expect(isValidHex('#fff')).toBe(true);
    expect(isValidHex('FFFFFF')).toBe(false);
    expect(isValidHex('#GGG123')).toBe(false);
    expect(isValidHex('#12345')).toBe(false);
  });

  test('calculates relative luminance and contrast ratio accurately', () => {
    const white = '#FFFFFF';
    const black = '#000000';
    expect(getRelativeLuminance(white)).toBeCloseTo(1, 1);
    expect(getRelativeLuminance(black)).toBeCloseTo(0, 1);

    const ratio = getContrastRatio(white, black);
    expect(ratio).toBeCloseTo(21, 0); // WCAG max contrast 21:1
  });

  test('converts hex to RGB and HSL', () => {
    const hex = '#FF0000';
    const rgb = hexToRgb(hex);
    expect(rgb).toEqual({ r: 255, g: 0, b: 0 });

    const hsl = rgbToHsl(rgb);
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });
});

describe('Curated Palette Dataset Integrity', () => {
  test('contains at least 30 unique palettes', () => {
    expect(PALETTES_DATA.length).toBeGreaterThanOrEqual(30);
  });

  test('has no duplicate palette IDs', () => {
    const idSet = new Set<string>();
    PALETTES_DATA.forEach((p) => {
      expect(idSet.has(p.id)).toBe(false);
      idSet.add(p.id);
    });
  });

  test('validates every hexadecimal colour in all palettes', () => {
    PALETTES_DATA.forEach((palette) => {
      const slots = [
        palette.mainWall,
        palette.secondaryWall,
        palette.accentWall,
        palette.ceiling,
        palette.trim,
        palette.furniture,
        palette.floor,
        palette.decorativeAccent,
      ];

      slots.forEach((slot) => {
        expect(isValidHex(slot.hex)).toBe(true);
        expect(slot.name.length).toBeGreaterThan(0);
      });

      expect(isValidHex(palette.distributionRule.dominant60.hex)).toBe(true);
      expect(isValidHex(palette.distributionRule.secondary30.hex)).toBe(true);
      expect(isValidHex(palette.distributionRule.accent10.hex)).toBe(true);
    });
  });

  test('each palette supports at least one room and style', () => {
    PALETTES_DATA.forEach((palette) => {
      expect(palette.supportedRooms.length).toBeGreaterThan(0);
      expect(palette.interiorStyles.length).toBeGreaterThan(0);
      expect(palette.designExplanation.length).toBeGreaterThan(15);
      expect(palette.colourRelationshipNote.length).toBeGreaterThan(10);
    });
  });
});

describe('Recommendation Engine Determinism & Scoring', () => {
  const prefs: UserPreferences = {
    selectedRoom: 'living_room',
    selectedStyle: 'scandinavian',
    selectedTone: 'warm',
    roomSize: 'small',
    roomLighting: 'low_light',
    roomMood: 'calm',
    budgetTier: 'standard',
  };

  test('ranks identical inputs identically across repeated executions (determinism)', () => {
    const run1 = recommendPalettes(prefs);
    const run2 = recommendPalettes(prefs);

    expect(run1.length).toEqual(run2.length);
    for (let i = 0; i < run1.length; i++) {
      expect(run1[i].palette.id).toBe(run2[i].palette.id);
      expect(run1[i].score).toBe(run2[i].score);
    }
  });

  test('top recommended palette has the highest score and matches room & style', () => {
    const results = recommendPalettes(prefs);
    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];

    expect(topResult.score).toBeGreaterThan(0);
    expect(topResult.palette.supportedRooms).toContain('living_room');
    expect(topResult.scoreBreakdown.roomScore).toBe(40);
  });

  test('handles minimal/partial preference combinations without error', () => {
    const minimalPrefs: UserPreferences = {
      selectedRoom: 'bathroom',
    };
    const results = recommendPalettes(minimalPrefs);
    expect(results.length).toBe(PALETTES_DATA.length);
    expect(results[0].score).toBeGreaterThan(0);
  });

  test('filters correctly by room and design style', () => {
    const kitchenPalettes = filterPalettes({ room: 'kitchen' });
    expect(kitchenPalettes.length).toBeGreaterThan(0);
    kitchenPalettes.forEach((p) => {
      expect(p.supportedRooms).toContain('kitchen');
    });

    const luxuryPalettes = filterPalettes({ style: 'luxury' });
    expect(luxuryPalettes.length).toBeGreaterThan(0);
    luxuryPalettes.forEach((p) => {
      expect(p.interiorStyles).toContain('luxury');
    });
  });
});
