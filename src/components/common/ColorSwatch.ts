import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { getAccessibleTextColor } from '../../engine/colorTheory';
import { COLORS, RADIUS, SPACING } from '../../theme/theme';

export interface SwatchProps {
  hex: string;
  name: string;
  roleLabel: string;
  percentage?: number;
  height?: number;
  showDetails?: boolean;
}

export const ColorSwatch: React.FC<SwatchProps> = ({
  hex,
  name,
  roleLabel,
  percentage,
  height = 70,
  showDetails = true,
}) => {
  const [copied, setCopied] = useState(false);
  const textColor = getAccessibleTextColor(hex);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return React.createElement(
    Pressable,
    {
      onPress: handleCopy,
      style: [styles.container, { backgroundColor: hex, minHeight: height }],
      accessibilityRole: 'button',
      accessibilityLabel: `Copy color ${name}, hex code ${hex}`,
      accessibilityHint: 'Double tap to copy hex code to clipboard',
    },
    React.createElement(
      View,
      { style: styles.content },
      React.createElement(
        View,
        { style: styles.topRow },
        React.createElement(
          Text,
          { style: [styles.roleLabel, { color: textColor }] },
          `${roleLabel} ${percentage ? `(${percentage}%)` : ''}`
        ),
        copied
          ? React.createElement(
              View,
              { style: [styles.copiedBadge, { backgroundColor: textColor }] },
              React.createElement(
                Text,
                {
                  style: [
                    styles.copiedText,
                    { color: textColor === '#FFFFFF' ? '#000000' : '#FFFFFF' },
                  ],
                },
                'Copied!'
              )
            )
          : null
      ),
      showDetails
        ? React.createElement(
            View,
            { style: styles.bottomRow },
            React.createElement(
              Text,
              {
                style: [styles.colorName, { color: textColor }],
                numberOfLines: 1,
              },
              name
            ),
            React.createElement(
              Text,
              { style: [styles.hexCode, { color: textColor }] },
              hex
            )
          )
        : null
    )
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginVertical: 4,
  },
  content: {
    justifyContent: 'space-between',
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: SPACING.sm,
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    opacity: 0.9,
  },
  copiedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  copiedText: {
    fontSize: 10,
    fontWeight: '700',
  },
  colorName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: SPACING.sm,
  },
  hexCode: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
});
