import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';

const { width } = Dimensions.get('window');

const PREPARING_MESSAGES = [
  '👨‍🍳 Master Chef is firing up the kitchen...',
  '🍳 Sizzling fresh ingredients...',
  '🍕 Garnishing your personalized menu...',
  '😋 Almost ready to serve your feast!',
];

export default function PreparingScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Reanimated shared values
  const chefHatBounce = useSharedValue(0);
  const panRotate = useSharedValue(0);
  const steamRise1 = useSharedValue(0);
  const steamRise2 = useSharedValue(0);
  const foodBounce = useSharedValue(0);
  const progressBarWidth = useSharedValue(0);

  useEffect(() => {
    // 1. Chef Hat Bouncing
    chefHatBounce.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 400, easing: Easing.ease }),
        withTiming(0, { duration: 400, easing: Easing.ease })
      ),
      -1,
      true
    );

    // 2. Frying Pan Wiggle / Sizzling
    panRotate.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 150 }),
        withTiming(8, { duration: 150 }),
        withTiming(0, { duration: 150 })
      ),
      -1,
      true
    );

    // 3. Steam Rising Particles
    steamRise1.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
    steamRise2.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );

    // 4. Food ingredients popping up
    foodBounce.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 350, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 350, easing: Easing.in(Easing.quad) })
      ),
      -1,
      true
    );

    // 5. Progress bar animation from 0% to 100% over 3000ms
    progressBarWidth.value = withTiming(1, {
      duration: 3000,
      easing: Easing.linear,
    });

    // Message rotation every 750ms
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PREPARING_MESSAGES.length);
    }, 750);

    // Progress percentage counter
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    // Navigate to Home after 3 seconds
    const timer = setTimeout(() => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      router.replace('/(tabs)/' as any);
    }, 3200);

    return () => {
      clearTimeout(timer);
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // Animated Styles
  const chefHatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chefHatBounce.value }],
  }));

  const panStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${panRotate.value}deg` }],
  }));

  const foodStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: foodBounce.value }],
  }));

  const steam1Style = useAnimatedStyle(() => ({
    opacity: interpolate(steamRise1.value, [0, 0.5, 1], [0.2, 1, 0]),
    transform: [
      { translateY: interpolate(steamRise1.value, [0, 1], [0, -35]) },
      { translateX: interpolate(steamRise1.value, [0, 1], [-5, 5]) },
    ],
  }));

  const steam2Style = useAnimatedStyle(() => ({
    opacity: interpolate(steamRise2.value, [0, 0.5, 1], [0.2, 1, 0]),
    transform: [
      { translateY: interpolate(steamRise2.value, [0, 1], [0, -40]) },
      { translateX: interpolate(steamRise2.value, [0, 1], [5, -5]) },
    ],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressBarWidth.value * 100}%`,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        {/* WELCOME BADGE */}
        <View style={styles.welcomeBadge}>
          <Text style={styles.welcomeBadgeText}>
            Welcome, {user?.name || 'Surya'}!
          </Text>
        </View>

        {/* CHEF KITCHEN ANIMATION STAGE */}
        <View style={styles.kitchenStage}>
          {/* STEAM PARTICLES RISING */}
          <View style={styles.steamContainer}>
            <Animated.View style={[styles.steamParticle, steam1Style]}>
              <MaterialCommunityIcons name="cloud" size={24} color="#FFDECF" />
            </Animated.View>

            <Animated.View style={[styles.steamParticle, steam2Style]}>
              <MaterialCommunityIcons name="cloud" size={28} color="#FFDECF" />
            </Animated.View>
          </View>

          {/* CHEF HAT */}
          <Animated.View style={[styles.chefHatWrapper, chefHatStyle]}>
            <FontAwesome5 name="chef-hat" size={54} color={Palette.primaryYellow} />
          </Animated.View>

          {/* SIZZLING INGREDIENTS (BOUNCING FOOD) */}
          <Animated.View style={[styles.foodPoppingContainer, foodStyle]}>
            <View style={styles.ingredientIconsRow}>
              <MaterialCommunityIcons name="hamburger" size={26} color="#F5CB58" />
              <MaterialCommunityIcons name="pizza" size={26} color="#FFDECF" />
              <MaterialCommunityIcons name="cheese" size={24} color="#F3E9B5" />
            </View>
          </Animated.View>

          {/* FRYING PAN / COOKING POT */}
          <Animated.View style={[styles.panWrapper, panStyle]}>
            <MaterialCommunityIcons
              name="pot-steam"
              size={110}
              color={Palette.white}
            />
          </Animated.View>
        </View>

        {/* PREPARING MESSAGES */}
        <View style={styles.messageContainer}>
          <Text style={styles.preparingMessage}>
            {PREPARING_MESSAGES[messageIndex]}
          </Text>
          <Text style={styles.preparingSubtext}>
            Setting up your delicious food experience...
          </Text>
        </View>

        {/* PROGRESS BAR */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarTrack}>
            <Animated.View style={[styles.progressBarFill, progressBarStyle]} />
          </View>
          <Text style={styles.progressPercent}>{Math.min(100, progress)}%</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.brandOrange, // #E95322 Vibrant Kitchen Brand Orange
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  welcomeBadge: {
    backgroundColor: Palette.lightPeach,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 36,
  },
  welcomeBadgeText: {
    color: Palette.darkBrown,
    fontWeight: '800',
    fontSize: 14,
  },

  /* KITCHEN STAGE */
  kitchenStage: {
    width: 220,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 30,
  },
  steamContainer: {
    position: 'absolute',
    top: -10,
    flexDirection: 'row',
    gap: 30,
  },
  steamParticle: {
    position: 'relative',
  },
  chefHatWrapper: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  foodPoppingContainer: {
    position: 'absolute',
    top: 55,
    zIndex: 5,
  },
  ingredientIconsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  panWrapper: {
    marginTop: 65,
  },

  /* MESSAGES */
  messageContainer: {
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
    marginBottom: 20,
  },
  preparingMessage: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.primaryYellow, // #F5CB58
    textAlign: 'center',
    marginBottom: 6,
  },
  preparingSubtext: {
    fontSize: 13,
    color: Palette.white,
    opacity: 0.9,
    fontWeight: '500',
    textAlign: 'center',
  },

  /* PROGRESS BAR */
  progressSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBarTrack: {
    width: width - 80,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Palette.primaryYellow, // #F5CB58
    borderRadius: 5,
  },
  progressPercent: {
    marginTop: 10,
    color: Palette.white,
    fontWeight: '800',
    fontSize: 13,
  },
});
