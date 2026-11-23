import {
  ColourPalette,
  ColourTone,
  DesignStyle,
  RankedPalette,
  RecommendationScoreBreakdown,
  RoomLighting,
  RoomMood,
  RoomSize,
  RoomType,
  UserPreferences,
} from './types';
import { PALETTES_DATA } from './paletteData';
import { isLightColour } from './colorTheory';

/**
 * Weights for the deterministic scoring function
 */
const WEIGHTS = {
  ROOM_MATCH: 40,
  STYLE_MATCH: 30,
  TONE_MATCH: 20,
  LIGHTING_MATCH: 10,
  SIZE_MATCH: 10,
  MOOD_MATCH: 10,
  BUDGET_MATCH: 5,
};

/**
 * Computes deterministic score for a single palette against user preferences.
 */
export function scorePalette(
  palette: ColourPalette,
  preferences: UserPreferences
): { scoreBreakdown: RecommendationScoreBreakdown; matchReasons: string[] } {
  let roomScore = 0;
  let styleScore = 0;
  let toneScore = 0;
  let sizeScore = 0;
  let lightingScore = 0;
  let moodScore = 0;
  let budgetScore = 0;
  const matchReasons: string[] = [];

  // 1. Room Compatibility (Primary requirement)
  if (preferences.selectedRoom) {
    if (palette.supportedRooms.includes(preferences.selectedRoom)) {
      roomScore = WEIGHTS.ROOM_MATCH;
      matchReasons.push(`Curated specifically for ${preferences.selectedRoom.replace('_', ' ')}s`);
    } else if (palette.supportedRooms.includes('full_house')) {
      roomScore = WEIGHTS.ROOM_MATCH * 0.75;
      matchReasons.push('Versatile whole-house design adaptable to this space');
    } else {
      roomScore = 0;
    }
  }

  // 2. Interior Design Style Match
  if (preferences.selectedStyle) {
    if (palette.interiorStyles.includes(preferences.selectedStyle)) {
      styleScore = WEIGHTS.STYLE_MATCH;
      matchReasons.push(`Tailored to ${preferences.selectedStyle.replace('_', ' ')} aesthetics`);
    }
  }

  // 3. Colour Tone / Preference Match
  if (preferences.selectedTone) {
    const tone = preferences.selectedTone;
    if (palette.toneFamily.includes(tone)) {
      toneScore = WEIGHTS.TONE_MATCH;
      matchReasons.push(`Matches your ${tone} colour preference`);
    } else if (
      (tone === 'warm' && palette.colourTemperature === 'warm') ||
      (tone === 'cool' && palette.colourTemperature === 'cool') ||
      (tone === 'neutral' && palette.colourTemperature === 'neutral')
    ) {
      toneScore = WEIGHTS.TONE_MATCH * 0.8;
      matchReasons.push(`Shares your desired ${tone} temperature`);
    } else if (tone === 'light' && isLightColour(palette.mainWall.hex)) {
      toneScore = WEIGHTS.TONE_MATCH * 0.7;
      matchReasons.push('Features high-luminance light wall planes');
    } else if (tone === 'dark' && !isLightColour(palette.accentWall.hex)) {
      toneScore = WEIGHTS.TONE_MATCH * 0.7;
      matchReasons.push('Incorporates rich dark grounding tones');
    }
  }

  // 4. Room Lighting Rules
  // - Low light rooms need high-LRV walls and warm undertones
  // - Bright rooms can handle darker saturation and cooler undertones
  if (preferences.roomLighting && preferences.roomLighting !== 'any') {
    if (palette.targetLighting.includes(preferences.roomLighting)) {
      lightingScore = WEIGHTS.LIGHTING_MATCH;
      if (preferences.roomLighting === 'low_light') {
        matchReasons.push('High light reflectance brightens low-light environments');
      } else {
        matchReasons.push('Optimized to absorb and balance strong natural daylight');
      }
    }
  }

  // 5. Room Size Rules
  // - Small rooms benefit from low contrast between walls and ceilings, and lighter palettes
  // - Large rooms benefit from grounding accents and zoning colours
  if (preferences.roomSize && preferences.roomSize !== 'any') {
    if (palette.targetRoomSizes.includes(preferences.roomSize)) {
      sizeScore = WEIGHTS.SIZE_MATCH;
      if (preferences.roomSize === 'small') {
        matchReasons.push('Visually expands compact room dimensions');
      } else {
        matchReasons.push('Creates depth and intimacy in spacious rooms');
      }
    }
  }

  // 6. Mood Filter
  if (preferences.roomMood && preferences.roomMood !== 'balanced') {
    if (palette.mood === preferences.roomMood) {
      moodScore = WEIGHTS.MOOD_MATCH;
      matchReasons.push(`Promotes a ${preferences.roomMood} interior atmosphere`);
    }
  }

  // 7. Budget Tier Filter
  if (preferences.budgetTier && preferences.budgetTier !== 'standard') {
    if (
      palette.targetBudgetTier === preferences.budgetTier ||
      palette.targetBudgetTier === 'standard'
    ) {
      budgetScore = WEIGHTS.BUDGET_MATCH;
    }
  }

  const totalScore =
    roomScore +
    styleScore +
    toneScore +
    sizeScore +
    lightingScore +
    moodScore +
    budgetScore;

  return {
    scoreBreakdown: {
      roomScore,
      styleScore,
      toneScore,
      sizeScore,
      lightingScore,
      moodScore,
      budgetScore,
      totalScore,
    },
    matchReasons,
  };
}

/**
 * Recommends and ranks colour palettes deterministically based on user preferences.
 * Identical inputs always produce the exact same ranked output.
 */
export function recommendPalettes(
  preferences: UserPreferences,
  allPalettes: ColourPalette[] = PALETTES_DATA
): RankedPalette[] {
  const ranked = allPalettes.map((palette) => {
    const { scoreBreakdown, matchReasons } = scorePalette(palette, preferences);
    return {
      palette,
      score: scoreBreakdown.totalScore,
      scoreBreakdown,
      matchReasons,
    };
  });

  // Deterministic sorting:
  // 1. Primary sort: Score descending
  // 2. Secondary sort: Alphabetical by ID to guarantee tie-breaking consistency
  ranked.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.palette.id.localeCompare(b.palette.id);
  });

  return ranked;
}

/**
 * Filter palettes directly by room or style
 */
export function filterPalettes(options: {
  room?: RoomType;
  style?: DesignStyle;
  tone?: ColourTone;
  palettes?: ColourPalette[];
}): ColourPalette[] {
  const dataset = options.palettes || PALETTES_DATA;

  return dataset.filter((palette) => {
    if (options.room && !palette.supportedRooms.includes(options.room)) {
      return false;
    }
    if (options.style && !palette.interiorStyles.includes(options.style)) {
      return false;
    }
    if (options.tone && !palette.toneFamily.includes(options.tone)) {
      return false;
    }
    return true;
  });
}
