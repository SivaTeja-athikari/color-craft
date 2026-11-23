import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';
import {
  ColourTone,
  DesignStyle,
  DESIGN_STYLE_LABELS,
  COLOUR_TONE_LABELS,
  RoomLighting,
  RoomMood,
  RoomSize,
  BudgetTier,
} from '../src/engine/types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../src/theme/theme';
import { FilterChip } from '../src/components/common/FilterChip';
import { Button } from '../src/components/common/Button';

const STYLES_LIST: DesignStyle[] = [
  'modern',
  'minimalist',
  'contemporary',
  'luxury',
  'scandinavian',
  'traditional',
  'industrial',
  'bohemian',
  'natural_earthy',
  'indian_contemporary',
];

const TONES_LIST: ColourTone[] = [
  'warm',
  'cool',
  'neutral',
  'earthy',
  'pastel',
  'bold',
  'light',
  'dark',
];

export default function DesignPreferencesScreen() {
  const router = useRouter();
  const { preferences, setPreferences } = useAppStore();

  const handleSelectStyle = (style: DesignStyle) => {
    setPreferences({ selectedStyle: style });
  };

  const handleSelectTone = (tone: ColourTone) => {
    setPreferences({ selectedTone: tone });
  };

  const handleSelectSize = (size: RoomSize) => {
    setPreferences({ roomSize: size });
  };

  const handleSelectLighting = (lighting: RoomLighting) => {
    setPreferences({ roomLighting: lighting });
  };

  const handleSelectMood = (mood: RoomMood) => {
    setPreferences({ roomMood: mood });
  };

  const handleSelectBudget = (tier: BudgetTier) => {
    setPreferences({ budgetTier: tier });
  };

  const handleGenerate = () => {
    router.push('/recommendations');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Design & Ambience Filters</Text>
        <Text style={styles.subtitle}>
          Set your aesthetic direction. Our deterministic rules engine scores
          matching palettes according to color theory principles.
        </Text>

        {/* 1. Interior Design Style */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interior Design Style</Text>
          <Text style={styles.sectionDesc}>
            Maps to complementary architectural wood, metal, and paint finishes.
          </Text>
          <View style={styles.chipGrid}>
            {STYLES_LIST.map((style) => (
              <FilterChip
                key={style}
                label={DESIGN_STYLE_LABELS[style]}
                selected={preferences.selectedStyle === style}
                onPress={() => handleSelectStyle(style)}
              />
            ))}
          </View>
        </View>

        {/* 2. Colour Preference / Temperature */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Colour Preference & Undertone</Text>
          <Text style={styles.sectionDesc}>
            Governs dominant wavelength balance and spectral warmth.
          </Text>
          <View style={styles.chipGrid}>
            {TONES_LIST.map((tone) => (
              <FilterChip
                key={tone}
                label={COLOUR_TONE_LABELS[tone]}
                selected={preferences.selectedTone === tone}
                onPress={() => handleSelectTone(tone)}
              />
            ))}
          </View>
        </View>

        {/* 3. Room Size Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room Dimension</Text>
          <Text style={styles.sectionDesc}>
            Small spaces benefit from low-contrast ceilings; large spaces benefit
            from grounding anchor walls.
          </Text>
          <View style={styles.chipGrid}>
            <FilterChip
              label="Any Size"
              selected={preferences.roomSize === 'any' || !preferences.roomSize}
              onPress={() => handleSelectSize('any')}
            />
            <FilterChip
              label="Small Room (< 150 sq ft)"
              selected={preferences.roomSize === 'small'}
              onPress={() => handleSelectSize('small')}
            />
            <FilterChip
              label="Large Room (> 250 sq ft)"
              selected={preferences.roomSize === 'large'}
              onPress={() => handleSelectSize('large')}
            />
          </View>
        </View>

        {/* 4. Natural Lighting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Natural Lighting Conditions</Text>
          <Text style={styles.sectionDesc}>
            Low-light rooms prioritize high Light Reflectance Values (LRV); bright rooms absorb glare.
          </Text>
          <View style={styles.chipGrid}>
            <FilterChip
              label="Any Light"
              selected={preferences.roomLighting === 'any' || !preferences.roomLighting}
              onPress={() => handleSelectLighting('any')}
            />
            <FilterChip
              label="Low Light / North-Facing"
              selected={preferences.roomLighting === 'low_light'}
              onPress={() => handleSelectLighting('low_light')}
            />
            <FilterChip
              label="Bright / Direct Sunlight"
              selected={preferences.roomLighting === 'bright'}
              onPress={() => handleSelectLighting('bright')}
            />
          </View>
        </View>

        {/* 5. Ambience & Mood */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ambience & Emotional Mood</Text>
          <View style={styles.chipGrid}>
            <FilterChip
              label="Calm & Restful"
              selected={preferences.roomMood === 'calm'}
              onPress={() => handleSelectMood('calm')}
            />
            <FilterChip
              label="Energetic & Social"
              selected={preferences.roomMood === 'energetic'}
              onPress={() => handleSelectMood('energetic')}
            />
            <FilterChip
              label="Balanced Harmony"
              selected={preferences.roomMood === 'balanced' || !preferences.roomMood}
              onPress={() => handleSelectMood('balanced')}
            />
          </View>
        </View>

        {/* 6. Budget Tier */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aesthetic Tier</Text>
          <View style={styles.chipGrid}>
            <FilterChip
              label="Budget-Friendly Practical"
              selected={preferences.budgetTier === 'budget_friendly'}
              onPress={() => handleSelectBudget('budget_friendly')}
            />
            <FilterChip
              label="Standard Residential"
              selected={preferences.budgetTier === 'standard' || !preferences.budgetTier}
              onPress={() => handleSelectBudget('standard')}
            />
            <FilterChip
              label="Premium Architectural Luxury"
              selected={preferences.budgetTier === 'premium'}
              onPress={() => handleSelectBudget('premium')}
            />
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <Button
          title="Recommend Curated Palettes →"
          onPress={handleGenerate}
          size="lg"
          variant="primary"
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 110,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 16,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.card,
  },
});
