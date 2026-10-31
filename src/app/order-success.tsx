import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = (params.orderId as string) || 'ORD-9842';

  const checkScale = useSharedValue(0);
  const badgeBounce = useSharedValue(50);

  useEffect(() => {
    checkScale.value = withSequence(
      withTiming(1.2, { duration: 400 }),
      withSpring(1.0)
    );
    badgeBounce.value = withSpring(0);
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: badgeBounce.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        {/* CELEBRATION ICON */}
        <Animated.View style={[styles.iconCircle, checkStyle]}>
          <Ionicons name="checkmark-sharp" size={70} color={Palette.darkBrown} />
        </Animated.View>

        <Animated.View style={[styles.textCol, badgeStyle]}>
          <Text style={styles.successTitle}>Order Placed Successfully! 🎉</Text>

          <View style={styles.orderIdBadge}>
            <Text style={styles.orderIdText}>Order ID: {orderId}</Text>
          </View>

          <Text style={styles.successSubtext}>
            Your order has been received by the restaurant. Master Chef is getting it ready for you!
          </Text>

          <View style={styles.etaCard}>
            <Ionicons name="time-outline" size={20} color={Palette.brandOrange} />
            <Text style={styles.etaText}>Estimated Delivery: 20-30 Mins</Text>
          </View>
        </Animated.View>

        {/* ACTION BUTTONS */}
        <View style={styles.buttonCol}>
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() =>
              router.replace({ pathname: '/order/[id]', params: { id: orderId } })
            }
          >
            <MaterialCommunityIcons name="map-marker-path" size={20} color={Palette.darkBrown} />
            <Text style={styles.trackBtnText}>Track Order Live</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => router.replace('/(tabs)/' as any)}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.brandOrange, // #E95322
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Palette.primaryYellow, // #F5CB58
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 28,
  },
  textCol: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Palette.white,
    textAlign: 'center',
  },
  orderIdBadge: {
    backgroundColor: Palette.lightPeach,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 12,
    marginBottom: 16,
  },
  orderIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  successSubtext: {
    fontSize: 13,
    color: Palette.white,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
    marginBottom: 20,
  },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 8,
    marginBottom: 36,
  },
  etaText: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.darkBrown,
  },

  buttonCol: {
    width: '100%',
    gap: 12,
  },
  trackBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.primaryYellow, // #F5CB58
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  trackBtnText: {
    color: Palette.darkBrown,
    fontSize: 15,
    fontWeight: '800',
  },
  homeBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.lightCream, // #F3E9B5
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeBtnText: {
    color: Palette.darkBrown,
    fontSize: 15,
    fontWeight: '800',
  },
});
