import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { CURRENCY_SYMBOL } from '@/constants/config';
import { useCartStore } from '@/store/cartStore';
import { validatePromoApi } from '@/services/order-service';

export default function CartScreen() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    loadCart,
    getSubtotal,
    getTotal,
    applyPromo,
    discountAmount,
    promoCode,
    deliveryFee,
    taxRate,
  } = useCartStore();

  const [inputPromo, setInputPromo] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMsg, setPromoMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const subtotal = getSubtotal();
  const tax = subtotal * taxRate;
  const grandTotal = getTotal();

  const handleApplyPromo = async () => {
    if (!inputPromo.trim()) return;
    setPromoLoading(true);
    setPromoMsg(null);

    try {
      const res = await validatePromoApi(inputPromo);
      if (res.valid) {
        applyPromo(inputPromo.toUpperCase(), res.discount);
        setPromoMsg({ text: res.message, isError: false });
      } else {
        setPromoMsg({ text: res.message, isError: true });
      }
    } catch (e) {
      setPromoMsg({ text: 'Failed to validate promo code', isError: true });
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* TOP HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>My Cart ({items.length})</Text>

        {items.length > 0 ? (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {items.length === 0 ? (
        /* EMPTY CART STATE */
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="cart-outline" size={100} color={Palette.lightCream} />
          <Text style={styles.emptyTitle}>Your cart is empty!</Text>
          <Text style={styles.emptySubtext}>
            Looks like you haven't added any delicious food items to your cart yet.
          </Text>

          <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(tabs)/' as any)}>
            <Text style={styles.browseBtnText}>Explore Menu 🍔</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* CART CONTENT */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* CART ITEMS LIST */}
          <View style={styles.itemList}>
            {items.map((item) => (
              <View key={item.id} style={styles.cartCard}>
                <Image
                  source={{
                    uri:
                      item.image_url ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
                  }}
                  style={styles.itemImage}
                />

                <View style={styles.itemDetails}>
                  <View style={styles.itemHeaderRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Ionicons name="trash-outline" size={18} color="#D32F2F" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemPrice}>
                    {CURRENCY_SYMBOL}
                    {(item.price * item.quantity).toFixed(0)}
                  </Text>

                  {/* QUANTITY CONTROLLER */}
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Ionicons name="remove" size={16} color={Palette.darkBrown} />
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={[styles.qtyBtn, { backgroundColor: Palette.brandOrange }]}
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Ionicons name="add" size={16} color={Palette.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* PROMO CODE SECTION */}
          <Text style={styles.sectionTitle}>Promotions & Coupons</Text>
          <View style={styles.promoContainer}>
            <View style={styles.promoInputRow}>
              <Ionicons name="pricetag-outline" size={20} color={Palette.brandOrange} />
              <TextInput
                style={styles.promoInput}
                placeholder="Enter promo code (e.g. YUM30)"
                placeholderTextColor={Palette.grayText}
                value={inputPromo}
                onChangeText={setInputPromo}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={handleApplyPromo}
                disabled={promoLoading}
              >
                {promoLoading ? (
                  <ActivityIndicator color={Palette.darkBrown} size="small" />
                ) : (
                  <Text style={styles.applyBtnText}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>

            {promoMsg ? (
              <Text
                style={[
                  styles.promoMsgText,
                  promoMsg.isError ? styles.promoErrorText : styles.promoSuccessText,
                ]}
              >
                {promoMsg.text}
              </Text>
            ) : null}
          </View>

          {/* BILL DETAILS */}
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.billCard}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Subtotal</Text>
              <Text style={styles.billValue}>
                {CURRENCY_SYMBOL}
                {subtotal.toFixed(0)}
              </Text>
            </View>

            {discountAmount > 0 ? (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Promo Discount ({promoCode})</Text>
                <Text style={styles.discountValue}>
                  -{CURRENCY_SYMBOL}
                  {discountAmount.toFixed(0)}
                </Text>
              </View>
            ) : null}

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>
                {CURRENCY_SYMBOL}
                {deliveryFee.toFixed(0)}
              </Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Taxes & Service Fee (8%)</Text>
              <Text style={styles.billValue}>
                {CURRENCY_SYMBOL}
                {tax.toFixed(0)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.billRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>
                {CURRENCY_SYMBOL}
                {grandTotal.toFixed(0)}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* STICKY BOTTOM CHECKOUT ACTION BAR */}
      {items.length > 0 ? (
        <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
          <View style={styles.totalCol}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>
              {CURRENCY_SYMBOL}
              {grandTotal.toFixed(0)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => router.push('/checkout')}
          >
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={18} color={Palette.white} />
          </TouchableOpacity>
        </SafeAreaView>
      ) : null}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D32F2F',
  },

  /* EMPTY STATE */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.darkBrown,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 13,
    color: Palette.grayText,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    marginBottom: 28,
  },
  browseBtn: {
    backgroundColor: Palette.brandOrange,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
  },
  browseBtnText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '800',
  },

  /* CONTENT */
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  itemList: {
    gap: 14,
    marginTop: 10,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: Palette.white,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.lightCream,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 14,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.darkBrown,
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: Palette.brandOrange,
    marginTop: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: Palette.lightCream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.darkBrown,
    minWidth: 16,
    textAlign: 'center',
  },

  /* PROMO CODE */
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.darkBrown,
    marginTop: 24,
    marginBottom: 10,
  },
  promoContainer: {
    backgroundColor: Palette.white,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  promoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    fontSize: 13,
    color: Palette.darkBrown,
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: Palette.primaryYellow,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  applyBtnText: {
    color: Palette.darkBrown,
    fontWeight: '800',
    fontSize: 13,
  },
  promoMsgText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    marginLeft: 4,
  },
  promoSuccessText: {
    color: '#2E7D32',
  },
  promoErrorText: {
    color: '#D32F2F',
  },

  /* BILL DETAILS */
  billCard: {
    backgroundColor: Palette.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.lightCream,
    gap: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billLabel: {
    fontSize: 13,
    color: Palette.grayText,
    fontWeight: '500',
  },
  billValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.darkBrown,
  },
  discountValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2E7D32',
  },
  divider: {
    height: 1,
    backgroundColor: Palette.lightCream,
    marginVertical: 4,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  grandTotalValue: {
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
  totalLabel: {
    fontSize: 11,
    color: Palette.grayText,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '900',
    color: Palette.brandOrange,
  },
  checkoutBtn: {
    backgroundColor: Palette.brandOrange,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkoutBtnText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
