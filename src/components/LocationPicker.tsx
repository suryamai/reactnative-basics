import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette } from '@/constants/colors';
import { BottomSheet } from './BottomSheet';
import { useLocationStore } from '@/store/locationStore';

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
}

export const LocationPickerModal: React.FC<LocationPickerProps> = ({
  visible,
  onClose,
}) => {
  const {
    activeAddress,
    areaName,
    savedAddresses,
    setLocation,
    requestGpsLocation,
  } = useLocationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleUseGps = async () => {
    setGpsLoading(true);
    const success = await requestGpsLocation();
    setGpsLoading(false);
    if (success) {
      onClose();
    }
  };

  const handleSelectSaved = (title: string, address: string, lat: number, lng: number) => {
    setLocation(address, title, lat, lng);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeight={620}>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Select Delivery Location</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={Palette.darkBrown} />
        </TouchableOpacity>
      </View>

      {/* SEARCH INPUT */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={20} color={Palette.darkBrown} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search area, street, house number..."
          placeholderTextColor={Palette.grayText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* USE GPS BUTTON */}
      <TouchableOpacity
        style={styles.gpsBtn}
        onPress={handleUseGps}
        disabled={gpsLoading}
      >
        {gpsLoading ? (
          <ActivityIndicator color={Palette.brandOrange} size="small" />
        ) : (
          <Ionicons name="location-sharp" size={22} color={Palette.brandOrange} />
        )}
        <View style={styles.gpsTextCol}>
          <Text style={styles.gpsTitle}>Use Current GPS Location</Text>

          <Text style={styles.gpsSubtext}>Enable location to auto-detect address</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Palette.grayText} />
      </TouchableOpacity>

      {/* SAVED ADDRESSES */}
      <Text style={styles.sectionTitle}>Saved Addresses</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 260 }}>
        {savedAddresses.map((addr) => {
          const isSelected = activeAddress === addr.address;
          return (
            <TouchableOpacity
              key={addr.id}
              activeOpacity={0.8}
              onPress={() =>
                handleSelectSaved(addr.title, addr.address, addr.lat, addr.lng)
              }
              style={[
                styles.savedCard,
                isSelected ? styles.cardActive : styles.cardInactive,
              ]}
            >
              <Ionicons
                name={
                  addr.label === 'Home'
                    ? 'home-outline'
                    : addr.label === 'Work'
                    ? 'briefcase-outline'
                    : 'pin-outline'
                }
                size={22}
                color={Palette.brandOrange}
              />
              <View style={styles.addressCol}>
                <Text style={styles.addrTitle}>{addr.title}</Text>
                <Text style={styles.addrDetail} numberOfLines={1}>
                  {addr.address}
                </Text>
              </View>

              {isSelected ? (
                <Ionicons name="checkmark-circle" size={20} color={Palette.brandOrange} />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: Palette.lightCream,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Palette.darkBrown,
    fontWeight: '600',
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Palette.brandOrange,
    marginBottom: 20,
  },
  gpsTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  gpsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.brandOrange,
  },
  gpsSubtext: {
    fontSize: 12,
    color: Palette.grayText,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.darkBrown,
    marginBottom: 10,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.white,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  cardActive: {
    borderColor: Palette.brandOrange,
    backgroundColor: '#FFFBF9',
  },
  cardInactive: {
    borderColor: Palette.lightCream,
  },
  addressCol: {
    marginLeft: 12,
    flex: 1,
  },
  addrTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.darkBrown,
  },
  addrDetail: {
    fontSize: 12,
    color: Palette.grayText,
    marginTop: 2,
  },
});
