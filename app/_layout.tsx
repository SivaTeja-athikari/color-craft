import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';
import { COLORS } from '../src/theme/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const loadSavedPalettes = useAppStore((state) => state.loadSavedPalettes);

  useEffect(() => {
    loadSavedPalettes();
  }, [loadSavedPalettes]);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="choose-space"
          options={{
            title: '1. Choose Space',
            headerBackTitle: 'Home',
          }}
        />
        <Stack.Screen
          name="upload-photo"
          options={{
            title: '2. Room Photo (Optional)',
            headerBackTitle: 'Space',
          }}
        />
        <Stack.Screen
          name="design-preferences"
          options={{
            title: '3. Design Preferences',
            headerBackTitle: 'Photo',
          }}
        />
        <Stack.Screen
          name="recommendations"
          options={{
            title: 'Recommended Palettes',
            headerBackTitle: 'Preferences',
          }}
        />
        <Stack.Screen
          name="palette/[id]"
          options={{
            title: 'Palette Architectural Details',
            headerBackTitle: 'Palettes',
          }}
        />
        <Stack.Screen
          name="saved"
          options={{
            title: 'Saved Palettes',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="compare"
          options={{
            title: 'Palette Comparison',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
