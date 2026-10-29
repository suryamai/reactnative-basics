import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { getCategoriesApi, getDishesApi, DishItem } from '@/services/menu-service';

const { width } = Dimensions.get('window');

// Fallback Mock Categories if server offline
const FALLBACK_CATEGORIES = [
  'All',
  'Biryani & Rice',
  'South Indian',
  'North Indian',
  'Pizza & Fast Food',
  'Desserts',
  'Beverages',
];

// Fallback Mock Dishes
const FALLBACK_DISHES: DishItem[] = [
  {
    id: 1,
    name: 'Cheesy Beef Burger',
    category: 'Fast Food',
    price: 8.99,
    rating: '4.8',
    time: '15-20 min',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    name: 'Special Chicken Biryani',
    category: 'Biryani & Rice',
    price: 12.50,
    rating: '4.9',
    time: '20-25 min',
    image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    name: 'Masala Dosa Combo',
    category: 'South Indian',
    price: 7.50,
    rating: '4.7',
    time: '15-20 min',
    image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60',
  },
];

// Mock Nearby Restaurants
const NEARBY_RESTAURANTS = [
  {
    id: '101',
    name: 'Royal Biryani House',
    tags: 'Biryani • North Indian • Mughlai',
    rating: '4.9',
    time: '15-25 min',
    deliveryFee: 'Free Delivery',
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: '102',
    name: 'Southern Tiffins & Meals',
    tags: 'South Indian • Dosa • Pure Veg',
    rating: '4.8',
    time: '20-30 min',
    deliveryFee: '$1.99 Delivery',
    discount: 'Free Drink',
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=500&auto=format&fit=crop&q=60',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dishes, setDishes] = useState<DishItem[]>(FALLBACK_DISHES);
  const [loadingDishes, setLoadingDishes] = useState(false);
  const [favorites, setFavorites] = useState<Record<string | number, boolean>>({
    1: true,
  });

  // Load Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const liveCategories = await getCategoriesApi();
        if (Array.isArray(liveCategories) && liveCategories.length > 0) {
          setCategories(['All', ...liveCategories]);
        }
      } catch (e) {
        console.log('Using fallback categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch Dishes when category or search changes
  useEffect(() => {
    const fetchDishes = async () => {
      setLoadingDishes(true);
      try {
        const categoryFilter = selectedCategory === 'All' ? '' : selectedCategory;
        const liveDishes = await getDishesApi({
          category: categoryFilter,
          search: searchQuery,
          limit: 30,
        });

        if (Array.isArray(liveDishes) && liveDishes.length > 0) {
          setDishes(liveDishes);
        } else if (categoryFilter || searchQuery) {
          setDishes([]);
        } else {
          setDishes(FALLBACK_DISHES);
        }
      } catch (e) {
        console.log('Using fallback dishes');
      } finally {
        setLoadingDishes(false);
      }
    };

    const timer = setTimeout(() => {
      fetchDishes();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const toggleFavorite = (id: string | number) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>Deliver to 📍</Text>
            <TouchableOpacity style={styles.locationSelector}>
              <Text style={styles.locationText}>Home - 242 Park Avenue</Text>
              <Ionicons name="chevron-down" size={16} color={Palette.brandOrange} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBadgeBtn}>
              <Ionicons name="notifications-outline" size={22} color={Palette.darkBrown} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.avatarContainer}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutHeaderBtn} onPress={logout}>
              <Ionicons name="log-out-outline" size={20} color={Palette.brandOrange} />
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO TITLE */}
        <View style={styles.heroTextContainer}>
          <Text style={styles.userGreeting}>Welcome, {user?.name || 'Surya'} 👋</Text>
          <Text style={styles.heroTitle}>
            What do you want to <Text style={{ color: Palette.brandOrange }}>eat</Text> today? 😋
          </Text>
        </View>

        {/* SEARCH & FILTER BAR */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Palette.darkBrown} style={styles.searchIcon} />
            <TextInput
              placeholder="Search 540+ dishes, biryani, paneer..."
              placeholderTextColor={Palette.grayText}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={Palette.grayText} />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={22} color={Palette.darkBrown} />
          </TouchableOpacity>
        </View>

        {/* PROMO BANNER */}
        <View style={styles.promoCard}>
          <View style={styles.promoTextCol}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>SPECIAL OFFER</Text>
            </View>
            <Text style={styles.promoTitle}>30% OFF</Text>
            <Text style={styles.promoSubtitle}>On your first order today!</Text>

            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Order Now</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80',
            }}
            style={styles.promoImage}
          />
        </View>

        {/* CATEGORIES HORIZONTAL SCROLL */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryPill,
                  isSelected ? styles.categoryPillActive : styles.categoryPillInactive,
                ]}
              >
                <View
                  style={[
                    styles.categoryIconCircle,
                    isSelected ? styles.iconCircleActive : styles.iconCircleInactive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      cat.toLowerCase().includes('biryani')
                        ? 'bowl-mix'
                        : cat.toLowerCase().includes('south')
                        ? 'food-variant'
                        : cat.toLowerCase().includes('pizza')
                        ? 'pizza'
                        : cat.toLowerCase().includes('dessert')
                        ? 'cake'
                        : 'silverware-fork-knife'
                    }
                    size={18}
                    color={isSelected ? Palette.darkBrown : Palette.brandOrange}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    isSelected ? styles.categoryTextActive : styles.categoryTextInactive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* POPULAR DISHES SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'Popular Dishes' : selectedCategory}
          </Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All ({dishes.length})</Text>
          </TouchableOpacity>
        </View>

        {loadingDishes ? (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={Palette.brandOrange} />
          </View>
        ) : dishes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No dishes found for "{searchQuery || selectedCategory}"</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularContainer}
          >
            {dishes.map((food) => (
              <TouchableOpacity
                key={food.id}
                activeOpacity={0.9}
                style={styles.foodCard}
                onPress={() =>
                  router.push({ pathname: '/food/[id]', params: { id: String(food.id) } })
                }
              >
                <View style={styles.foodImageWrapper}>
                  <Image
                    source={{
                      uri:
                        food.image_url ||
                        food.image ||
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
                    }}
                    style={styles.foodImage}
                  />
                  <TouchableOpacity
                    style={styles.favBtn}
                    onPress={() => toggleFavorite(food.id)}
                  >
                    <Ionicons
                      name={favorites[food.id] ? 'heart' : 'heart-outline'}
                      size={18}
                      color={favorites[food.id] ? Palette.brandOrange : Palette.darkBrown}
                    />
                  </TouchableOpacity>

                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={Palette.brandOrange} />
                    <Text style={styles.ratingText}>{food.rating || '4.8'}</Text>
                  </View>
                </View>

                <View style={styles.foodInfo}>
                  <Text style={styles.foodTitle} numberOfLines={1}>
                    {food.name}
                  </Text>
                  <Text style={styles.foodCategory}>
                    {food.category} • ⏱️ {food.time || '15-25 min'}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>
                      ${typeof food.price === 'number' ? food.price.toFixed(2) : food.price}
                    </Text>
                    <TouchableOpacity style={styles.addCartBtn}>
                      <Ionicons name="add" size={20} color={Palette.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* TOP RESTAURANTS NEARBY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Restaurants</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.restaurantList}>
          {NEARBY_RESTAURANTS.map((resto) => (
            <TouchableOpacity key={resto.id} activeOpacity={0.9} style={styles.restoCard}>
              <Image source={{ uri: resto.image }} style={styles.restoImage} />
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>{resto.discount}</Text>
              </View>

              <View style={styles.restoDetails}>
                <View style={styles.restoHeaderRow}>
                  <Text style={styles.restoName}>{resto.name}</Text>
                  <View style={styles.restoRatingBox}>
                    <Ionicons name="star" size={13} color={Palette.darkBrown} />
                    <Text style={styles.restoRatingText}>{resto.rating}</Text>
                  </View>
                </View>

                <Text style={styles.restoTags}>{resto.tags}</Text>

                <View style={styles.restoMetaRow}>
                  <Text style={styles.restoMetaText}>⏱️ {resto.time}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.restoMetaText}>🛵 {resto.deliveryFee}</Text>
                </View>
              </View>
            </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.grayText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.darkBrown,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadgeBtn: {
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
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.brandOrange,
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: Palette.primaryYellow,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  logoutHeaderBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.lightPeach,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* HERO TEXT */
  heroTextContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  userGreeting: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.brandOrange,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Palette.darkBrown,
    lineHeight: 34,
  },

  /* SEARCH BAR */
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: Palette.lightCream,
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Palette.darkBrown,
    fontWeight: '500',
  },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: Palette.primaryYellow,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  /* PROMO BANNER */
  promoCard: {
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: Palette.brandOrange,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: Palette.brandOrange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  promoTextCol: {
    flex: 1,
    zIndex: 2,
  },
  promoBadge: {
    backgroundColor: Palette.lightPeach,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  promoBadgeText: {
    color: Palette.darkBrown,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  promoTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Palette.white,
  },
  promoSubtitle: {
    fontSize: 13,
    color: Palette.lightPeach,
    marginTop: 2,
    marginBottom: 14,
    fontWeight: '500',
  },
  promoBtn: {
    backgroundColor: Palette.primaryYellow,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: Palette.darkBrown,
    fontWeight: '800',
    fontSize: 13,
  },
  promoImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: -10,
  },

  /* SECTION HEADERS */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.brandOrange,
  },

  /* CATEGORIES */
  categoriesContainer: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 12,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 8,
  },
  categoryPillActive: {
    backgroundColor: Palette.primaryYellow,
    shadowColor: Palette.primaryYellow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryPillInactive: {
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  categoryIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleActive: {
    backgroundColor: Palette.white,
  },
  iconCircleInactive: {
    backgroundColor: Palette.lightCream,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: Palette.darkBrown,
  },
  categoryTextInactive: {
    color: Palette.darkBrown,
  },

  /* POPULAR FOOD CARDS */
  popularContainer: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 16,
    paddingVertical: 4,
  },
  foodCard: {
    width: width * 0.48,
    backgroundColor: Palette.white,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.lightCream,
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  foodImageWrapper: {
    position: 'relative',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  foodInfo: {
    marginTop: 10,
  },
  foodTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  foodCategory: {
    fontSize: 11,
    color: Palette.grayText,
    marginTop: 2,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceText: {
    fontSize: 17,
    fontWeight: '900',
    color: Palette.brandOrange,
  },
  addCartBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Palette.brandOrange,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Palette.brandOrange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: Palette.grayText,
    fontWeight: '600',
  },

  /* RESTAURANTS */
  restaurantList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  restoCard: {
    backgroundColor: Palette.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Palette.lightCream,
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  restoImage: {
    width: '100%',
    height: 140,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Palette.primaryYellow,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  discountBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  restoDetails: {
    padding: 14,
  },
  restoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restoName: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  restoRatingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.lightCream,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  restoRatingText: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  restoTags: {
    fontSize: 12,
    color: Palette.grayText,
    marginTop: 4,
    fontWeight: '500',
  },
  restoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  restoMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.darkBrown,
  },
  metaDot: {
    fontSize: 12,
    color: Palette.grayText,
  },
});
