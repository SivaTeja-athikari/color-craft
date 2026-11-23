import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../src/theme/theme';
import { Button } from '../src/components/common/Button';
import { PALETTES_DATA } from '../src/engine/paletteData';
import { PaletteCard } from '../src/components/common/PaletteCard';
import { useAppStore } from '../src/store/useAppStore';
import {
  Compass,
  Bookmark,
  Sparkles,
  Camera,
  Columns,
  Layers,
  ArrowRight,
} from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const savedPaletteIds = useAppStore((state) => state.savedPaletteIds);
  const comparisonPaletteIds = useAppStore((state) => state.comparisonPaletteIds);

  const featuredPalettes = PALETTES_DATA.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero */}
        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <Sparkles size={14} color={COLORS.primary} />
            <Text style={styles.badgeText}>Architectural Colour Engine</Text>
          </View>
          <Text style={styles.heroTitle}>
            Color<Text style={{ color: COLORS.accent }}>Craft</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Intelligent, rule-based colour palettes crafted for rooms, walls,
            furniture, and exteriors using classical design theory.
          </Text>
        </View>

        {/* Quick Action Cards */}
        <View style={styles.actionGrid}>
          <Pressable
            style={[styles.primaryActionCard, styles.actionCard]}
            onPress={() => router.push('/choose-space')}
            accessibilityRole="button"
            accessibilityLabel="Start Room Color Recommendation"
          >
            <View style={styles.iconCirclePrimary}>
              <Compass size={22} color={COLORS.textInverse} />
            </View>
            <View style={styles.actionCardContent}>
              <Text style={styles.primaryActionTitle}>Find My Palette</Text>
              <Text style={styles.primaryActionDesc}>
                Space, style, lighting & tone tailored recommendations
              </Text>
            </View>
            <ArrowRight size={20} color={COLORS.textInverse} />
          </Pressable>

          <View style={styles.subActionRow}>
            <Pressable
              style={[styles.subActionCard, styles.actionCard]}
              onPress={() => router.push('/upload-photo')}
              accessibilityRole="button"
              accessibilityLabel="Upload Room Photo"
            >
              <Camera size={20} color={COLORS.primary} />
              <Text style={styles.subActionTitle}>Photo Context</Text>
              <Text style={styles.subActionDesc}>Capture or upload room</Text>
            </Pressable>

            <Pressable
              style={[styles.subActionCard, styles.actionCard]}
              onPress={() => router.push('/saved')}
              accessibilityRole="button"
              accessibilityLabel="View Saved Palettes"
            >
              <Bookmark size={20} color={COLORS.accent} />
              <Text style={styles.subActionTitle}>
                Saved ({savedPaletteIds.length})
              </Text>
              <Text style={styles.subActionDesc}>Curated favourites</Text>
            </Pressable>
          </View>

          {comparisonPaletteIds.length > 0 && (
            <Pressable
              style={[styles.compareBanner, styles.actionCard]}
              onPress={() => router.push('/compare')}
              accessibilityRole="button"
              accessibilityLabel="Compare Selected Palettes"
            >
              <Columns size={18} color={COLORS.primary} />
              <Text style={styles.compareBannerText}>
                Compare {comparisonPaletteIds.length} Selected Palettes Side-by-Side
              </Text>
              <ArrowRight size={16} color={COLORS.primary} />
            </Pressable>
          )}
        </View>

        {/* Colour Theory Pillars */}
        <View style={styles.principlesContainer}>
          <Text style={styles.sectionHeading}>Design Theory Pillars</Text>
          <View style={styles.principleRow}>
            <View style={styles.principleCard}>
              <Text style={styles.principleTitle}>60–30–10 Rule</Text>
              <Text style={styles.principleDesc}>
                60% main wall envelope, 30% furniture/secondary, 10% bold accents.
              </Text>
            </View>
            <View style={styles.principleCard}>
              <Text style={styles.principleTitle}>Luminance & LRV</Text>
              <Text style={styles.principleDesc}>
                High light-reflectance in low-light spaces; deep grounding in bright rooms.
              </Text>
            </View>
          </View>
        </View>

        {/* Featured Palettes */}
        <View style={styles.featuredSection}>
          <View style={styles.featuredHeader}>
            <Text style={styles.sectionHeading}>Curated Highlights</Text>
            <Pressable
              onPress={() => router.push('/recommendations')}
              accessibilityRole="button"
              accessibilityLabel="Browse All 32 Palettes"
            >
              <Text style={styles.viewAllText}>Browse All (32) →</Text>
            </Pressable>
          </View>

          {featuredPalettes.map((palette) => (
            <PaletteCard key={palette.id} palette={palette} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  heroSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    gap: 6,
    marginBottom: SPACING.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginTop: SPACING.xs,
  },
  actionGrid: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  actionCard: {
    borderRadius: RADIUS.lg,
    ...SHADOWS.card,
  },
  primaryActionCard: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCirclePrimary: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  actionCardContent: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  primaryActionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textInverse,
  },
  primaryActionDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  subActionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  subActionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  subActionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  compareBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    gap: SPACING.sm,
  },
  compareBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  principlesContainer: {
    marginBottom: SPACING.xl,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  principleRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  principleCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceSubtle,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  principleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  principleDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  featuredSection: {
    marginBottom: SPACING.xl,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
