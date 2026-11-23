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
import { Button } from '../src/components/common/Button';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../src/theme/theme';
import { Columns, Trash2, X } from 'lucide-react-native';

export default function CompareScreen() {
  const router = useRouter();
  const { comparisonPaletteIds, toggleComparisonPalette, clearComparison } =
    useAppStore();

  const selectedPalettes = PALETTES_DATA.filter((p) =>
    comparisonPaletteIds.includes(p.id)
  );

  if (selectedPalettes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Columns size={32} color={COLORS.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>No Palettes Selected for Comparison</Text>
        <Text style={styles.emptyDesc}>
          Tap the column comparison icon on up to 3 palettes to inspect them
          side-by-side.
        </Text>
        <Button
          title="Browse Palettes"
          onPress={() => router.push('/recommendations')}
          variant="primary"
          style={{ marginTop: SPACING.md }}
        />
      </View>
    );
  }

  const comparisonAttributes = [
    { label: 'Harmony', key: 'harmony' },
    { label: 'Temperature', key: 'colourTemperature' },
    { label: 'Main Wall', key: 'mainWall' },
    { label: 'Secondary', key: 'secondaryWall' },
    { label: 'Accent Wall', key: 'accentWall' },
    { label: 'Ceiling', key: 'ceiling' },
    { label: 'Trim', key: 'trim' },
    { label: 'Furniture', key: 'furniture' },
    { label: 'Floor', key: 'floor' },
    { label: 'Decor Accent', key: 'decorativeAccent' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Side-by-Side Comparison</Text>
          <Text style={styles.subtitle}>
            Comparing {selectedPalettes.length} architectural scheme
            {selectedPalettes.length === 1 ? '' : 's'}
          </Text>
        </View>
        <Button
          title="Clear"
          onPress={clearComparison}
          variant="outline"
          size="sm"
          icon={<Trash2 size={14} color={COLORS.primary} />}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {selectedPalettes.map((palette) => (
          <View key={palette.id} style={styles.columnCard}>
            <View style={styles.columnHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.paletteColName} numberOfLines={2}>
                  {palette.name}
                </Text>
                <Text style={styles.paletteTagline} numberOfLines={2}>
                  {palette.tagline}
                </Text>
              </View>
              <Pressable
                onPress={() => toggleComparisonPalette(palette.id)}
                style={styles.removeBtn}
                accessibilityRole="button"
                accessibilityLabel="Remove from comparison"
              >
                <X size={16} color={COLORS.textMuted} />
              </Pressable>
            </View>

            {/* Quick Palette Bar */}
            <View style={styles.colorBar}>
              {[
                palette.mainWall.hex,
                palette.secondaryWall.hex,
                palette.accentWall.hex,
                palette.furniture.hex,
                palette.decorativeAccent.hex,
              ].map((hex, idx) => (
                <View
                  key={idx}
                  style={[styles.barSegment, { backgroundColor: hex }]}
                />
              ))}
            </View>

            {/* Attributes Comparison */}
            <View style={styles.attributesList}>
              <View style={styles.attrRow}>
                <Text style={styles.attrLabel}>Harmony</Text>
                <Text style={styles.attrValue}>
                  {palette.harmony.replace('_', ' ')}
                </Text>
              </View>

              <View style={styles.attrRow}>
                <Text style={styles.attrLabel}>Temperature</Text>
                <Text style={styles.attrValue}>{palette.colourTemperature}</Text>
              </View>

              {/* Slot Cards */}
              {[
                { label: 'Main Wall', slot: palette.mainWall },
                { label: 'Secondary Wall', slot: palette.secondaryWall },
                { label: 'Accent Wall', slot: palette.accentWall },
                { label: 'Ceiling', slot: palette.ceiling },
                { label: 'Trim', slot: palette.trim },
                { label: 'Furniture', slot: palette.furniture },
                { label: 'Floor', slot: palette.floor },
                { label: 'Decor', slot: palette.decorativeAccent },
              ].map((item, idx) => (
                <View key={idx} style={styles.slotRow}>
                  <View
                    style={[styles.swatchDot, { backgroundColor: item.slot.hex }]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.slotRoleText}>{item.label}</Text>
                    <Text style={styles.slotNameText} numberOfLines={1}>
                      {item.slot.name}
                    </Text>
                    <Text style={styles.slotHexText}>{item.slot.hex}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Button
              title="View Palette Details"
              onPress={() => router.push(`/palette/${palette.id}`)}
              variant="secondary"
              size="sm"
              style={{ marginTop: SPACING.md }}
            />
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  horizontalScroll: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  columnCard: {
    width: 280,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  columnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  paletteColName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  paletteTagline: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  removeBtn: {
    padding: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
  },
  colorBar: {
    flexDirection: 'row',
    height: 20,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
    marginVertical: SPACING.sm,
  },
  barSegment: {
    flex: 1,
  },
  attributesList: {
    marginTop: SPACING.sm,
    gap: 10,
  },
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 4,
  },
  attrLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  attrValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING.sm,
  },
  swatchDot: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  slotRoleText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  slotNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  slotHexText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
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
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 280,
  },
});
