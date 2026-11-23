import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ColourPalette } from '../../engine/types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../theme/theme';
import { useAppStore } from '../../store/useAppStore';
import { Bookmark, Columns } from 'lucide-react-native';

interface PaletteCardProps {
  palette: ColourPalette;
  score?: number;
  matchReasons?: string[];
  onSelect?: () => void;
}

export const PaletteCard: React.FC<PaletteCardProps> = ({
  palette,
  score,
  matchReasons,
  onSelect,
}) => {
  const router = useRouter();
  const {
    isPaletteSaved,
    toggleSavePalette,
    isPaletteInComparison,
    toggleComparisonPalette,
  } = useAppStore();

  const isSaved = isPaletteSaved(palette.id);
  const isInComparison = isPaletteInComparison(palette.id);

  const handleCardPress = () => {
    if (onSelect) {
      onSelect();
    } else {
      router.push(`/palette/${palette.id}`);
    }
  };

  const handleBookmark = async (e: any) => {
    e.stopPropagation?.();
    await toggleSavePalette(palette.id);
  };

  const handleCompare = (e: any) => {
    e.stopPropagation?.();
    toggleComparisonPalette(palette.id);
  };

  const keySwatches = [
    { hex: palette.mainWall.hex, label: 'Main Wall' },
    { hex: palette.secondaryWall.hex, label: 'Secondary' },
    { hex: palette.accentWall.hex, label: 'Accent' },
    { hex: palette.furniture.hex, label: 'Furniture' },
    { hex: palette.decorativeAccent.hex, label: 'Decor' },
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isInComparison && styles.cardInComparison,
        pressed && styles.cardPressed,
      ]}
      onPress={handleCardPress}
      accessibilityRole="button"
      accessibilityLabel={`View palette ${palette.name}`}
    >
      {/* Palette Color Ribbon */}
      <View style={styles.ribbonContainer}>
        {keySwatches.map((item, idx) => (
          <View
            key={idx}
            style={[styles.ribbonSlot, { backgroundColor: item.hex }]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{palette.name}</Text>
            <Text style={styles.tagline}>{palette.tagline}</Text>
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={handleCompare}
              style={[
                styles.iconBtn,
                isInComparison && styles.iconBtnActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Add to comparison"
            >
              <Columns
                size={18}
                color={isInComparison ? COLORS.primary : COLORS.textMuted}
              />
            </Pressable>
            <Pressable
              onPress={handleBookmark}
              style={[styles.iconBtn, isSaved && styles.iconBtnActive]}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? 'Remove from saved' : 'Save palette'}
            >
              <Bookmark
                size={18}
                color={isSaved ? COLORS.accent : COLORS.textMuted}
                fill={isSaved ? COLORS.accent : 'transparent'}
              />
            </Pressable>
          </View>
        </View>

        {/* Tags */}
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{palette.harmony.replace('_', ' ')}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{palette.colourTemperature}</Text>
          </View>
          {score !== undefined && (
            <View style={[styles.tag, styles.scoreTag]}>
              <Text style={styles.scoreText}>Match: {score}%</Text>
            </View>
          )}
        </View>

        {/* Top Match Reason */}
        {matchReasons && matchReasons.length > 0 && (
          <View style={styles.reasonBox}>
            <Text style={styles.reasonText}>✓ {matchReasons[0]}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  cardInComparison: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.995 }],
  },
  ribbonContainer: {
    flexDirection: 'row',
    height: 38,
    width: '100%',
  },
  ribbonSlot: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  iconBtn: {
    padding: 8,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
  },
  iconBtnActive: {
    backgroundColor: COLORS.primaryLight,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: SPACING.md,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  scoreTag: {
    backgroundColor: COLORS.successLight,
    borderColor: 'rgba(46, 125, 50, 0.2)',
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  reasonBox: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  reasonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
