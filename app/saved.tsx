import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { PALETTES_DATA } from '../src/engine/paletteData';
import { useAppStore } from '../src/store/useAppStore';
import { PaletteCard } from '../src/components/common/PaletteCard';
import { Button } from '../src/components/common/Button';
import { COLORS, RADIUS, SPACING } from '../src/theme/theme';
import { Bookmark, Columns, Trash2 } from 'lucide-react-native';

export default function SavedPalettesScreen() {
  const router = useRouter();
  const { savedPaletteIds, comparisonPaletteIds } = useAppStore();

  const savedPalettes = PALETTES_DATA.filter((p) =>
    savedPaletteIds.includes(p.id)
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Saved Palettes</Text>
            <Text style={styles.subtitle}>
              {savedPalettes.length} saved architectural scheme
              {savedPalettes.length === 1 ? '' : 's'}
            </Text>
          </View>
        </View>

        {comparisonPaletteIds.length > 0 && (
          <Pressable
            style={styles.compareBanner}
            onPress={() => router.push('/compare')}
            accessibilityRole="button"
            accessibilityLabel="Compare Selected Palettes"
          >
            <Columns size={16} color={COLORS.primary} />
            <Text style={styles.compareBannerText}>
              Compare {comparisonPaletteIds.length} Palettes Side-by-Side →
            </Text>
          </Pressable>
        )}

        {savedPalettes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Bookmark size={32} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No Saved Palettes Yet</Text>
            <Text style={styles.emptyDesc}>
              Tap the bookmark icon on any palette card or detail screen to keep
              track of your favourite colour schemes.
            </Text>
            <Button
              title="Explore Palettes"
              onPress={() => router.push('/recommendations')}
              variant="primary"
              size="md"
              style={{ marginTop: SPACING.md }}
            />
          </View>
        ) : (
          <View style={styles.list}>
            {savedPalettes.map((palette) => (
              <PaletteCard key={palette.id} palette={palette} />
            ))}
          </View>
        )}
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
  headerRow: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  compareBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  compareBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: SPACING.xl,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  list: {
    gap: SPACING.sm,
  },
});
