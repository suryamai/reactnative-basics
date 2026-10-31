import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { trackOrderApi, OrderItem } from '@/services/order-service';

const STATUS_STEPS = [
  { id: 'received', title: 'Order Confirmed', subtitle: 'Restaurant has accepted your order' },
  { id: 'preparing', title: 'Food Preparing', subtitle: 'Chef is cooking fresh ingredients' },
  { id: 'out_for_delivery', title: 'Out for Delivery', subtitle: 'Rider is on the way with your order' },
  { id: 'delivered', title: 'Order Delivered', subtitle: 'Delivered to Home - 242 Park Ave' },
];

export default function OrderTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = (params.id as string) || 'ORD-9842';

  const [currentStep, setCurrentStep] = useState(1); // 0=Received, 1=Preparing, 2=Out, 3=Delivered
  const [order, setOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const liveOrder = await trackOrderApi(orderId);
        if (liveOrder) setOrder(liveOrder);
      } catch (e) {
        // Fallback
      }
    };
    fetchOrderStatus();

    // Poll status update
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < 3 ? prev + 1 : 3));
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* TOP HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.push('/(tabs)/' as any)}>
          <Ionicons name="chevron-back" size={22} color={Palette.darkBrown} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Live Order Tracking</Text>

        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="call-outline" size={20} color={Palette.brandOrange} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* MAP PLACEHOLDER CARD */}
        <View style={styles.mapCard}>
          <MaterialCommunityIcons name="map-marker-radius" size={48} color={Palette.brandOrange} />
          <Text style={styles.mapTitle}>Live Driver Location</Text>
          <Text style={styles.mapSubtitle}>Rider is 1.2 miles away • Arriving in 15 mins</Text>
        </View>

        {/* ORDER STATUS STEPPER TIMELINE */}
        <Text style={styles.sectionTitle}>Order Status Timeline</Text>
        <View style={styles.timelineCard}>
          {STATUS_STEPS.map((step, idx) => {
            const isDone = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepIndicatorCol}>
                  <View
                    style={[
                      styles.stepDot,
                      isDone ? styles.stepDotActive : styles.stepDotInactive,
                    ]}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={14} color={Palette.white} />
                    ) : (
                      <View style={styles.innerDot} />
                    )}
                  </View>

                  {idx < STATUS_STEPS.length - 1 ? (
                    <View
                      style={[
                        styles.stepLine,
                        idx < currentStep ? styles.stepLineActive : styles.stepLineInactive,
                      ]}
                    />
                  ) : null}
                </View>

                <View style={styles.stepTextCol}>
                  <Text
                    style={[
                      styles.stepTitle,
                      isCurrent ? styles.titleCurrent : isDone ? styles.titleDone : styles.titlePending,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* DRIVER CARD */}
        <Text style={styles.sectionTitle}>Delivery Partner</Text>
        <View style={styles.driverCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            }}
            style={styles.driverAvatar}
          />

          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Alex Johnson</Text>
            <Text style={styles.driverRating}>⭐ 4.9 (500+ deliveries)</Text>
          </View>

          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="call" size={18} color={Palette.white} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.darkBrown,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  /* MAP */
  mapCard: {
    backgroundColor: Palette.lightPeach,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  mapTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.darkBrown,
    marginTop: 8,
  },
  mapSubtitle: {
    fontSize: 13,
    color: Palette.grayText,
    marginTop: 2,
    fontWeight: '500',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.darkBrown,
    marginTop: 20,
    marginBottom: 10,
  },

  /* TIMELINE */
  timelineCard: {
    backgroundColor: Palette.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 64,
  },
  stepIndicatorCol: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepDotActive: {
    backgroundColor: Palette.brandOrange,
  },
  stepDotInactive: {
    backgroundColor: Palette.lightCream,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.grayText,
  },
  stepLine: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  stepLineActive: {
    backgroundColor: Palette.brandOrange,
  },
  stepLineInactive: {
    backgroundColor: Palette.lightCream,
  },
  stepTextCol: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  titleCurrent: {
    color: Palette.brandOrange,
  },
  titleDone: {
    color: Palette.darkBrown,
  },
  titlePending: {
    color: Palette.grayText,
  },
  stepSubtitle: {
    fontSize: 12,
    color: Palette.grayText,
    marginTop: 2,
  },

  /* DRIVER */
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  driverRating: {
    fontSize: 12,
    color: Palette.grayText,
    marginTop: 2,
  },
  callBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.brandOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
