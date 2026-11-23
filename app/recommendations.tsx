import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';
import { recommendPalettes } from '../src/engine/recommendationEngine';
import { ROOM_TYPE_LABELS, DESIGN_STYLE_LABELS } from '../src/engine/types';
import { PaletteCard } from '../src/components/common/PaletteCard';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../src/theme/theme';
import { SlidersHorizontal, Sparkles, Columns } from 'lucide-react-native';

export default function RecommendationsScreen() {
  const router = useRouter();
  const { preferences, selectedPhoto, comparisonPaletteIds } = useAppStore();

  const rankedPalettes = useMemo(() => {
    return recommendPalettes(preferences);
  }, [preferences]);

  const roomName = ROOM_TYPE_LABELS[preferences.selectedRoom];
  const styleName = preferences.selectedStyle
    ? DESIGN_STYLE_LABELS[preferences.selectedStyle]
    : 'All Styles';

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Filters Summary Header */}
        <View style={styles.filterSummaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.spaceTitle}>{roomName}</Text>
              <Text style={styles.styleSubtitle}>
                {styleName} • {preferences.selectedTone || 'All Tones'}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/design-preferences')}
              style={styles.editFilterBtn}
              accessibilityRole="button"
              accessibilityLabel="Edit preferences"
            >
              <SlidersHorizontal size={16} color={COLORS.primary} />
              <Text style={styles.editFilterText}>Refine</Text>
            </Pressable>
          </View>

          {/* Photo Thumbnail if user attached one */}
          {selectedPhoto && (
            <View style={styles.photoBanner}>
              <Image
                source={{ uri: selectedPhoto.uri }}
                style={styles.photoThumb}
                resizeMode="cover"
              />
              <View style={styles.photoBannerText}>
                <Text style={styles.photoBannerTitle}>Space Photo Attached</Text>
                <Text style={styles.photoBannerSub}>
                  Compare palettes against your room lighting & finishes.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Floating Compare CTA if items selected */}
        {comparisonPaletteIds.length > 0 && (
          <Pressable
            style={styles.comparisonCta}
            onPress={() => router.push('/compare')}
            accessibilityRole="button"
            accessibilityLabel="View Comparison"
          >
            <Columns size={18} color={COLORS.primary} />
            <Text style={styles.comparisonCtaText}>
              Compare {comparisonPaletteIds.length} Palettes Side-by-Side →
            </Text>
          </Pressable>
        )}

        <View style={styles.resultsCountRow}>
          <Text style={styles.resultsHeading}>
            {rankedPalettes.length} Curated Architectural Schemes
          </Text>
          <Text style={styles.resultsSub}>
            Ranked deterministically by color theory & optical criteria
          </Text>
        </View>

        {/* List of Ranked Palette Cards */}
        {rankedPalettes.map((item) => (
          <PaletteCard
            key={item.palette.id}
            palette={item.palette}
            score={item.score}
            matchReasons={item.matchReasons}
          />
        ))}
      </ScrollView>
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
    paddingBottom: SPACING.xxxl,
  },
  filterSummaryCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.subtle,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spaceTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  styleSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  editFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 6,
  },
  editFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  photoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSubtle,
    marginTop: SPACING.md,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  photoThumb: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
  },
  photoBannerText: {
    flex: 1,
  },
  photoBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  photoBannerSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  comparisonCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  comparisonCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  resultsCountRow: {
    marginBottom: SPACING.md,
  },
  resultsHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  resultsSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
