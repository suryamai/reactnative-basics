import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { CURRENCY_SYMBOL } from '@/constants/config';
import { getOrderHistoryApi, OrderItem } from '@/services/order-service';
import { useCartStore } from '@/store/cartStore';

const MOCK_ACTIVE_ORDERS: OrderItem[] = [
  {
    id: 'ORD-9842',
    customer_name: 'Surya',
    item_id: '1',
    dish_name: 'Cheesy Beef Burger',
    quantity: 2,
    status: 'preparing',
    price: 199,
    total_price: 398,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    created_at: 'Just now',
  },
];

const MOCK_PAST_ORDERS: OrderItem[] = [
  {
    id: 'ORD-7621',
    customer_name: 'Surya',
    item_id: '2',
    dish_name: 'Pepperoni Supreme Pizza',
    quantity: 1,
    status: 'delivered',
    price: 349,
    total_price: 349,
    image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60',
    created_at: 'Yesterday, 8:30 PM',
  },
  {
    id: 'ORD-5412',
    customer_name: 'Surya',
    item_id: '3',
    dish_name: 'Special Chicken Biryani',
    quantity: 1,
    status: 'delivered',
    price: 280,
    total_price: 280,
    image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60',
    created_at: 'Oct 22, 1:15 PM',
  },
];

export default function OrdersTabScreen() {
  const router = useRouter();
  const { addItem } = useCartStore();

  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const history = await getOrderHistoryApi();
        if (Array.isArray(history) && history.length > 0) {
          setOrders(history);
        } else {
          setOrders(activeTab === 'active' ? MOCK_ACTIVE_ORDERS : MOCK_PAST_ORDERS);
        }
      } catch (e) {
        setOrders(activeTab === 'active' ? MOCK_ACTIVE_ORDERS : MOCK_PAST_ORDERS);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  const handleReorder = async (order: OrderItem) => {
    await addItem({
      id: order.item_id || order.id,
      name: order.dish_name || 'Delicious Dish',
      price: order.price || 199,
      quantity: 1,
      image_url: order.image_url,
    });
    router.push('/(tabs)/cart');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* TOP HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* TAB SWITCHER */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'active' && styles.tabItemActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Active Orders (1)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'past' && styles.tabItemActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Past History (2)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={Palette.brandOrange} />
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={80} color={Palette.lightCream} />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtext}>You don't have any {activeTab} orders at the moment.</Text>
          </View>
        ) : (
          <View style={styles.orderList}>
            {orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.orderIdText}>{order.id}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      order.status === 'delivered'
                        ? styles.badgeDelivered
                        : styles.badgePreparing,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        order.status === 'delivered'
                          ? styles.textDelivered
                          : styles.textPreparing,
                      ]}
                    >
                      {order.status === 'delivered' ? '✓ Delivered' : '👨‍🍳 Preparing'}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Image
                    source={{
                      uri:
                        order.image_url ||
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
                    }}
                    style={styles.dishImage}
                  />

                  <View style={styles.dishInfo}>
                    <Text style={styles.dishName}>{order.dish_name || 'Delicious Meal'}</Text>
                    <Text style={styles.dishMeta}>
                      Qty: {order.quantity} • {order.created_at || 'Recently'}
                    </Text>
                    <Text style={styles.totalPrice}>
                      {CURRENCY_SYMBOL}
                      {typeof order.total_price === 'number' ? order.total_price : '398'}
                    </Text>
                  </View>
                </View>

                {/* CARD ACTIONS */}
                <View style={styles.cardActionsRow}>
                  {activeTab === 'active' ? (
                    <TouchableOpacity
                      style={styles.trackActionBtn}
                      onPress={() =>
                        router.push({ pathname: '/order/[id]', params: { id: String(order.id) } })
                      }
                    >
                      <Ionicons name="map-outline" size={16} color={Palette.darkBrown} />
                      <Text style={styles.trackActionText}>Track Order Live</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.reorderBtn}
                        onPress={() => handleReorder(order)}
                      >
                        <Ionicons name="refresh-outline" size={16} color={Palette.white} />
                        <Text style={styles.reorderBtnText}>Reorder Dish</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.rateBtn}>
                        <Ionicons name="star-outline" size={16} color={Palette.darkBrown} />
                        <Text style={styles.rateBtnText}>Rate</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.darkBrown,
  },

  /* TAB BAR */
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Palette.lightCream,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabItemActive: {
    backgroundColor: Palette.primaryYellow,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: Palette.darkBrown,
  },
  tabTextInactive: {
    color: Palette.grayText,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.darkBrown,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: Palette.grayText,
    marginTop: 4,
  },

  /* LIST */
  orderList: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: Palette.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: Palette.lightCream,
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgePreparing: {
    backgroundColor: Palette.lightPeach,
  },
  badgeDelivered: {
    backgroundColor: '#E8F5E9',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  textPreparing: {
    color: Palette.brandOrange,
  },
  textDelivered: {
    color: '#2E7D32',
  },

  cardBody: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
  },
  dishImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
  },
  dishInfo: {
    marginLeft: 14,
    flex: 1,
  },
  dishName: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  dishMeta: {
    fontSize: 12,
    color: Palette.grayText,
    marginTop: 2,
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: Palette.brandOrange,
    marginTop: 4,
  },

  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
  },
  trackActionBtn: {
    flex: 1,
    backgroundColor: Palette.primaryYellow,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  trackActionText: {
    color: Palette.darkBrown,
    fontSize: 13,
    fontWeight: '800',
  },
  reorderBtn: {
    flex: 2,
    backgroundColor: Palette.brandOrange,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  reorderBtnText: {
    color: Palette.white,
    fontSize: 13,
    fontWeight: '800',
  },
  rateBtn: {
    flex: 1,
    backgroundColor: Palette.lightCream,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  rateBtnText: {
    color: Palette.darkBrown,
    fontSize: 13,
    fontWeight: '800',
  },
});
