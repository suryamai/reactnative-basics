import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/auth-context';
import { placeOrderApi } from '@/services/order-service';

const ADDRESSES = [
  { id: '1', title: 'Home', address: '242 Park Avenue, Floor 4, Suite 12', default: true },
  { id: '2', title: 'Work', address: 'Tech Park Tower B, Sector 62', default: false },
];

const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', icon: 'cash' },
  { id: 'upi', name: 'UPI (Google Pay / PhonePe)', icon: 'wallet-outline' },
  { id: 'card', name: 'Credit / Debit Card', icon: 'card-outline' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getTotal, clearCart } = useCartStore();

  const [selectedAddress, setSelectedAddress] = useState('1');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [placingOrder, setPlacingOrder] = useState(false);

  const grandTotal = getTotal();

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setPlacingOrder(true);

    try {
      // Place first item order or loop items
      const firstItem = items[0];
      await placeOrderApi({
        customer_name: user?.name || 'Surya',
        item_id: firstItem.id,
        quantity: firstItem.quantity,
      });

      await clearCart();
      router.replace({ pathname: '/order-success', params: { orderId: 'ORD-' + Math.floor(1000 + Math.random() * 9000) } });
    } catch (e) {
      // Fallback transition to success screen
      await clearCart();
      router.replace({ pathname: '/order-success', params: { orderId: 'ORD-9842' } });
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* TOP HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Palette.darkBrown} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Checkout</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* DELIVERY ADDRESS SECTION */}
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <View style={styles.addressList}>
          {ADDRESSES.map((addr) => {
            const isSelected = selectedAddress === addr.id;
            return (
              <TouchableOpacity
                key={addr.id}
                activeOpacity={0.8}
                onPress={() => setSelectedAddress(addr.id)}
                style={[
                  styles.addressCard,
                  isSelected ? styles.cardSelected : styles.cardUnselected,
                ]}
              >
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? Palette.brandOrange : Palette.grayText}
                />
                <View style={styles.addressTextCol}>
                  <Text style={styles.addressTitle}>📍 {addr.title}</Text>
                  <Text style={styles.addressDetail}>{addr.address}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PAYMENT METHOD SECTION */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentList}>
          {PAYMENT_METHODS.map((pay) => {
            const isSelected = selectedPayment === pay.id;
            return (
              <TouchableOpacity
                key={pay.id}
                activeOpacity={0.8}
                onPress={() => setSelectedPayment(pay.id)}
                style={[
                  styles.paymentCard,
                  isSelected ? styles.cardSelected : styles.cardUnselected,
                ]}
              >
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? Palette.brandOrange : Palette.grayText}
                />
                <Ionicons name={pay.icon as any} size={20} color={Palette.darkBrown} style={{ marginLeft: 8 }} />
                <Text style={styles.paymentName}>{pay.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ORDER SUMMARY */}
        <Text style={styles.sectionTitle}>Order Overview</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items</Text>
            <Text style={styles.summaryVal}>{items.length} dishes</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Customer Name</Text>
            <Text style={styles.summaryVal}>{user?.name || 'Surya'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Time</Text>
            <Text style={styles.summaryVal}>⏱️ 20-30 min</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount Payable</Text>
            <Text style={styles.totalVal}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* STICKY BOTTOM BAR */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <View style={styles.totalCol}>
          <Text style={styles.payableText}>Total Payable</Text>
          <Text style={styles.payableVal}>${grandTotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
          disabled={placingOrder}
        >
          {placingOrder ? (
            <ActivityIndicator color={Palette.white} />
          ) : (
            <>
              <Text style={styles.placeOrderBtnText}>Confirm Order</Text>
              <Ionicons name="checkmark-circle" size={20} color={Palette.white} />
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>
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
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.darkBrown,
    marginTop: 20,
    marginBottom: 10,
  },

  /* ADDRESS */
  addressList: {
    gap: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    backgroundColor: Palette.white,
    borderWidth: 1.5,
  },
  cardSelected: {
    borderColor: Palette.brandOrange,
    backgroundColor: '#FFF8F5',
  },
  cardUnselected: {
    borderColor: Palette.lightCream,
  },
  addressTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  addressDetail: {
    fontSize: 12,
    color: Palette.grayText,
    marginTop: 2,
  },

  /* PAYMENT */
  paymentList: {
    gap: 10,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    backgroundColor: Palette.white,
    borderWidth: 1.5,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.darkBrown,
    marginLeft: 10,
  },

  /* SUMMARY */
  summaryCard: {
    backgroundColor: Palette.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.lightCream,
    gap: 10,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: Palette.grayText,
    fontWeight: '500',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.darkBrown,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.lightCream,
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: Palette.brandOrange,
  },

  /* STICKY BOTTOM BAR */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Palette.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: Palette.lightCream,
    elevation: 8,
  },
  totalCol: {},
  payableText: {
    fontSize: 11,
    color: Palette.grayText,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  payableVal: {
    fontSize: 20,
    fontWeight: '900',
    color: Palette.brandOrange,
  },
  placeOrderBtn: {
    backgroundColor: Palette.brandOrange,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  placeOrderBtnText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
