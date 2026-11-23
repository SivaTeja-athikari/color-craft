// Domain Types and Enums for ColorCraft Recommendation Engine

export type RoomType =
  | 'living_room'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'dining_room'
  | 'study_room'
  | 'childrens_room'
  | 'balcony'
  | 'home_office'
  | 'exterior_walls'
  | 'full_house';

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  living_room: 'Living Room',
  bedroom: 'Bedroom',
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  dining_room: 'Dining Room',
  study_room: 'Study Room',
  childrens_room: "Children's Room",
  balcony: 'Balcony',
  home_office: 'Home Office',
  exterior_walls: 'Exterior Walls',
  full_house: 'Full House',
};

export type DesignStyle =
  | 'modern'
  | 'minimalist'
  | 'contemporary'
  | 'luxury'
  | 'scandinavian'
  | 'traditional'
  | 'industrial'
  | 'bohemian'
  | 'natural_earthy'
  | 'indian_contemporary';

export const DESIGN_STYLE_LABELS: Record<DesignStyle, string> = {
  modern: 'Modern',
  minimalist: 'Minimalist',
  contemporary: 'Contemporary',
  luxury: 'Luxury',
  scandinavian: 'Scandinavian',
  traditional: 'Traditional',
  industrial: 'Industrial',
  bohemian: 'Bohemian',
  natural_earthy: 'Natural / Earthy',
  indian_contemporary: 'Indian Contemporary',
};

export type ColourTone =
  | 'warm'
  | 'cool'
  | 'neutral'
  | 'earthy'
  | 'pastel'
  | 'bold'
  | 'light'
  | 'dark';

export const COLOUR_TONE_LABELS: Record<ColourTone, string> = {
  warm: 'Warm Colours',
  cool: 'Cool Colours',
  neutral: 'Neutral Colours',
  earthy: 'Earthy Colours',
  pastel: 'Pastel Colours',
  bold: 'Bold Colours',
  light: 'Light Colours',
  dark: 'Dark Colours',
};

export type RoomSize = 'small' | 'large' | 'any';
export type RoomLighting = 'low_light' | 'bright' | 'any';
export type RoomMood = 'calm' | 'energetic' | 'balanced';
export type BudgetTier = 'budget_friendly' | 'premium' | 'standard';

export interface UserPreferences {
  selectedRoom: RoomType;
  selectedStyle?: DesignStyle;
  selectedTone?: ColourTone;
  roomSize?: RoomSize;
  roomLighting?: RoomLighting;
  roomMood?: RoomMood;
  budgetTier?: BudgetTier;
}

export type ColourHarmony =
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'neutral_based';

export interface PaletteSlot {
  role:
    | 'main_wall'
    | 'secondary_wall'
    | 'accent_wall'
    | 'ceiling'
    | 'trim'
    | 'furniture'
    | 'floor'
    | 'decorative_accent';
  name: string;
  hex: string;
  usagePercentage: number; // Sums roughly or specifies recommended area coverage
  description: string;
}

export interface ColourPalette {
  id: string;
  name: string;
  tagline: string;
  harmony: ColourHarmony;
  supportedRooms: RoomType[];
  interiorStyles: DesignStyle[];
  colourTemperature: 'warm' | 'cool' | 'neutral';
  toneFamily: ColourTone[];
  mood: 'calm' | 'energetic' | 'balanced';
  targetRoomSizes: ('small' | 'large')[];
  targetLighting: ('low_light' | 'bright')[];
  targetBudgetTier: 'budget_friendly' | 'premium' | 'standard';

  // Specific 8-slot Architectural Colour Specs
  mainWall: PaletteSlot;
  secondaryWall: PaletteSlot;
  accentWall: PaletteSlot;
  ceiling: PaletteSlot;
  trim: PaletteSlot;
  furniture: PaletteSlot;
  floor: PaletteSlot;
  decorativeAccent: PaletteSlot;

  // 60-30-10 Rule Distribution Summary
  distributionRule: {
    dominant60: { role: string; colourName: string; hex: string; percent: number };
    secondary30: { role: string; colourName: string; hex: string; percent: number };
    accent10: { role: string; colourName: string; hex: string; percent: number };
  };

  designExplanation: string;
  colourRelationshipNote: string;
  tags: string[];
}

export interface RecommendationScoreBreakdown {
  roomScore: number;
  styleScore: number;
  toneScore: number;
  sizeScore: number;
  lightingScore: number;
  moodScore: number;
  budgetScore: number;
  totalScore: number;
}

export interface RankedPalette {
  palette: ColourPalette;
  score: number;
  scoreBreakdown: RecommendationScoreBreakdown;
  matchReasons: string[];
}
