import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../src/store/useAppStore';
import { RoomType, ROOM_TYPE_LABELS } from '../src/engine/types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../src/theme/theme';
import { Button } from '../src/components/common/Button';
import {
  Sofa,
  Bed,
  UtensilsCrossed,
  Bath,
  Wine,
  BookOpen,
  Baby,
  Sun,
  Briefcase,
  Building,
  Home,
  Check,
} from 'lucide-react-native';

interface RoomOption {
  type: RoomType;
  label: string;
  desc: string;
  icon: (props: { color: string; size: number }) => React.ReactNode;
}

const ROOM_OPTIONS: RoomOption[] = [
  {
    type: 'living_room',
    label: 'Living Room',
    desc: 'Social gathering, entertaining & central warmth',
    icon: (p) => <Sofa {...p} />,
  },
  {
    type: 'bedroom',
    label: 'Bedroom',
    desc: 'Calm sanctuary, restorative sleep & intimacy',
    icon: (p) => <Bed {...p} />,
  },
  {
    type: 'kitchen',
    label: 'Kitchen',
    desc: 'Culinary focus, hygienic bright planes & durable textures',
    icon: (p) => <UtensilsCrossed {...p} />,
  },
  {
    type: 'bathroom',
    label: 'Bathroom',
    desc: 'Spa rejuvenation, high reflectance & moisture serenity',
    icon: (p) => <Bath {...p} />,
  },
  {
    type: 'dining_room',
    label: 'Dining Room',
    desc: 'Stimulating conversation & ambient hospitality',
    icon: (p) => <Wine {...p} />,
  },
  {
    type: 'study_room',
    label: 'Study Room',
    desc: 'Cognitive stamina, library depth & reduced optical fatigue',
    icon: (p) => <BookOpen {...p} />,
  },
  {
    type: 'childrens_room',
    label: "Children's Room",
    desc: 'Playful imagination, balanced pastels & gentle sleep cues',
    icon: (p) => <Baby {...p} />,
  },
  {
    type: 'balcony',
    label: 'Balcony',
    desc: 'Natural sunlight, verdant flora & outdoor relaxation',
    icon: (p) => <Sun {...p} />,
  },
  {
    type: 'home_office',
    label: 'Home Office',
    desc: 'Glare-free video background, executive focus & posture',
    icon: (p) => <Briefcase {...p} />,
  },
  {
    type: 'exterior_walls',
    label: 'Exterior Walls',
    desc: 'Architectural curb presence & weatherproof harmony',
    icon: (p) => <Building {...p} />,
  },
  {
    type: 'full_house',
    label: 'Full House',
    desc: 'Cohesive unified palette flowing throughout all rooms',
    icon: (p) => <Home {...p} />,
  },
];

export default function ChooseSpaceScreen() {
  const router = useRouter();
  const { preferences, setPreferences } = useAppStore();

  const handleSelectRoom = (room: RoomType) => {
    setPreferences({ selectedRoom: room });
  };

  const handleNext = () => {
    router.push('/upload-photo');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What space are you designing?</Text>
        <Text style={styles.subtitle}>
          Select your room type. Architectural lighting, optical scale, and
          usage rules will be tailored to this space.
        </Text>

        <View style={styles.grid}>
          {ROOM_OPTIONS.map((item) => {
            const isSelected = preferences.selectedRoom === item.type;
            return (
              <Pressable
                key={item.type}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handleSelectRoom(item.type)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={item.label}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconCircle,
                      isSelected && styles.iconCircleSelected,
                    ]}
                  >
                    {item.icon({
                      color: isSelected ? COLORS.primary : COLORS.textSecondary,
                      size: 22,
                    })}
                  </View>
                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <Check size={14} color={COLORS.textInverse} />
                    </View>
                  )}
                </View>

                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                  {item.label}
                </Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.desc}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Selected Space</Text>
          <Text style={styles.summaryValue}>
            {ROOM_TYPE_LABELS[preferences.selectedRoom]}
          </Text>
        </View>
        <Button
          title="Continue to Photo →"
          onPress={handleNext}
          size="lg"
          style={styles.continueBtn}
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
  grid: {
    gap: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F7FAFD',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardTitleSelected: {
    color: COLORS.primary,
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.card,
  },
  summaryContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  continueBtn: {
    flex: 1.4,
  },
});
