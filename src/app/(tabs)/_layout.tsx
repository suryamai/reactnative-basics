import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { useCartStore } from '@/store/cartStore';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { items } = useCartStore();
  const cartCount = items.length;

  return (
    <SafeAreaView edges={['bottom']} style={styles.tabBarContainer}>
      <View style={styles.tabBarContent}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            if (Platform.OS !== 'web') {
              Haptics.selectionAsync().catch(() => {});
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: string = 'home-outline';
          if (route.name === 'index') iconName = 'house';
          else if (route.name === 'search') iconName = 'search';
          else if (route.name === 'cart') iconName = 'bag';
          else if (route.name === 'orders') iconName = 'receipt';
          else if (route.name === 'profile') iconName = 'user';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrapper, isFocused && styles.activePill]}>
                {route.name === 'cart' ? (
                  <View style={{ position: 'relative' }}>
                    <Ionicons
                      name={isFocused ? 'bag' : 'bag-outline'}
                      size={22}
                      color={isFocused ? Palette.brandOrange : 'rgba(57, 23, 19, 0.6)'}
                    />
                    {cartCount > 0 ? (
                      <View style={styles.cartBadge}>
                        <Text style={styles.badgeText}>{cartCount}</Text>
                      </View>
                    ) : null}
                  </View>
                ) : (
                  <Ionicons
                    name={
                      route.name === 'index'
                        ? isFocused ? 'home' : 'home-outline'
                        : route.name === 'search'
                        ? isFocused ? 'search' : 'search-outline'
                        : route.name === 'orders'
                        ? isFocused ? 'receipt' : 'receipt-outline'
                        : isFocused ? 'person' : 'person-outline'
                    }
                    size={22}
                    color={isFocused ? Palette.brandOrange : 'rgba(57, 23, 19, 0.6)'}
                  />
                )}
              </View>

              <Text style={[styles.tabLabel, isFocused ? styles.labelActive : styles.labelInactive]}>
                {label === 'index' ? 'Home' : label === 'search' ? 'Explore' : label === 'cart' ? 'Cart' : label === 'orders' ? 'Orders' : 'Profile'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const [backPressCount, setBackPressCount] = React.useState(0);

  React.useEffect(() => {
    const backAction = () => {
      // If on Android, handle back behavior
      if (Platform.OS === 'android') {
        // If not on Home tab, go to Home tab first
        // (Handled by Expo router or default behavior)
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Explore' }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart' }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: Palette.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: Palette.lightCream,
    shadowColor: Palette.cardShadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarContent: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  iconWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    backgroundColor: Palette.primaryYellow, // #F5CB58 Gold Pill
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  labelActive: {
    color: Palette.brandOrange,
    fontWeight: '800',
  },
  labelInactive: {
    color: 'rgba(57, 23, 19, 0.6)',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Palette.brandOrange,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Palette.white,
    fontSize: 10,
    fontWeight: '900',
  },
});
