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
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAppStore } from '../src/store/useAppStore';
import { ROOM_TYPE_LABELS } from '../src/engine/types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../src/theme/theme';
import { Button } from '../src/components/common/Button';
import {
  Camera,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Info,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react-native';

export default function UploadPhotoScreen() {
  const router = useRouter();
  const { preferences, selectedPhoto, setSelectedPhoto } = useAppStore();
  const [loading, setLoading] = useState(false);

  const roomLabel = ROOM_TYPE_LABELS[preferences.selectedRoom];

  const handlePickFromGallery = async () => {
    try {
      setLoading(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Needed',
          'Photo library access is needed to select a room photo.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedPhoto({
          uri: result.assets[0].uri,
          roomType: preferences.selectedRoom,
          source: 'gallery',
          timestamp: Date.now(),
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to load photo from gallery.');
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureCamera = async () => {
    try {
      setLoading(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Needed',
          'Camera access is required to take a room photograph.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedPhoto({
          uri: result.assets[0].uri,
          roomType: preferences.selectedRoom,
          source: 'camera',
          timestamp: Date.now(),
        });
      }
    } catch (e) {
      Alert.alert('Error', 'Unable to capture photograph.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
  };

  const handleContinue = () => {
    router.push('/design-preferences');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Visual Room Context</Text>
        <Text style={styles.subtitle}>
          Attach a photograph of your {roomLabel}. Recommendations are
          customized based on room type, orientation, and architectural criteria.
        </Text>

        {/* Honest Disclosure Box */}
        <View style={styles.infoBox}>
          <Info size={18} color={COLORS.primary} style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Transparent Architecture</Text>
            <Text style={styles.infoText}>
              Your photo provides visual context for reference alongside our
              palettes. ColorCraft does not claim to run automated wall/furniture
              segmentation or pretend AI detection in this phase.
            </Text>
          </View>
        </View>

        {/* Photo Preview or Picker Area */}
        {selectedPhoto ? (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: selectedPhoto.uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.previewOverlay}>
              <View style={styles.previewBadge}>
                <CheckCircle2 size={14} color={COLORS.success} />
                <Text style={styles.previewBadgeText}>Photo Attached</Text>
              </View>
              <Pressable
                onPress={handleRemovePhoto}
                style={styles.deleteBtn}
                accessibilityRole="button"
                accessibilityLabel="Remove photo"
              >
                <Trash2 size={16} color={COLORS.error} />
              </Pressable>
            </View>

            <View style={styles.photoActions}>
              <Button
                title="Replace from Gallery"
                onPress={handlePickFromGallery}
                variant="outline"
                size="sm"
                loading={loading}
                style={{ flex: 1 }}
              />
              <Button
                title="Retake Photo"
                onPress={handleCaptureCamera}
                variant="outline"
                size="sm"
                loading={loading}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.uploadCard}>
            <View style={styles.uploadIconContainer}>
              <ImageIcon size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.uploadPromptTitle}>No Photo Added Yet</Text>
            <Text style={styles.uploadPromptDesc}>
              Adding a photo allows you to visualize palettes directly alongside
              your actual space.
            </Text>

            <View style={styles.actionButtons}>
              <Button
                title="Select from Gallery"
                onPress={handlePickFromGallery}
                variant="secondary"
                icon={<ImageIcon size={18} color={COLORS.textPrimary} />}
                loading={loading}
              />
              <Button
                title="Take Room Photo"
                onPress={handleCaptureCamera}
                variant="secondary"
                icon={<Camera size={18} color={COLORS.textPrimary} />}
                loading={loading}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <Button
          title={selectedPhoto ? 'Continue to Preferences →' : 'Skip & Continue →'}
          onPress={handleContinue}
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(43, 76, 126, 0.2)',
    marginBottom: SPACING.lg,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  uploadCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    ...SHADOWS.subtle,
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  uploadPromptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  uploadPromptDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.lg,
    maxWidth: 280,
    lineHeight: 18,
  },
  actionButtons: {
    width: '100%',
    gap: SPACING.sm,
  },
  previewContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  previewImage: {
    width: '100%',
    height: 240,
  },
  previewOverlay: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    gap: 6,
    ...SHADOWS.subtle,
  },
  previewBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  deleteBtn: {
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: RADIUS.full,
    ...SHADOWS.subtle,
  },
  photoActions: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceSubtle,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
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
