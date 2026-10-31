import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
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
import { getDishesApi, DishItem } from '@/services/menu-service';

const RECENT_SEARCHES = ['Biryani', 'Paneer Butter Masala', 'Masala Dosa', 'Burger', 'Pizza'];

export default function SearchScreen() {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [dishes, setDishes] = useState<DishItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setDishes([]);
      return;
    }

    const searchDishes = async () => {
      setLoading(true);
      try {
        const results = await getDishesApi({ search: query, limit: 30 });
        if (Array.isArray(results)) {
          setDishes(results);
        }
      } catch (e) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      searchDishes();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* SEARCH HEADER */}
      <View style={styles.headerRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Palette.darkBrown} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search 540+ dishes, ingredients..."
            placeholderTextColor={Palette.grayText}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={Palette.grayText} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* DIET TOGGLES */}
      <View style={styles.dietRow}>
        <TouchableOpacity
          style={[styles.dietPill, selectedDiet === 'all' && styles.dietActive]}
          onPress={() => setSelectedDiet('all')}
        >
          <Text style={[styles.dietText, selectedDiet === 'all' && styles.dietTextActive]}>
            All Dishes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dietPill, selectedDiet === 'veg' && styles.dietActive]}
          onPress={() => setSelectedDiet('veg')}
        >
          <Ionicons name="leaf-outline" size={14} color={selectedDiet === 'veg' ? Palette.darkBrown : '#2E7D32'} />
          <Text style={[styles.dietText, selectedDiet === 'veg' && styles.dietTextActive]}>
            Pure Veg 🥬
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dietPill, selectedDiet === 'non-veg' && styles.dietActive]}
          onPress={() => setSelectedDiet('non-veg')}
        >
          <MaterialCommunityIcons name="food-drumstick-outline" size={14} color={selectedDiet === 'non-veg' ? Palette.darkBrown : Palette.brandOrange} />
          <Text style={[styles.dietText, selectedDiet === 'non-veg' && styles.dietTextActive]}>
            Non-Veg 🍗
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!query.trim() ? (
          /* RECENT SEARCHES */
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <View style={styles.recentChipsRow}>
              {RECENT_SEARCHES.map((keyword, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.recentChip}
                  onPress={() => setQuery(keyword)}
                >
                  <Ionicons name="time-outline" size={14} color={Palette.grayText} />
                  <Text style={styles.recentChipText}>{keyword}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={Palette.brandOrange} />
          </View>
        ) : dishes.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No dishes found for "{query}"</Text>
            <Text style={styles.emptySubtext}>Try searching for 'biryani', 'paneer', or 'dosa'</Text>
          </View>
        ) : (
          /* RESULTS LIST */
          <View style={styles.resultsList}>
            {dishes.map((dish) => (
              <TouchableOpacity
                key={dish.id}
                style={styles.dishCard}
                onPress={() =>
                  router.push({ pathname: '/food/[id]', params: { id: String(dish.id) } })
                }
              >
                <Image
                  source={{
                    uri:
                      dish.image_url ||
                      dish.image ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
                  }}
                  style={styles.dishImage}
                />

                <View style={styles.dishInfo}>
                  <Text style={styles.dishTitle}>{dish.name}</Text>
                  <Text style={styles.dishCategory}>{dish.category}</Text>
                  <Text style={styles.dishPrice}>
                    {CURRENCY_SYMBOL}
                    {typeof dish.price === 'number' ? dish.price : dish.price}
                  </Text>
                </View>

                <TouchableOpacity style={styles.addBtn}>
                  <Ionicons name="add" size={18} color={Palette.white} />
                </TouchableOpacity>
              </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Palette.darkBrown,
    fontWeight: '600',
  },

  dietRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  dietPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.lightCream,
    gap: 6,
  },
  dietActive: {
    backgroundColor: Palette.primaryYellow,
    borderColor: Palette.primaryYellow,
  },
  dietText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.darkBrown,
  },
  dietTextActive: {
    color: Palette.darkBrown,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  recentSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.darkBrown,
    marginBottom: 12,
  },
  recentChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.lightCream,
    gap: 6,
  },
  recentChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.darkBrown,
  },

  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  emptySubtext: {
    fontSize: 12,
    color: Palette.grayText,
    marginTop: 4,
  },

  resultsList: {
    gap: 12,
  },
  dishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  dishImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  dishInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dishTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  dishCategory: {
    fontSize: 11,
    color: Palette.grayText,
    marginTop: 2,
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: Palette.brandOrange,
    marginTop: 4,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Palette.brandOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
