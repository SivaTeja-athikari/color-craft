import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { PALETTES_DATA } from '../../src/engine/paletteData';
import { ColorSwatch } from '../../src/components/common/ColorSwatch';
import { DistributionBar } from '../../src/components/common/DistributionBar';
import { Button } from '../../src/components/common/Button';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../src/theme/theme';
import { useAppStore } from '../../src/store/useAppStore';
import {
  Bookmark,
  Copy,
  Columns,
  Share2,
  Check,
  Eye,
  Info,
} from 'lucide-react-native';

export default function PaletteDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    isPaletteSaved,
    toggleSavePalette,
    isPaletteInComparison,
    toggleComparisonPalette,
    selectedPhoto,
  } = useAppStore();

  const [copiedAll, setCopiedAll] = useState(false);
  const [showApproxWash, setShowApproxWash] = useState(false);

  const palette = PALETTES_DATA.find((p) => p.id === id);

  if (!palette) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Palette not found.</Text>
        <Button
          title="Back to Recommendations"
          onPress={() => router.back()}
          variant="outline"
          style={{ marginTop: SPACING.md }}
        />
      </View>
    );
  }

  const isSaved = isPaletteSaved(palette.id);
  const isInComparison = isPaletteInComparison(palette.id);

  const handleCopyAll = async () => {
    const paletteSummary = `
🎨 ${palette.name} (${palette.tagline})
• Main Wall: ${palette.mainWall.name} (${palette.mainWall.hex})
• Secondary Wall: ${palette.secondaryWall.name} (${palette.secondaryWall.hex})
• Accent Wall: ${palette.accentWall.name} (${palette.accentWall.hex})
• Ceiling: ${palette.ceiling.name} (${palette.ceiling.hex})
• Trim: ${palette.trim.name} (${palette.trim.hex})
• Furniture: ${palette.furniture.name} (${palette.furniture.hex})
• Floor: ${palette.floor.name} (${palette.floor.hex})
• Decorative Accent: ${palette.decorativeAccent.name} (${palette.decorativeAccent.hex})
Architectural Note: ${palette.designExplanation}
    `.trim();

    await Clipboard.setStringAsync(paletteSummary);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Title & Tags */}
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.paletteName}>{palette.name}</Text>
          <Text style={styles.tagline}>{palette.tagline}</Text>
        </View>

        <View style={styles.actionRow}>
          <Button
            title={copiedAll ? 'All Hex Codes Copied!' : 'Copy All Colours'}
            onPress={handleCopyAll}
            variant="outline"
            size="sm"
            icon={
              copiedAll ? (
                <Check size={16} color={COLORS.primary} />
              ) : (
                <Copy size={16} color={COLORS.primary} />
              )
            }
          />
          <Pressable
            onPress={() => toggleSavePalette(palette.id)}
            style={[styles.iconButton, isSaved && styles.iconButtonSaved]}
            accessibilityRole="button"
            accessibilityLabel={isSaved ? 'Saved to favourites' : 'Save to favourites'}
          >
            <Bookmark
              size={18}
              color={isSaved ? COLORS.accent : COLORS.textPrimary}
              fill={isSaved ? COLORS.accent : 'transparent'}
            />
          </Pressable>
          <Pressable
            onPress={() => toggleComparisonPalette(palette.id)}
            style={[
              styles.iconButton,
              isInComparison && styles.iconButtonCompared,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Compare palette"
          >
            <Columns
              size={18}
              color={isInComparison ? COLORS.primary : COLORS.textPrimary}
            />
          </Pressable>
        </View>
      </View>

      {/* Visual Photo Context Preview (if photo was attached) */}
      {selectedPhoto && (
        <View style={styles.photoPreviewSection}>
          <View style={styles.photoHeader}>
            <Text style={styles.sectionHeading}>Your Room Photo Visualizer</Text>
            <Pressable
              onPress={() => setShowApproxWash(!showApproxWash)}
              style={styles.toggleWashBtn}
            >
              <Eye size={14} color={COLORS.primary} />
              <Text style={styles.toggleWashText}>
                {showApproxWash ? 'Hide Tint Wash' : 'Preview Wall Tint Wash'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.photoContainer}>
            <Image
              source={{ uri: selectedPhoto.uri }}
              style={styles.roomImage}
              resizeMode="cover"
            />
            {showApproxWash && (
              <View
                style={[
                  styles.approximateWashOverlay,
                  { backgroundColor: palette.mainWall.hex },
                ]}
              />
            )}
            <View style={styles.transparencyDisclaimer}>
              <Info size={14} color={COLORS.textPrimary} />
              <Text style={styles.disclaimerText}>
                Approximate architectural wash. Shadows and walls are rendered
                without fabricated AI segmentation.
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* 60-30-10 Distribution Rule Breakdown */}
      <DistributionBar
        dominant={{
          name: palette.distributionRule.dominant60.colourName,
          hex: palette.distributionRule.dominant60.hex,
          percent: palette.distributionRule.dominant60.percent,
          role: palette.distributionRule.dominant60.role,
        }}
        secondary={{
          name: palette.distributionRule.secondary30.colourName,
          hex: palette.distributionRule.secondary30.hex,
          percent: palette.distributionRule.secondary30.percent,
          role: palette.distributionRule.secondary30.role,
        }}
        accent={{
          name: palette.distributionRule.accent10.colourName,
          hex: palette.distributionRule.accent10.hex,
          percent: palette.distributionRule.accent10.percent,
          role: palette.distributionRule.accent10.role,
        }}
      />

      {/* Architectural Role Swatches */}
      <View style={styles.swatchSection}>
        <Text style={styles.sectionHeading}>8-Slot Architectural Colorway</Text>
        <Text style={styles.sectionSubtitle}>
          Tap any color card to copy its individual hex code.
        </Text>

        <ColorSwatch
          hex={palette.mainWall.hex}
          name={palette.mainWall.name}
          roleLabel="Main Wall Surface (60%)"
          percentage={palette.mainWall.usagePercentage}
        />
        <ColorSwatch
          hex={palette.secondaryWall.hex}
          name={palette.secondaryWall.name}
          roleLabel="Secondary Wall / Alcove (20%)"
          percentage={palette.secondaryWall.usagePercentage}
        />
        <ColorSwatch
          hex={palette.accentWall.hex}
          name={palette.accentWall.name}
          roleLabel="Accent Focus Wall (10%)"
          percentage={palette.accentWall.usagePercentage}
        />
        <ColorSwatch
          hex={palette.ceiling.hex}
          name={palette.ceiling.name}
          roleLabel="Ceiling Plane (LRV Optimized)"
          percentage={palette.ceiling.usagePercentage}
        />
        <ColorSwatch
          hex={palette.trim.hex}
          name={palette.trim.name}
          roleLabel="Architraves, Trims & Baseboards"
          percentage={palette.trim.usagePercentage}
        />
        <ColorSwatch
          hex={palette.furniture.hex}
          name={palette.furniture.name}
          roleLabel="Primary Furniture / Wood Anchor (30%)"
          percentage={palette.furniture.usagePercentage}
        />
        <ColorSwatch
          hex={palette.floor.hex}
          name={palette.floor.name}
          roleLabel="Flooring Material & Rug Grounding"
          percentage={palette.floor.usagePercentage}
        />
        <ColorSwatch
          hex={palette.decorativeAccent.hex}
          name={palette.decorativeAccent.name}
          roleLabel="Decorative Accent / Hardware (10%)"
          percentage={palette.decorativeAccent.usagePercentage}
        />
      </View>

      {/* Interior Designer Rationale */}
      <View style={styles.explanationSection}>
        <Text style={styles.sectionHeading}>Designer Rationale</Text>
        <View style={styles.rationaleCard}>
          <Text style={styles.rationaleBody}>{palette.designExplanation}</Text>
        </View>

        <Text style={[styles.sectionHeading, { marginTop: SPACING.lg }]}>
          Colour Harmony & Optical Mechanics
        </Text>
        <View style={styles.rationaleCard}>
          <Text style={styles.rationaleBody}>{palette.colourRelationshipNote}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    marginBottom: SPACING.md,
  },
  titleArea: {
    marginBottom: SPACING.md,
  },
  paletteName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconButton: {
    padding: 10,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconButtonSaved: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLight,
  },
  iconButtonCompared: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  photoPreviewSection: {
    marginBottom: SPACING.lg,
  },
  photoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  toggleWashBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  toggleWashText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  photoContainer: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  roomImage: {
    width: '100%',
    height: 220,
  },
  approximateWashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.28,
  },
  transparencyDisclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceSubtle,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  disclaimerText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 14,
  },
  swatchSection: {
    marginVertical: SPACING.md,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  explanationSection: {
    marginTop: SPACING.md,
  },
  rationaleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginTop: SPACING.xs,
  },
  rationaleBody: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 19,
  },
});
