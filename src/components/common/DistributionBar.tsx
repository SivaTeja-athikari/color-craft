import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { RADIUS, SPACING, COLORS } from '../../theme/theme';
import { getAccessibleTextColor } from '../../engine/colorTheory';

interface RuleProps {
  dominant: { name: string; hex: string; percent: number; role: string };
  secondary: { name: string; hex: string; percent: number; role: string };
  accent: { name: string; hex: string; percent: number; role: string };
}

export const DistributionBar: React.FC<RuleProps> = ({ dominant, secondary, accent }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>60–30–10 Designer Ratio</Text>
        <Text style={styles.headerSub}>Wall (60%) • Furniture (30%) • Accent (10%)</Text>
      </View>

      <View style={styles.bar}>
        <View
          style={[styles.segment, { flex: dominant.percent, backgroundColor: dominant.hex }]}
        >
          <Text
            style={[styles.segmentLabel, { color: getAccessibleTextColor(dominant.hex) }]}
          >
            {dominant.percent}%
          </Text>
        </View>
        <View
          style={[styles.segment, { flex: secondary.percent, backgroundColor: secondary.hex }]}
        >
          <Text
            style={[styles.segmentLabel, { color: getAccessibleTextColor(secondary.hex) }]}
          >
            {secondary.percent}%
          </Text>
        </View>
        <View
          style={[styles.segment, { flex: accent.percent, backgroundColor: accent.hex }]}
        >
          <Text
            style={[styles.segmentLabel, { color: getAccessibleTextColor(accent.hex) }]}
          >
            {accent.percent}%
          </Text>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: dominant.hex }]} />
          <Text style={styles.legendText} numberOfLines={1}>
            {dominant.role} ({dominant.name})
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: secondary.hex }]} />
          <Text style={styles.legendText} numberOfLines={1}>
            {secondary.role} ({secondary.name})
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: accent.hex }]} />
          <Text style={styles.legendText} numberOfLines={1}>
            {accent.role} ({accent.name})
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bar: {
    height: 28,
    flexDirection: 'row',
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  segment: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  legend: {
    marginTop: SPACING.md,
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
});
