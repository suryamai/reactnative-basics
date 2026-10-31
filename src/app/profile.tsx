import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { useBiometrics } from '@/hooks/useBiometrics';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isSupported, isEnrolled, biometricType } = useBiometrics();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handlePickAvatar = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Needed', 'Please allow access to your photo gallery.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (e) {
      // ignore
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

        <Text style={styles.headerTitle}>Profile & Settings</Text>

        <TouchableOpacity style={styles.headerBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={Palette.brandOrange} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AVATAR & USER INFO */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri:
                  avatarUri ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              }}
              style={styles.avatarImage}
            />
            <TouchableOpacity style={styles.cameraBtn} onPress={handlePickAvatar}>
              <Ionicons name="camera" size={14} color={Palette.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || 'Surya M'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'surya@example.com'}</Text>
          <Text style={styles.userPhone}>📱 +1 234 567 8900</Text>
        </View>

        {/* QUICK MENU LINKS */}
        <Text style={styles.sectionTitle}>Account & Orders</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/orders')}
          >
            <Ionicons name="receipt-outline" size={20} color={Palette.brandOrange} />
            <Text style={styles.menuText}>My Orders & History</Text>
            <Ionicons name="chevron-forward" size={18} color={Palette.grayText} />
          </TouchableOpacity>

          <View style={styles.itemDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/cart')}
          >
            <Ionicons name="cart-outline" size={20} color={Palette.brandOrange} />
            <Text style={styles.menuText}>My Shopping Cart</Text>
            <Ionicons name="chevron-forward" size={18} color={Palette.grayText} />
          </TouchableOpacity>
        </View>

        {/* SECURITY & PREFERENCES */}
        <Text style={styles.sectionTitle}>Security & Preferences</Text>
        <View style={styles.menuGroup}>
          {isSupported ? (
            <View style={styles.menuItemSwitch}>
              <View style={styles.menuLeftRow}>
                <Ionicons
                  name={biometricType === 'Face ID' ? 'scan-outline' : 'finger-print-outline'}
                  size={20}
                  color={Palette.brandOrange}
                />
                <Text style={styles.menuText}>{biometricType} Login</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: Palette.lightCream, true: Palette.primaryYellow }}
                thumbColor={biometricEnabled ? Palette.brandOrange : '#f4f3f4'}
              />
            </View>
          ) : null}

          {isSupported ? <View style={styles.itemDivider} /> : null}

          <View style={styles.menuItemSwitch}>
            <View style={styles.menuLeftRow}>
              <Ionicons name="notifications-outline" size={20} color={Palette.brandOrange} />
              <Text style={styles.menuText}>Order Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Palette.lightCream, true: Palette.primaryYellow }}
              thumbColor={notificationsEnabled ? Palette.brandOrange : '#f4f3f4'}
            />
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutFullBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={Palette.white} />
          <Text style={styles.logoutFullBtnText}>Log Out Account</Text>
        </TouchableOpacity>

        <Text style={styles.appVersionText}>YumQuick v2.0.0 • React Native + Python API</Text>
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

  /* USER CARD */
  userCard: {
    backgroundColor: Palette.white,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: Palette.primaryYellow,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.brandOrange,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Palette.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: '900',
    color: Palette.darkBrown,
  },
  userEmail: {
    fontSize: 13,
    color: Palette.grayText,
    marginTop: 2,
    fontWeight: '500',
  },
  userPhone: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.darkBrown,
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.darkBrown,
    marginTop: 22,
    marginBottom: 10,
  },

  /* MENU GROUP */
  menuGroup: {
    backgroundColor: Palette.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Palette.lightCream,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuItemSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  menuLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.darkBrown,
    marginLeft: 12,
    flex: 1,
  },
  itemDivider: {
    height: 1,
    backgroundColor: Palette.lightCream,
  },

  /* LOGOUT BUTTON */
  logoutFullBtn: {
    backgroundColor: Palette.brandOrange,
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 30,
  },
  logoutFullBtnText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '800',
  },
  appVersionText: {
    textAlign: 'center',
    fontSize: 11,
    color: Palette.grayText,
    marginTop: 16,
    fontWeight: '600',
  },
});
