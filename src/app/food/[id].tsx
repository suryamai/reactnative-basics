import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { getDishByIdApi, DishItem } from '@/services/menu-service';
import { placeOrderApi } from '@/services/order-service';

const { width } = Dimensions.get('window');

const SIZES = [
  { id: 'S', label: 'Small', priceMultiplier: 1.0 },
  { id: 'M', label: 'Medium', priceMultiplier: 1.2 },
  { id: 'L', label: 'Large', priceMultiplier: 1.4 },
];

const ADDONS = [
  { id: 'extra_cheese', name: 'Extra Cheddar Cheese', price: 1.5 },
  { id: 'extra_patty', name: 'Extra Portion', price: 3.0 },
  { id: 'spicy_sauce', name: 'Special Spicy Dip', price: 0.75 },
];

export default function FoodDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const foodId = (params.id as string) || '1';

  const [dish, setDish] = useState<DishItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch Dish Details from API
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const liveDish = await getDishByIdApi(foodId);
        if (liveDish && liveDish.name) {
          setDish(liveDish);
        } else {
          // Fallback
          setDish({
            id: foodId,
            name: 'Special Delicious Item',
            price: 12.99,
            category: 'Main Course',
            description: 'Freshly prepared delicious item with authentic flavors and fresh ingredients.',
            image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
          });
        }
      } catch (e) {
        console.log('Using fallback dish details');
        setDish({
          id: foodId,
          name: 'Special Delicious Item',
          price: 12.99,
          category: 'Main Course',
          description: 'Freshly prepared delicious item with authentic flavors and fresh ingredients.',
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [foodId]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: !prev[addonId],
    }));
  };

  // Price Calculation
  const basePrice = typeof dish?.price === 'number' ? dish.price : parseFloat(dish?.price || '10.0');
  const sizeMultiplier = SIZES.find((s) => s.id === selectedSize)?.priceMultiplier || 1.0;
  const baseItemPrice = basePrice * sizeMultiplier;

  const addonsTotal = ADDONS.reduce((sum, addon) => {
    return selectedAddons[addon.id] ? sum + addon.price : sum;
  }, 0);

  const totalPrice = ((baseItemPrice + addonsTotal) * quantity).toFixed(2);

  // Place Order API Integration
  const handleAddToCart = async () => {
    setPlacingOrder(true);
    try {
      await placeOrderApi({
        customer_name: user?.name || 'Surya',
        item_id: dish?.id || foodId,
        quantity: quantity,
      });
      setToastMessage('Order placed & added to cart! 🛒');
    } catch (e) {
      setToastMessage('Item added to cart! 🛒');
    } finally {
      setPlacingOrder(false);
      setTimeout(() => {
        setToastMessage('');
      }, 2500);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={Palette.brandOrange} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* TOP HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Palette.darkBrown} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Food Details</Text>

        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? Palette.brandOrange : Palette.darkBrown}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO IMAGE SHOWCASE */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                dish?.image_url ||
                dish?.image ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
            }}
            style={styles.foodHeroImage}
          />

          <View style={styles.floatingBadges}>
            <View style={styles.badgePill}>
              <Ionicons name="time-outline" size={14} color={Palette.brandOrange} />
              <Text style={styles.badgeText}>{dish?.time || '15-25 min'}</Text>
            </View>

            <View style={styles.badgePill}>
              <Ionicons name="star" size={14} color={Palette.brandOrange} />
              <Text style={styles.badgeText}>{dish?.rating || '4.8'}</Text>
            </View>
          </View>
        </View>

        {/* TITLE & QUANTITY SECTION */}
        <View style={styles.detailsCard}>
          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <Text style={styles.foodTitle}>{dish?.name}</Text>
              <Text style={styles.categoryText}>{dish?.category}</Text>
            </View>

            {/* QUANTITY CONTROLLER */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={18} color={Palette.darkBrown} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, { backgroundColor: Palette.brandOrange }]}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Ionicons name="add" size={18} color={Palette.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.sectionHeaderTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {dish?.description ||
              'Freshly prepared dish with authentic spices, premium ingredients, and served hot.'}
          </Text>

          {/* SIZE SELECTOR */}
          <Text style={styles.sectionHeaderTitle}>Select Portion Size</Text>
          <View style={styles.sizeRow}>
            {SIZES.map((size) => {
              const isSelected = selectedSize === size.id;
              return (
                <TouchableOpacity
                  key={size.id}
                  onPress={() => setSelectedSize(size.id)}
                  style={[
                    styles.sizePill,
                    isSelected ? styles.sizePillActive : styles.sizePillInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizePillText,
                      isSelected ? styles.sizeTextActive : styles.sizeTextInactive,
                    ]}
                  >
                    {size.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ADD-ONS CHECKLIST */}
          <Text style={styles.sectionHeaderTitle}>Add-ons & Toppings</Text>
          <View style={styles.addonsList}>
            {ADDONS.map((addon) => {
              const isChecked = !!selectedAddons[addon.id];
              return (
                <TouchableOpacity
                  key={addon.id}
                  activeOpacity={0.8}
                  onPress={() => toggleAddon(addon.id)}
                  style={[
                    styles.addonCard,
                    isChecked ? styles.addonCardSelected : styles.addonCardUnselected,
                  ]}
                >
                  <View style={styles.addonLeft}>
                    <Ionicons
                      name={isChecked ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={isChecked ? Palette.brandOrange : Palette.grayText}
                    />
                    <Text style={styles.addonName}>{addon.name}</Text>
                  </View>
                  <Text style={styles.addonPrice}>+${addon.price.toFixed(2)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* TOAST NOTIFICATION */}
      {toastMessage ? (
        <View style={styles.toastNotification}>
          <Ionicons name="checkmark-circle" size={20} color={Palette.white} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      {/* STICKY BOTTOM ACTION BAR */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <View style={styles.priceCol}>
          <Text style={styles.totalPriceLabel}>Total Price</Text>
          <Text style={styles.totalPriceValue}>${totalPrice}</Text>
        </View>

        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          disabled={placingOrder}
        >
          {placingOrder ? (
            <ActivityIndicator color={Palette.darkBrown} />
          ) : (
            <>
              <MaterialCommunityIcons name="shopping" size={22} color={Palette.darkBrown} />
              <Text style={styles.addToCartBtnText}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Palette.background,
  },
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.darkBrown,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  /* HERO IMAGE */
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    position: 'relative',
  },
  foodHeroImage: {
    width: width - 40,
    height: 240,
    borderRadius: 28,
  },
  floatingBadges: {
    position: 'absolute',
    bottom: -16,
    flexDirection: 'row',
    backgroundColor: Palette.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 16,
    borderWidth: 1,
    borderColor: Palette.lightCream,
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.darkBrown,
  },

  /* DETAILS CARD */
  detailsCard: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleCol: {
    flex: 1,
    marginRight: 10,
  },
  foodTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Palette.darkBrown,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.brandOrange,
    marginTop: 2,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: Palette.lightCream,
    gap: 12,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: Palette.lightCream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.darkBrown,
    minWidth: 16,
    textAlign: 'center',
  },

  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.darkBrown,
    marginTop: 20,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: Palette.grayText,
    lineHeight: 20,
    fontWeight: '500',
  },

  /* SIZES */
  sizeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sizePill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  sizePillActive: {
    backgroundColor: Palette.primaryYellow,
    borderColor: Palette.primaryYellow,
  },
  sizePillInactive: {
    backgroundColor: Palette.white,
    borderColor: Palette.lightCream,
  },
  sizePillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  sizeTextActive: {
    color: Palette.darkBrown,
  },
  sizeTextInactive: {
    color: Palette.darkBrown,
  },

  /* ADDONS */
  addonsList: {
    gap: 10,
    marginTop: 4,
  },
  addonCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Palette.white,
    borderWidth: 1,
  },
  addonCardSelected: {
    borderColor: Palette.brandOrange,
    backgroundColor: '#FFF8F5',
  },
  addonCardUnselected: {
    borderColor: Palette.lightCream,
  },
  addonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addonName: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.darkBrown,
  },
  addonPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.brandOrange,
  },

  /* TOAST */
  toastNotification: {
    position: 'absolute',
    bottom: 95,
    alignSelf: 'center',
    backgroundColor: Palette.darkBrown,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  toastText: {
    color: Palette.white,
    fontWeight: '700',
    fontSize: 13,
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
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  priceCol: {
    justifyContent: 'center',
  },
  totalPriceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.grayText,
    textTransform: 'uppercase',
  },
  totalPriceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Palette.brandOrange,
    marginTop: 2,
  },
  addToCartBtn: {
    backgroundColor: Palette.primaryYellow,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: Palette.primaryYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addToCartBtnText: {
    color: Palette.darkBrown,
    fontSize: 15,
    fontWeight: '800',
  },
});
