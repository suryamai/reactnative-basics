import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Order Confirmed! 👨‍🍳',
    message: 'Your order #ORD-9842 is currently being prepared by Royal Biryani House.',
    time: '10 mins ago',
    read: false,
    type: 'order',
  },
  {
    id: '2',
    title: '30% OFF Special Promo 🎉',
    message: 'Use code YUM30 to get $5.00 OFF on your next order today!',
    time: '2 hours ago',
    read: false,
    type: 'promo',
  },
  {
    id: '3',
    title: 'Order Delivered! 🛵',
    message: 'Your order #ORD-7621 was delivered. Hope you enjoyed the food!',
    time: 'Yesterday',
    read: true,
    type: 'order',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* TOP HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Palette.darkBrown} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markReadText}>Mark Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.list}>
          {notifications.map((item) => (
            <View
              key={item.id}
              style={[
                styles.notifCard,
                !item.read ? styles.unreadCard : styles.readCard,
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  item.type === 'promo' ? styles.promoIconBg : styles.orderIconBg,
                ]}
              >
                <MaterialCommunityIcons
                  name={item.type === 'promo' ? 'tag-outline' : 'bike'}
                  size={22}
                  color={item.type === 'promo' ? Palette.darkBrown : Palette.brandOrange}
                />
              </View>

              <View style={styles.textCol}>
                <View style={styles.titleRow}>
                  <Text style={styles.titleText}>{item.title}</Text>
                  {!item.read ? <View style={styles.unreadDot} /> : null}
                </View>
                <Text style={styles.messageText}>{item.message}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          ))}
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
  markReadText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.brandOrange,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  list: {
    gap: 12,
    marginTop: 10,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: Palette.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  unreadCard: {
    borderColor: Palette.primaryYellow,
    backgroundColor: '#FFFDF5',
  },
  readCard: {},
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderIconBg: {
    backgroundColor: Palette.lightPeach,
  },
  promoIconBg: {
    backgroundColor: Palette.primaryYellow,
  },

  textCol: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.brandOrange,
  },
  messageText: {
    fontSize: 12,
    color: Palette.grayText,
    marginTop: 4,
    lineHeight: 18,
  },
  timeText: {
    fontSize: 11,
    color: Palette.grayText,
    fontWeight: '600',
    marginTop: 6,
  },
});
